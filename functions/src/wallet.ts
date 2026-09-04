import { HttpsError, onCall } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import type { PaymentProvider } from "./payments/PaymentProvider";
import { MockProvider } from "./payments/MockProvider";

const paymentProvider: PaymentProvider = new MockProvider();

type TopUpWalletInput = { amount: number };

// MOCK: no real payment gateway yet (see payments/MockProvider.ts for the
// seam where one plugs in) — but this credits the caller's own real
// wallet/current document in Firestore via a transaction, so the balance
// the user sees is theirs and persists.
export const topUpWallet = onCall<TopUpWalletInput>(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in required.");

  const amount = request.data?.amount;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new HttpsError("invalid-argument", "amount must be a positive number.");
  }

  const uid = request.auth.uid;
  const charge = await paymentProvider.topUp(uid, amount);
  if (!charge.success) {
    throw new HttpsError("aborted", charge.reason);
  }

  const db = getFirestore();
  const walletRef = db.collection("users").doc(uid).collection("wallet").doc("current");

  const balance = await db.runTransaction(async (tx) => {
    const snap = await tx.get(walletRef);
    if (!snap.exists) throw new HttpsError("failed-precondition", "Wallet not found.");
    const nextBalance = (snap.data()!.balance as number) + amount;
    tx.update(walletRef, { balance: nextBalance });
    return nextBalance;
  });

  return { balance, reference: charge.reference };
});
