import { test } from "node:test";
import assert from "node:assert/strict";

// Must be set before the first getFirestore() call (in orders.ts, imported
// below) — points the Admin SDK at the local emulator instead of prod.
process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
process.env.GCLOUD_PROJECT ??= "demo-donaijacargo-test";

import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { placeOrderForUser } from "./orders";

if (!getApps().length) initializeApp({ projectId: process.env.GCLOUD_PROJECT });
const db = getFirestore();

let counter = 0;
function freshUid() {
  counter += 1;
  return `test-user-${Date.now()}-${counter}`;
}

async function seedWallet(uid: string, balance: number) {
  await db.collection("users").doc(uid).collection("wallet").doc("current").set({ balance, walletId: `WLT-TEST-${uid}`, currency: "NGN" });
}

async function seedProduct(id: string, name: string, price: number) {
  await db.collection("products").doc(id).set({ name, price, emoji: "🎧", category: "Test", rating: 5, ratingCount: 1 });
}

async function setCartItem(uid: string, productId: string, qty: number) {
  await db.collection("users").doc(uid).collection("cart").doc(productId).set({ productId, qty });
}

test("happy path: computes total server-side, debits the wallet, writes the order, clears the cart", async () => {
  const uid = freshUid();
  await seedProduct("widget", "Widget", 1000);
  await seedProduct("gadget", "Gadget", 2500);
  await seedWallet(uid, 10_000);
  await setCartItem(uid, "widget", 2);
  await setCartItem(uid, "gadget", 1);

  const expectedTotal = 1000 * 2 + 2500 * 1;
  const result = await placeOrderForUser(db, uid);

  assert.equal(result.total, expectedTotal);
  assert.equal(result.balance, 10_000 - expectedTotal);

  const orderSnap = await db.collection("orders").doc(result.id).get();
  assert.ok(orderSnap.exists);
  const order = orderSnap.data()!;
  assert.equal(order.ownerUid, uid);
  assert.equal(order.status, "placed");
  assert.equal(order.total, expectedTotal);
  assert.equal(order.items.length, 2);
  const widgetLine = order.items.find((i: { productId: string }) => i.productId === "widget");
  assert.deepEqual(widgetLine, { productId: "widget", name: "Widget", emoji: "🎧", price: 1000, qty: 2 });

  const walletSnap = await db.collection("users").doc(uid).collection("wallet").doc("current").get();
  assert.equal(walletSnap.data()!.balance, 10_000 - expectedTotal);

  const cartSnap = await db.collection("users").doc(uid).collection("cart").get();
  assert.equal(cartSnap.size, 0, "cart should be fully cleared after a successful order");
});

test("insufficient balance: rejects, and leaves the wallet, cart, and orders untouched", async () => {
  const uid = freshUid();
  await seedProduct("widget", "Widget", 1000);
  await seedWallet(uid, 500); // cart will cost 1000, more than the balance
  await setCartItem(uid, "widget", 1);

  await assert.rejects(
    () => placeOrderForUser(db, uid),
    (err: any) => {
      assert.equal(err.code, "failed-precondition");
      assert.match(err.message, /insufficient/i);
      return true;
    }
  );

  const walletSnap = await db.collection("users").doc(uid).collection("wallet").doc("current").get();
  assert.equal(walletSnap.data()!.balance, 500, "balance must be unchanged after a failed order");

  const cartSnap = await db.collection("users").doc(uid).collection("cart").get();
  assert.equal(cartSnap.size, 1, "cart must not be cleared after a failed order");

  const ordersSnap = await db.collection("orders").where("ownerUid", "==", uid).get();
  assert.equal(ordersSnap.size, 0, "no order should be created when the balance check fails");
});

test("empty cart is rejected before touching the wallet", async () => {
  const uid = freshUid();
  await seedWallet(uid, 10_000);

  await assert.rejects(
    () => placeOrderForUser(db, uid),
    (err: any) => {
      assert.equal(err.code, "failed-precondition");
      assert.match(err.message, /cart is empty/i);
      return true;
    }
  );
});

test("total always reflects the product's current price, never a client-supplied one", async () => {
  const uid = freshUid();
  await seedProduct("priced-item", "Priced Item", 777);
  await seedWallet(uid, 10_000);
  await setCartItem(uid, "priced-item", 3);
  // Note: the cart doc only ever holds { productId, qty } — there is no
  // price field on it a client could tamper with in the first place.

  const result = await placeOrderForUser(db, uid);
  assert.equal(result.total, 777 * 3);
});
