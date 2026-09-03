export type ServiceTier = "standard" | "express" | "priority";

export type PriceBreakdown = {
  base: number;
  weightCharge: number;
  fuel: number;
  insurance: number;
  total: number;
};

export const SERVICE_TIERS: ServiceTier[] = ["standard", "express", "priority"];

/**
 * Per-tier base rate. Chosen so that at the app's reference shipment
 * (12.5kg, uninsured — the fallback ShipScreen uses when weight is left
 * blank) each tier's total matches its Figma-designed headline price
 * exactly: Standard ₦15,938, Express ₦24,704, Priority ₦35,064.
 * (base + 12.5kg * WEIGHT_RATE_PER_KG + FUEL_SURCHARGE = headline price)
 */
const TIER_BASE: Record<ServiceTier, number> = {
  standard: 12122,
  express: 20888,
  priority: 31248,
};

const WEIGHT_RATE_PER_KG = 220;
const FUEL_SURCHARGE = 1066;
export const INSURANCE_FEE = 500;

export function computeBreakdown(tier: ServiceTier, weightKg: number, insured: boolean): PriceBreakdown {
  const base = TIER_BASE[tier];
  const weightCharge = Math.round(weightKg * WEIGHT_RATE_PER_KG);
  const fuel = FUEL_SURCHARGE;
  const insurance = insured ? INSURANCE_FEE : 0;
  return { base, weightCharge, fuel, insurance, total: base + weightCharge + fuel + insurance };
}

export function computeAllTiers(weightKg: number, insured: boolean): Record<ServiceTier, PriceBreakdown> {
  return {
    standard: computeBreakdown("standard", weightKg, insured),
    express: computeBreakdown("express", weightKg, insured),
    priority: computeBreakdown("priority", weightKg, insured),
  };
}
