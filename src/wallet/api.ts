import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";

export type TopUpWalletInput = { amount: number };
export type TopUpWalletOutput = { balance: number; reference: string };

const topUpWalletCallable = httpsCallable<TopUpWalletInput, TopUpWalletOutput>(functions, "topUpWallet");

/** MOCK top-up — see functions/src/payments/MockProvider.ts for the real-gateway seam. */
export async function topUpWallet(input: TopUpWalletInput): Promise<TopUpWalletOutput> {
  const { data } = await topUpWalletCallable(input);
  return data;
}
