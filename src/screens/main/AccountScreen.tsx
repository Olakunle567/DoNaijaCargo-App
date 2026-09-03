import { Pressable, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../auth/AuthContext";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { AppHeader } from "../../ui/AppHeader";

const STATS = [
  { label: "Shipments", value: "24" },
  { label: "Dispatches", value: "8" },
  { label: "Pending", value: "2" },
];

const MENU = [
  { icon: "clipboard", family: "feather", title: "My Shipments", desc: "View all active shipments" },
  { icon: "box", family: "feather", title: "Order History", desc: "Past cargo & shop deliveries" },
  { icon: "credit-card", family: "feather", title: "Payment Methods", desc: "Cards, bank & wallet" },
  { icon: "settings", family: "feather", title: "Settings", desc: "App preferences & notifications" },
] as const;

export function AccountScreen() {
  const { signOut } = useAuth();
  return (
    <ScreenContainer scroll className="px-0">
      <View className="px-5">
        <AppHeader />
      </View>

      <View className="px-4 pt-4">
        <View className="gap-4 rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.08)] bg-[#EEF1EF] px-[18px] py-[22px]">
          <View className="flex-row items-center gap-4">
            <View className="size-[72px] items-center justify-center rounded-full border-[1.984px] border-brand bg-[#D4E3DA]">
              <Feather name="user" size={38} color="#1B4332" />
            </View>
            <View className="flex-1">
              <Text className="font-outfit-extrabold text-[18px] text-ink">Adebayo Okafor</Text>
              <Text className="pt-[2px] font-outfit text-[12px] text-muted">adebayo@naijacargo.ng</Text>
              <Text className="font-outfit text-[12px] text-muted">+234 812 345 6789</Text>
            </View>
          </View>

          <Pressable className="items-center rounded-xl border-[1.984px] border-brand bg-white py-3">
            <Text className="font-outfit-bold text-[13px] tracking-[0.52px] text-brand">Edit Profile</Text>
          </Pressable>

          <View className="flex-row justify-between border-t-[0.661px] border-[rgba(27,67,50,0.1)] pt-[14px]">
            {STATS.map((s) => (
              <View key={s.label} className="items-center">
                <Text className="font-outfit-extrabold text-[20px] text-brand">{s.value}</Text>
                <Text className="font-outfit-medium text-[10px] text-muted">{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <LinearGradient
          colors={["#1B4332", "#2D6A4F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ marginTop: 14, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 18, overflow: "hidden" }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="wallet-outline" size={20} color="#fff" />
                <Text className="font-outfit-semibold text-[12px] tracking-[0.72px] text-white/75">D.O NAIJA WALLET</Text>
              </View>
              <Text className="pt-[6px] font-outfit-black text-[26px] tracking-[-0.26px] text-white">₦36,650</Text>
              <Text className="pt-1 font-outfit text-[11px] text-white/55">Available balance · WLT-4482</Text>
            </View>
            <View className="items-end gap-2">
              <View className="rounded-[10px] bg-white/15 px-[14px] py-[7px]">
                <Text className="font-outfit-bold text-[12px] text-white">Top Up</Text>
              </View>
              <Text className="font-outfit text-[10px] text-white/50">Tap to view</Text>
            </View>
          </View>
        </LinearGradient>

        <View className="mt-[14px] overflow-hidden rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.07)] bg-surface">
          {MENU.map((item, i) => (
            <Pressable
              key={item.title}
              className={`flex-row items-center gap-3 px-4 py-[14px] ${i < MENU.length - 1 ? "border-b-[0.661px] border-[rgba(27,67,50,0.07)]" : ""}`}
            >
              <View className="size-10 items-center justify-center rounded-xl bg-[rgba(27,67,50,0.07)]">
                {item.family === "feather" ? (
                  <Feather name={item.icon as any} size={22} color="#1B4332" />
                ) : (
                  <MaterialCommunityIcons name={item.icon as any} size={22} color="#1B4332" />
                )}
              </View>
              <View className="flex-1">
                <Text className="font-outfit-semibold text-[14px] text-ink">{item.title}</Text>
                <Text className="font-outfit text-[11.5px] text-muted">{item.desc}</Text>
              </View>
              <Feather name="chevron-right" size={18} color="#9CA3AF" />
            </Pressable>
          ))}
        </View>

        <Text className="py-4 text-center font-outfit text-[11px] text-[#CBD5CC]">D.O Naija Cargo v1.4.2</Text>

        <Pressable onPress={signOut} className="items-center rounded-2xl bg-[#145028] py-[15px] shadow">
          <Text className="font-outfit-extrabold text-[15px] tracking-[1.2px] text-white">LOG OUT</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
