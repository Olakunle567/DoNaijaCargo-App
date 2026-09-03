import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";

export type ServiceTier = "standard" | "express" | "priority";

export type PriceBreakdown = {
  base: number;
  weightCharge: number;
  fuel: number;
  insurance: number;
  total: number;
};

export type EstimateTiers = Record<ServiceTier, PriceBreakdown>;

type GetEstimateInput = { weightKg: number; insured: boolean };
type GetEstimateOutput = { tiers: EstimateTiers };

const getEstimateCallable = httpsCallable<GetEstimateInput, GetEstimateOutput>(functions, "getEstimate");

/** Server-computed price for all three service tiers — never trust a locally-derived total. */
export async function getEstimate(input: GetEstimateInput): Promise<EstimateTiers> {
  const { data } = await getEstimateCallable(input);
  return data.tiers;
}

export type Party = { name: string; address: string };
export type Cargo = { type: string; weightKg: number; dimensions: string };

export type BookShipmentInput = {
  sender: Party;
  receiver: Party;
  cargo: Cargo;
  serviceTier: ServiceTier;
  insured: boolean;
};

export type BookShipmentOutput = { id: string; trackingRef: string };

const bookShipmentCallable = httpsCallable<BookShipmentInput, BookShipmentOutput>(functions, "bookShipment");

export async function bookShipment(input: BookShipmentInput): Promise<BookShipmentOutput> {
  const { data } = await bookShipmentCallable(input);
  return data;
}

/** Display metadata for each service tier — names/ETAs shown next to the server-computed prices. */
export const SERVICE_TIER_META: { key: ServiceTier; name: string; eta: string; badge?: string }[] = [
  { key: "standard", name: "Standard", eta: "5–7 business days" },
  { key: "express", name: "Express", eta: "2–3 business days", badge: "Popular" },
  { key: "priority", name: "Priority", eta: "Next business day", badge: "Fastest" },
];

// ---------------------------------------------------------------------------
// Tracking
// ---------------------------------------------------------------------------

/** Ordered milestone stage labels — mirrors functions/src/tracking.ts's MILESTONE_STAGES. */
export const MILESTONE_STAGE_LABELS = [
  "Order Placed",
  "Arrived at Sorting Center",
  "In Transit",
  "Out for Delivery",
  "Delivered",
] as const;

type AdvanceTrackingInput = { trackingRef: string };
type AdvanceTrackingOutput = { id: string; label: string; status: string };

const advanceTrackingCallable = httpsCallable<AdvanceTrackingInput, AdvanceTrackingOutput>(functions, "advanceTracking");

/** Dev-only: moves a shipment to its next tracking milestone. See functions/src/tracking.ts. */
export async function advanceTracking(input: AdvanceTrackingInput): Promise<AdvanceTrackingOutput> {
  const { data } = await advanceTrackingCallable(input);
  return data;
}
