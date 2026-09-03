import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";

export type VehicleType = "bike" | "tricycle" | "van";

/**
 * Preview only, mirrors functions/src/rides.ts's VEHICLE_RATES — there's no
 * distance/geo data to price against yet, so this is a flat rate card, not a
 * secret. requestRide computes (and the ride doc stores) the real number.
 */
export const VEHICLE_RATE_PREVIEW: Record<VehicleType, { priceEstimate: number; etaMin: number }> = {
  bike: { priceEstimate: 3900, etaMin: 12 },
  tricycle: { priceEstimate: 5200, etaMin: 15 },
  van: { priceEstimate: 8900, etaMin: 20 },
};

export type RequestRideInput = { pickup: string; dropoff: string; vehicleType: VehicleType };
export type RequestRideOutput = { id: string; priceEstimate: number; etaMin: number };

const requestRideCallable = httpsCallable<RequestRideInput, RequestRideOutput>(functions, "requestRide");

export async function requestRide(input: RequestRideInput): Promise<RequestRideOutput> {
  const { data } = await requestRideCallable(input);
  return data;
}

export type CancelRideInput = { rideId: string };
export type CancelRideOutput = { id: string; status: "cancelled"; cancellationFee: number };

const cancelRideCallable = httpsCallable<CancelRideInput, CancelRideOutput>(functions, "cancelRide");

export async function cancelRide(input: CancelRideInput): Promise<CancelRideOutput> {
  const { data } = await cancelRideCallable(input);
  return data;
}
