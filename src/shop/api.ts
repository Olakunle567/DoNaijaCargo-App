import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";

export type PlaceOrderOutput = { id: string; total: number; balance: number };

const placeOrderCallable = httpsCallable<void, PlaceOrderOutput>(functions, "placeOrder");

/** Server reads the caller's own cart — nothing to pass in, nothing to trust from the client. */
export async function placeOrder(): Promise<PlaceOrderOutput> {
  const { data } = await placeOrderCallable();
  return data;
}
