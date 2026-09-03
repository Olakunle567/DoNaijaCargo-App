import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ShipStackParamList } from "../types";
import { ShipScreen } from "../../screens/main/ShipScreen";
import { GetEstimateScreen } from "../../screens/main/GetEstimateScreen";
import { ConfirmedScreen } from "../../screens/main/ConfirmedScreen";

const Stack = createNativeStackNavigator<ShipStackParamList>();

export function ShipStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Ship" component={ShipScreen} />
      <Stack.Screen name="GetEstimate" component={GetEstimateScreen} />
      <Stack.Screen name="Confirmed" component={ConfirmedScreen} />
    </Stack.Navigator>
  );
}
