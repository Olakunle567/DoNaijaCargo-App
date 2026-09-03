import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "./types";
import { HomeStack } from "./stacks/HomeStack";
import { ShipStack } from "./stacks/ShipStack";
import { RidingStack } from "./stacks/RidingStack";
import { TrackScreen } from "../screens/main/TrackScreen";
import { AccountScreen } from "../screens/main/AccountScreen";
import { BottomTabBar } from "../ui/BottomTabBar";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="ShipTab" component={ShipStack} />
      <Tab.Screen name="TrackingTab" component={TrackScreen} />
      <Tab.Screen name="RidingTab" component={RidingStack} />
      <Tab.Screen name="AccountTab" component={AccountScreen} />
    </Tab.Navigator>
  );
}
