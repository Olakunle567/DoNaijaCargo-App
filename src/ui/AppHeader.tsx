import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LogoMark } from "./Logo";
import { useAuth } from "../auth/AuthContext";
import { useSettings } from "../settings/SettingsContext";
import { formatCurrency } from "../lib/currency";
import type { TranslationKey } from "../lib/i18n";

function navigateToTab(navigation: any, tabName: string) {
  const parent = navigation.getParent?.();
  if (parent) parent.navigate(tabName);
  else navigation.navigate(tabName);
}

const MENU_LINKS: { tab: string; icon: string; labelKey: TranslationKey }[] = [
  { tab: "HomeTab", icon: "home", labelKey: "menuHome" },
  { tab: "ShipTab", icon: "box", labelKey: "menuShipCargo" },
  { tab: "TrackingTab", icon: "map-pin", labelKey: "menuTrackShipment" },
  { tab: "RidingTab", icon: "truck", labelKey: "menuDispatchRiding" },
  { tab: "AccountTab", icon: "user", labelKey: "menuAccount" },
];

export function AppHeader({ notificationCount = 3 }: { notificationCount?: number }) {
  const navigation = useNavigation<any>();
  const { signOut } = useAuth();
  const { currency, t } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(notificationCount);

  // MOCK: push notifications aren't built — this panel is illustrative,
  // static sample content, not tied to any real event or backend.
  const NOTIFICATIONS = [
    { icon: "truck", title: "Shipment in transit", detail: "Your shipment left the sorting facility", time: "2h ago" },
    { icon: "map-pin", title: "Rider is close", detail: "Your rider is about 4 minutes away", time: "5m ago" },
    { icon: "tag", title: "20% off this week", detail: `Free delivery on Shop orders over ${formatCurrency(10000, currency)}`, time: "1d ago" },
  ] as const;

  return (
    <View className="h-[55px] w-full flex-row items-center justify-between px-5">
      <Pressable
        onPress={() => setMenuOpen(true)}
        className="size-[34px] items-center justify-center rounded-xl bg-transparent"
        hitSlop={8}
        testID="header-menu-button"
      >
        <Feather name="menu" size={22} color="#1B4332" />
      </Pressable>

      <View className="flex-row items-center gap-2">
        <LogoMark width={32} height={34} />
        <View>
          <Text className="font-outfit-medium text-[10px] tracking-[0.4px] text-[#1e3a5f]">D.O NAIJA</Text>
          <Text className="font-outfit-extrabold text-[13px] tracking-[0.26px] text-brand">CARGO</Text>
        </View>
      </View>

      <Pressable
        onPress={() => setNotifOpen(true)}
        className="size-[34px] items-center justify-center rounded-xl"
        hitSlop={8}
        testID="header-bell-button"
      >
        <Feather name="bell" size={22} color="#1B4332" />
        {unread > 0 ? (
          <View className="absolute -right-1 -top-1 size-4 items-center justify-center rounded-full border-2 border-white bg-brand">
            <Text className="font-outfit-bold text-[9px] text-white">{unread}</Text>
          </View>
        ) : null}
      </Pressable>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setMenuOpen(false)}>
          <Pressable className="rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-4">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>
            {MENU_LINKS.map((item) => (
              <Pressable
                key={item.tab}
                onPress={() => {
                  setMenuOpen(false);
                  navigateToTab(navigation, item.tab);
                }}
                className="flex-row items-center gap-3 border-b-[0.661px] border-[rgba(27,67,50,0.07)] py-[14px]"
              >
                <Feather name={item.icon as any} size={19} color="#1B4332" />
                <Text className="font-outfit-semibold text-[14px] text-ink">{t(item.labelKey)}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                signOut();
              }}
              className="flex-row items-center gap-3 pt-[14px]"
            >
              <Feather name="log-out" size={19} color="#DC2626" />
              <Text className="font-outfit-semibold text-[14px] text-[#DC2626]">{t("logOut")}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={notifOpen} transparent animationType="fade" onRequestClose={() => setNotifOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setNotifOpen(false)}>
          <Pressable className="rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-4">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>
            <View className="flex-row items-center justify-between pb-3">
              <Text className="font-outfit-extrabold text-[16px] text-ink">{t("notifications")}</Text>
              {unread > 0 ? (
                <Pressable onPress={() => setUnread(0)}>
                  <Text className="font-outfit-bold text-[12px] text-brand">Mark all read</Text>
                </Pressable>
              ) : null}
            </View>
            {NOTIFICATIONS.map((n) => (
              <View key={n.title} className="flex-row items-start gap-3 border-b-[0.661px] border-[rgba(27,67,50,0.07)] py-3">
                <View className="size-9 items-center justify-center rounded-full bg-[rgba(27,67,50,0.08)]">
                  <Feather name={n.icon as any} size={17} color="#1B4332" />
                </View>
                <View className="flex-1">
                  <Text className="font-outfit-semibold text-[13px] text-ink">{n.title}</Text>
                  <Text className="pt-px font-outfit text-[11.5px] text-muted">{n.detail}</Text>
                </View>
                <Text className="font-outfit text-[10px] text-muted">{n.time}</Text>
              </View>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
