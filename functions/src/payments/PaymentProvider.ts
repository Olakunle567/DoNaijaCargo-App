export type ChargeResult = { success: true; reference: string } | { success: false; reason: string };

/**
 * Everything a wallet top-up needs from a payment gateway. Real providers
 * (Paystack, Flutterwave, ...) implement this by verifying a transaction
 * with the gateway's API — never by trusting the client-supplied amount
 * directly — and returning a reference from *that* verification.
 */
export interface PaymentProvider {
  topUp(uid: string, amountNgn: number): Promise<ChargeResult>;
}
