import "./global.css";
import { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreenModule from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
} from "@expo-google-fonts/outfit";
import { AuthNavigator } from "./src/navigation/AuthNavigator";
import { MainTabNavigator } from "./src/navigation/MainTabNavigator";
import { AuthProvider, useAuth } from "./src/auth/AuthContext";

SplashScreenModule.preventAutoHideAsync();

function RootNavigator() {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) return null;
  return isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
  });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreenModule.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
