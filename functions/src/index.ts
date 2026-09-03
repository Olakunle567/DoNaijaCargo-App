import { initializeApp } from "firebase-admin/app";

initializeApp();

export { getEstimate, bookShipment } from "./shipments";
export { advanceTracking } from "./tracking";
