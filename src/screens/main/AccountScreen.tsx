import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../auth/AuthContext";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { AppHeader } from "../../ui/AppHeader";
import { TextField } from "../../ui/TextField";
import { Button } from "../../ui/Button";
import { useWallet } from "../../wallet/useWallet";
import { topUpWallet } from "../../wallet/api";

const STATS = [
  { label: "Shipments", value: "24" },
  { label: "Dispatches", value: "8" },
  { label: "Pending", value: "2" },
];

const MENU = [
  { key: "shipments", icon: "clipboard", family: "feather", title: "My Shipments", desc: "View all active shipments" },
  { key: "orders", icon: "box", family: "feather", title: "Order History", desc: "Past cargo & shop deliveries" },
  { key: "payment", icon: "credit-card", family: "feather", title: "Payment Methods", desc: "Cards, bank & wallet" },
  { key: "settings", icon: "settings", family: "feather", title: "Settings", desc: "App preferences & notifications" },
] as const;

function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

export function AccountScreen() {
  const { signOut } = useAuth();
  const navigation = useNavigation<any>();

  const [profile, setProfile] = useState({ name: "Adebayo Okafor", email: "adebayo@naijacargo.ng", phone: "+234 812 345 6789" });
  const [draftProfile, setDraftProfile] = useState(profile);
  const [editOpen, setEditOpen] = useState(false);

  const { wallet } = useWallet();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [toppingUp, setToppingUp] = useState(false);
  const [topUpError, setTopUpError] = useState("");

  const openEdit = () => {
    setDraftProfile(profile);
    setEditOpen(true);
  };
  const saveProfile = () => {
    setProfile(draftProfile);
    setEditOpen(false);
  };

  const handleMenuPress = (key: (typeof MENU)[number]["key"]) => {
    switch (key) {
      case "shipments":
        navigation.navigate("HomeTab", { screen: "MyShipments" });
        break;
      case "orders":
        navigation.navigate("OrderHistory");
        break;
      case "payment":
        navigation.navigate("PaymentMethods");
        break;
      case "settings":
        navigation.navigate("Settings");
        break;
    }
  };

  const closeTopUp = () => {
    setTopUpOpen(false);
    setTopUpAmount("");
    setTopUpError("");
  };

  const handleTopUp = async () => {
    const amount = parseInt(topUpAmount, 10);
    if (!amount || amount <= 0) return;
    setTopUpError("");
    setToppingUp(true);
    try {
      await topUpWallet({ amount });
      closeTopUp();
    } catch (err) {
      setTopUpError(err instanceof Error ? err.message : "Couldn't add funds. Please try again.");
    } finally {
      setToppingUp(false);
    }
  };

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
              <Text className="font-outfit-extrabold text-[18px] text-ink">{profile.name}</Text>
              <Text className="pt-[2px] font-outfit text-[12px] text-muted">{profile.email}</Text>
              <Text className="font-outfit text-[12px] text-muted">{profile.phone}</Text>
            </View>
          </View>

          <Pressable onPress={openEdit} className="items-center rounded-xl border-[1.984px] border-brand bg-white py-3">
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
              <Text className="pt-[6px] font-outfit-black text-[26px] tracking-[-0.26px] text-white">
                {wallet ? formatNaira(wallet.balance) : "···"}
              </Text>
              <Text className="pt-1 font-outfit text-[11px] text-white/55">
                Available balance{wallet ? ` · ${wallet.walletId}` : ""}
              </Text>
            </View>
            <Pressable onPress={() => setTopUpOpen(true)} className="items-end gap-2">
              <View className="rounded-[10px] bg-white/15 px-[14px] py-[7px]">
                <Text className="font-outfit-bold text-[12px] text-white">Top Up</Text>
              </View>
              <Text className="font-outfit text-[10px] text-white/50">Tap to add funds</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View className="mt-[14px] overflow-hidden rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.07)] bg-surface">
          {MENU.map((item, i) => (
            <Pressable
              key={item.title}
              onPress={() => handleMenuPress(item.key)}
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

      <Modal visible={editOpen} transparent animationType="fade" onRequestClose={() => setEditOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setEditOpen(false)}>
          <Pressable className="gap-3 rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-1">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>
            <Text className="font-outfit-extrabold text-[17px] text-ink">Edit Profile</Text>
            <TextField icon="user" placeholder="Full name" value={draftProfile.name} onChangeText={(t) => setDraftProfile((p) => ({ ...p, name: t }))} />
            <TextField icon="mail" placeholder="Email" value={draftProfile.email} onChangeText={(t) => setDraftProfile((p) => ({ ...p, email: t }))} keyboardType="email-address" />
            <TextField icon="phone" placeholder="Phone" value={draftProfile.phone} onChangeText={(t) => setDraftProfile((p) => ({ ...p, phone: t }))} keyboardType="phone-pad" />
            <View className="pt-2">
              <Button label="Save Changes" onPress={saveProfile} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={topUpOpen} transparent animationType="fade" onRequestClose={closeTopUp}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={closeTopUp}>
          <Pressable className="gap-3 rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-1">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>
            <Text className="font-outfit-extrabold text-[17px] text-ink">Top Up Wallet</Text>
            <Text className="font-outfit text-[13px] text-muted">
              Current balance: {wallet ? formatNaira(wallet.balance) : "···"}
            </Text>
            <TextField icon="credit-card" placeholder="Amount (₦)" value={topUpAmount} onChangeText={setTopUpAmount} keyboardType="number-pad" />
            {topUpError ? <Text className="font-outfit-semibold text-[12px] text-[#DC2626]">{topUpError}</Text> : null}
            <View className="pt-2">
              <Button label="Add Funds" onPress={handleTopUp} disabled={!topUpAmount.trim()} loading={toppingUp} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}
