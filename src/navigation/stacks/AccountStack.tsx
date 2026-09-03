import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AccountStackParamList } from "../types";
import { AccountScreen } from "../../screens/main/AccountScreen";
import { PaymentMethodsScreen } from "../../screens/main/PaymentMethodsScreen";
import { SettingsScreen } from "../../screens/main/SettingsScreen";
import { OrderHistoryScreen } from "../../screens/main/OrderHistoryScreen";

const Stack = createNativeStackNavigator<AccountStackParamList>();

export function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
    </Stack.Navigator>
  );
}
