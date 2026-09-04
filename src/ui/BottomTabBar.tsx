import { Pressable, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSettings } from "../settings/SettingsContext";
import type { TranslationKey } from "../lib/i18n";

const TAB_ICON: Record<string, { name: string; family: "feather" | "mci" }> = {
  HomeTab: { name: "home", family: "feather" },
  ShipTab: { name: "box", family: "feather" },
  TrackingTab: { name: "map-pin", family: "feather" },
  RidingTab: { name: "moped", family: "mci" },
  AccountTab: { name: "user", family: "feather" },
};

const TAB_LABEL_KEY: Record<string, TranslationKey> = {
  HomeTab: "navHome",
  ShipTab: "navShip",
  TrackingTab: "navTracking",
  RidingTab: "navRiding",
  AccountTab: "navAccount",
};

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useSettings();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row border-t-[0.661px] border-border-brand bg-white pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 4) }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const icon = TAB_ICON[route.name];
        const color = focused ? "#1B4332" : "#697971";

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            className="flex-1 items-center justify-center gap-1 py-1 active:opacity-70"
          >
            <View className={`h-8 w-11 items-center justify-center rounded-[10px] ${focused ? "bg-[rgba(27,67,50,0.08)]" : ""}`}>
              {icon.family === "feather" ? (
                <Feather name={icon.name as any} size={22} color={color} />
              ) : (
                <MaterialCommunityIcons name={icon.name as any} size={22} color={color} />
              )}
            </View>
            <Text className={`text-[10px] tracking-[0.1px] ${focused ? "font-outfit-bold text-brand" : "font-outfit-medium text-muted"}`}>
              {t(TAB_LABEL_KEY[route.name])}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
