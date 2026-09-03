import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RidingStackParamList } from "../types";
import { RideScreen } from "../../screens/main/RideScreen";
import { RideActiveScreen } from "../../screens/main/RideActiveScreen";
import { ChatScreen } from "../../screens/main/ChatScreen";
import { ChatProvider } from "../../chat/ChatContext";

const Stack = createNativeStackNavigator<RidingStackParamList>();

export function RidingStack() {
  return (
    <ChatProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Ride" component={RideScreen} />
        <Stack.Screen name="RideActive" component={RideActiveScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </ChatProvider>
  );
}
