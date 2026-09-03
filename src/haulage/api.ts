import { httpsCallable } from "firebase/functions";
import { functions } from "../lib/firebase";

export type TruckType = "flatbed" | "tipper" | "container" | "lowbed";

export type SubmitHaulageInput = {
  truckType: TruckType;
  pickup: string;
  dropoff: string;
  description: string;
  weightRange: string;
  preferredDate: string;
};

export type SubmitHaulageOutput = { id: string };

const submitHaulageCallable = httpsCallable<SubmitHaulageInput, SubmitHaulageOutput>(functions, "submitHaulage");

export async function submitHaulage(input: SubmitHaulageInput): Promise<SubmitHaulageOutput> {
  const { data } = await submitHaulageCallable(input);
  return data;
}
