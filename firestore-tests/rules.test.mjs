// Security-rules tests, run against the Firestore emulator (not production).
// From the repo root: firebase emulators:exec --only firestore "npm --prefix firestore-tests test"
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { doc, deleteDoc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RULES_PATH = join(__dirname, "..", "firestore.rules");

/** @type {import("@firebase/rules-unit-testing").RulesTestEnvironment} */
let testEnv;

function firestoreAs(uid) {
  return testEnv.authenticatedContext(uid).firestore();
}

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "rules-test",
    firestore: { rules: readFileSync(RULES_PATH, "utf8"), host: "127.0.0.1", port: 8080 },
  });
  await testEnv.clearFirestore();

  // Seed fixtures with rules disabled — exactly as trusted backend code
  // (Cloud Functions via the Admin SDK, which bypasses rules entirely)
  // would have written them.
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "shipments/alice-shipment"), {
      ownerUid: "alice",
      fromCity: "Lagos",
      toCity: "Abuja",
      status: "Pending Pickup",
      total: 24704,
      trackingRef: "DN-2026-00001",
      priceBreakdown: { base: 20888, weightCharge: 2750, fuel: 1066, insurance: 0, total: 24704 },
      createdAt: Date.now(),
    });
    await setDoc(doc(db, "users/alice/wallet/current"), { balance: 36650, walletId: "WLT-1001", currency: "NGN" });
    await setDoc(doc(db, "products/test-product"), {
      name: "Test Product",
      price: 1000,
      emoji: "🎧",
      category: "Test",
      rating: 5,
      ratingCount: 1,
    });
  });
});

after(async () => {
  await testEnv?.cleanup();
});

// --- shipments: cross-user read ---

test("a user cannot read another user's shipment", async () => {
  await assertFails(getDoc(doc(firestoreAs("bob"), "shipments/alice-shipment")));
});

test("(control) a user CAN read their own shipment", async () => {
  await assertSucceeds(getDoc(doc(firestoreAs("alice"), "shipments/alice-shipment")));
});

// --- shipments: function-written fields ---

test("a client cannot set trackingRef when creating a shipment", async () => {
  await assertFails(
    setDoc(doc(firestoreAs("alice"), "shipments/forged-1"), {
      ownerUid: "alice",
      fromCity: "Lagos",
      toCity: "Abuja",
      trackingRef: "DN-2026-99999",
    })
  );
});

test("a client cannot overwrite total on their own shipment", async () => {
  await assertFails(updateDoc(doc(firestoreAs("alice"), "shipments/alice-shipment"), { total: 1 }));
});

test("a client cannot overwrite status on their own shipment", async () => {
  await assertFails(updateDoc(doc(firestoreAs("alice"), "shipments/alice-shipment"), { status: "Delivered" }));
});

test("(control) a client CAN update a non-protected field on their own shipment", async () => {
  await assertSucceeds(updateDoc(doc(firestoreAs("alice"), "shipments/alice-shipment"), { toCity: "Kaduna" }));
});

// --- wallet: no client writes at all ---

test("a client cannot write their own wallet balance directly", async () => {
  await assertFails(updateDoc(doc(firestoreAs("alice"), "users/alice/wallet/current"), { balance: 999999 }));
});

test("a client cannot create someone else's wallet", async () => {
  await assertFails(
    setDoc(doc(firestoreAs("bob"), "users/alice/wallet/current2"), { balance: 36650, walletId: "WLT-X", currency: "NGN" })
  );
});

// --- products: read-only to all clients ---

test("a client cannot create a product", async () => {
  await assertFails(setDoc(doc(firestoreAs("alice"), "products/forged"), { name: "Forged", price: 1 }));
});

test("a client cannot update a product", async () => {
  await assertFails(updateDoc(doc(firestoreAs("alice"), "products/test-product"), { price: 1 }));
});

test("a client cannot delete a product", async () => {
  await assertFails(deleteDoc(doc(firestoreAs("alice"), "products/test-product")));
});

test("(control) any signed-in user CAN read products", async () => {
  await assertSucceeds(getDoc(doc(firestoreAs("bob"), "products/test-product")));
});
