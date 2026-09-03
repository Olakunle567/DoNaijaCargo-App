import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../types";
import { HomeScreen } from "../../screens/main/HomeScreen";
import { MyShipmentsScreen } from "../../screens/main/MyShipmentsScreen";
import { HaulageScreen } from "../../screens/main/HaulageScreen";
import { ShopScreen } from "../../screens/main/ShopScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MyShipments" component={MyShipmentsScreen} />
      <Stack.Screen name="Haulage" component={HaulageScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
    </Stack.Navigator>
  );
}
