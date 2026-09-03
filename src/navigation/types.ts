export type AuthStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ShipTab: undefined;
  TrackingTab: undefined;
  RidingTab: undefined;
  AccountTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  MyShipments: undefined;
  Haulage: undefined;
  Shop: undefined;
};

export type ShipmentDetails = {
  senderName: string;
  pickupAddress: string;
  receiverName: string;
  deliveryAddress: string;
  cargoType: string;
  weight: string;
  dimensions: string;
};

export type ShipStackParamList = {
  Ship: undefined;
  GetEstimate: ShipmentDetails;
  Confirmed: { trackingRef: string };
};

export type RidingStackParamList = {
  Ride: undefined;
  RideActive: undefined;
  Chat: undefined;
};

export type AccountStackParamList = {
  Account: undefined;
  PaymentMethods: undefined;
  Settings: undefined;
  OrderHistory: undefined;
};
