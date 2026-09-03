import type { ChargeResult, PaymentProvider } from "./PaymentProvider";

/**
 * Stands in for a real gateway: instantly "succeeds" every top-up. This is
 * the whole seam — swapping in Paystack/Flutterwave later is writing one
 * class (e.g. PaystackProvider) that satisfies PaymentProvider and calling
 * `new PaystackProvider()` instead of `new MockProvider()` in wallet.ts.
 *
 * TODO(real gateway): a real implementation must verify a transaction
 * reference server-side against the gateway's API (e.g.
 * paystack.transaction.verify(reference)) and only credit the wallet if
 * that verification confirms the amount and status — never credit based on
 * the client-supplied amount alone the way this mock does.
 */
export class MockProvider implements PaymentProvider {
  async topUp(uid: string, amountNgn: number): Promise<ChargeResult> {
    return { success: true, reference: `MOCK-${Date.now()}-${uid.slice(0, 6)}` };
  }
}
