import { HttpsError, onCall } from "firebase-functions/v2/https";
import { FieldValue, getFirestore, type Firestore } from "firebase-admin/firestore";

export type OrderItem = { productId: string; name: string; emoji: string; price: number; qty: number };
export type PlaceOrderResult = { id: string; total: number; balance: number };

/**
 * Reads the caller's cart, prices it against `products` (never the client),
 * checks the wallet can cover it, then atomically debits the wallet, writes
 * the order, and clears the cart. All in one transaction — if two placeOrder
 * calls race, Firestore retries the loser against fresh data, so it either
 * sees the cart already emptied (and fails with "cart is empty") or the
 * wallet already debited (and re-checks the balance), never double-spending.
 *
 * Exported separately from the onCall wrapper so it can be exercised
 * directly against the Firestore emulator in orders.test.ts, without going
 * through the callable/auth-token machinery.
 */
export async function placeOrderForUser(db: Firestore, uid: string): Promise<PlaceOrderResult> {
  const cartRef = db.collection("users").doc(uid).collection("cart");
  const walletRef = db.collection("users").doc(uid).collection("wallet").doc("current");

  return db.runTransaction(async (tx) => {
    const cartSnap = await tx.get(cartRef);
    if (cartSnap.empty) throw new HttpsError("failed-precondition", "Your cart is empty.");

    const productRefs = cartSnap.docs.map((cartDoc) => db.collection("products").doc(cartDoc.id));
    const [productSnaps, walletSnap] = await Promise.all([Promise.all(productRefs.map((ref) => tx.get(ref))), tx.get(walletRef)]);

    if (!walletSnap.exists) throw new HttpsError("failed-precondition", "Wallet not found.");

    const items: OrderItem[] = [];
    let total = 0;

    cartSnap.docs.forEach((cartDoc, i) => {
      const productSnap = productSnaps[i];
      if (!productSnap.exists) {
        throw new HttpsError("failed-precondition", `Product "${cartDoc.id}" is no longer available.`);
      }
      const product = productSnap.data()!;
      const qty = cartDoc.data().qty as number;
      items.push({ productId: cartDoc.id, name: product.name, emoji: product.emoji, price: product.price, qty });
      total += product.price * qty;
    });

    const balance = walletSnap.data()!.balance as number;
    if (balance < total) {
      throw new HttpsError("failed-precondition", "Insufficient wallet balance.");
    }

    const orderRef = db.collection("orders").doc();
    tx.set(orderRef, {
      ownerUid: uid,
      items,
      total,
      status: "placed",
      createdAt: FieldValue.serverTimestamp(),
    });
    tx.update(walletRef, { balance: balance - total });
    cartSnap.docs.forEach((cartDoc) => tx.delete(cartDoc.ref));

    return { id: orderRef.id, total, balance: balance - total };
  });
}

export const placeOrder = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required.");
  return placeOrderForUser(getFirestore(), request.auth.uid);
});
