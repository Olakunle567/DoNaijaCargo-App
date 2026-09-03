import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RidingStackParamList } from "../types";
import { RideScreen } from "../../screens/main/RideScreen";
import { RideActiveScreen } from "../../screens/main/RideActiveScreen";

const Stack = createNativeStackNavigator<RidingStackParamList>();

export function RidingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Ride" component={RideScreen} />
      <Stack.Screen name="RideActive" component={RideActiveScreen} />
    </Stack.Navigator>
  );
}
