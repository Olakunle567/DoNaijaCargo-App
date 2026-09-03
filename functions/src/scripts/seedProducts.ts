/**
 * Seeds the `products` collection with the catalog from ShopScreen.
 *
 * Usage (from functions/):
 *   npm run seed:products                  # seeds the local Firestore emulator
 *   SEED_TARGET=prod npm run seed:products  # seeds the real project in .firebaserc
 *                                            (requires GOOGLE_APPLICATION_CREDENTIALS)
 */
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

type Product = {
  id: string;
  name: string;
  emoji: string;
  category: string;
  price: number;
  rating: number;
  ratingCount: number;
  badge?: string;
};

const PRODUCTS: Product[] = [
  { id: "wireless-earbuds-pro", name: "Wireless Earbuds Pro", emoji: "🎧", category: "Electronics", price: 18500, rating: 4.7, ratingCount: 128, badge: "Top Seller" },
  { id: "agbada-ensemble-set", name: "Agbada Ensemble Set", emoji: "👘", category: "Fashion", price: 12000, rating: 4.5, ratingCount: 43, badge: "New" },
  { id: "zobo-spice-pack", name: "Zobo & Spice Pack", emoji: "🌿", category: "Food", price: 3500, rating: 4.8, ratingCount: 89 },
  { id: "smart-led-desk-lamp", name: "Smart LED Desk Lamp", emoji: "💡", category: "Home", price: 8900, rating: 4.4, ratingCount: 62, badge: "Sale" },
  { id: "ankara-print-sneakers", name: "Ankara Print Sneakers", emoji: "👟", category: "Fashion", price: 15000, rating: 4.6, ratingCount: 201, badge: "Popular" },
  { id: "portable-power-bank", name: "Portable Power Bank", emoji: "🔋", category: "Electronics", price: 22000, rating: 4.3, ratingCount: 77 },
  { id: "nigerian-recipe-book", name: "Nigerian Recipe Book", emoji: "📗", category: "Books", price: 4500, rating: 4.9, ratingCount: 35, badge: "New" },
  { id: "shea-butter-cream-set", name: "Shea Butter Cream Set", emoji: "🧴", category: "Beauty", price: 6800, rating: 4.7, ratingCount: 154 },
];

if (process.env.SEED_TARGET === "prod") {
  if (!getApps().length) initializeApp();
} else {
  // Default to the emulator so this never touches real data by accident.
  process.env.FIRESTORE_EMULATOR_HOST ??= "localhost:8080";
  if (!getApps().length) initializeApp({ projectId: process.env.GCLOUD_PROJECT ?? "demo-donaijacargo" });
}

async function seed() {
  const db = getFirestore();
  const batch = db.batch();
  for (const { id, ...data } of PRODUCTS) {
    batch.set(db.collection("products").doc(id), data);
  }
  await batch.commit();
  console.log(`Seeded ${PRODUCTS.length} products.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
