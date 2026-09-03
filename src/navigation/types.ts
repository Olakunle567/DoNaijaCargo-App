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

export type ShipStackParamList = {
  Ship: undefined;
  GetEstimate: undefined;
  Confirmed: { trackingRef: string };
};

export type RidingStackParamList = {
  Ride: undefined;
  RideActive: undefined;
};
