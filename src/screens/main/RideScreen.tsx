import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RidingStackParamList } from "../../navigation/types";
import { AppHeader } from "../../ui/AppHeader";
import { MapIllustration } from "../../ui/MapIllustration";
import { BobbingPin } from "../../ui/BobbingPin";
import { Button } from "../../ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RidingStackParamList, "Ride">;

const VEHICLES = [
  { key: "bike", icon: "moped", label: "Bike", desc: "Small items" },
  { key: "tricycle", icon: "rickshaw", label: "Tricycle", desc: "Medium loads" },
  { key: "van", icon: "van-utility", label: "Van", desc: "Heavy cargo" },
] as const;

const NEARBY_RIDERS = [
  { left: "16%", top: "14%", delay: 0 },
  { left: "47%", top: "9%", delay: 200 },
  { left: "67%", top: "24%", delay: 450 },
  { left: "29%", top: "28%", delay: 100 },
  { left: "75%", top: "11%", delay: 350 },
] as const;

export function RideScreen({ navigation }: Props) {
  const [vehicle, setVehicle] = useState<(typeof VEHICLES)[number]["key"]>("bike");

  return (
    <View className="flex-1 bg-[#C8DCC5]">
      <View className="absolute inset-0 h-[420px]">
        <MapIllustration width={393} height={420} />
      </View>
      {NEARBY_RIDERS.map((r, i) => (
        <View key={i} className="absolute" style={{ left: r.left, top: r.top }}>
          <BobbingPin delay={r.delay} />
        </View>
      ))}
      <SafeAreaView edges={["top"]}>
        <AppHeader />
      </SafeAreaView>

      <View className="absolute left-4 top-[110px] rounded-md bg-white/70 px-[7px] py-[3px]">
        <Text className="font-outfit-bold text-[9px] tracking-[0.54px] text-brand opacity-80">VICTORIA ISLAND</Text>
      </View>
      <View className="absolute right-4 top-[110px] rounded-md bg-white/70 px-[7px] py-[3px]">
        <Text className="font-outfit-bold text-[9px] tracking-[0.54px] text-[#1e3a5f] opacity-80">5 RIDERS NEARBY</Text>
      </View>

      <View className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white px-[18px] pb-4 pt-5 shadow-lg">
        <View className="items-center">
          <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
        </View>
        <Text className="pt-4 font-outfit-extrabold text-[16px] text-ink">Book a Rider</Text>

        <View className="mt-[14px] gap-2">
          <View className="flex-row items-center gap-2 rounded-xl border-[1.322px] border-border-brand bg-surface px-[13px] py-[11px]">
            <View className="size-2 rounded-full bg-brand" />
            <Text className="font-outfit-medium text-[13px] text-ink">15 Adeola Odeku St, VI</Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-xl border-[1.322px] border-border-brand bg-surface px-[13px] py-[11px]">
            <Feather name="map-pin" size={16} color="#374151" />
            <Text className="font-outfit-medium text-[13px] text-ink/50">Delivery destination</Text>
          </View>
        </View>

        <Text className="pt-4 font-outfit-semibold text-[11px] tracking-[0.55px] text-muted">VEHICLE TYPE</Text>
        <View className="mt-2 flex-row gap-2">
          {VEHICLES.map((v) => {
            const active = vehicle === v.key;
            return (
              <Pressable
                key={v.key}
                onPress={() => setVehicle(v.key)}
                className={`flex-1 items-center gap-1 rounded-xl border-[1.984px] px-[6px] py-[10px] ${
                  active ? "border-brand bg-[rgba(27,67,50,0.06)]" : "border-border-brand bg-surface"
                }`}
              >
                <MaterialCommunityIcons name={v.icon as any} size={22} color={active ? "#1B4332" : "#374151"} />
                <Text className={`font-outfit-bold text-[11px] ${active ? "text-brand" : "text-body"}`}>{v.label}</Text>
                <Text className="font-outfit text-[9.5px] text-muted">{v.desc}</Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-[14px] flex-row items-center justify-between rounded-xl border-[0.661px] border-[rgba(27,67,50,0.07)] bg-surface px-[14px] py-3">
          <View>
            <Text className="font-outfit-semibold text-[10px] tracking-[0.4px] text-muted">PRICE ESTIMATE</Text>
            <Text className="font-outfit-extrabold text-[20px] text-ink">₦3,900</Text>
          </View>
          <View className="items-end">
            <Text className="font-outfit-semibold text-[10px] tracking-[0.4px] text-muted">ETA</Text>
            <Text className="font-outfit-bold text-[16px] text-brand">~12 min</Text>
          </View>
        </View>

        <View className="pt-[14px]">
          <Button label="REQUEST RIDER" onPress={() => navigation.navigate("RideActive")} />
        </View>
      </View>
    </View>
  );
}
