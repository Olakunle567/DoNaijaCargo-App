import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { BackHeader } from "../../ui/BackHeader";
import { TextField } from "../../ui/TextField";
import { SectionLabel } from "../../ui/SectionLabel";
import { Button } from "../../ui/Button";
import { submitHaulage } from "../../haulage/api";

type Props = NativeStackScreenProps<HomeStackParamList, "Haulage">;

const TRUCK_TYPES = [
  { key: "flatbed", icon: "truck-flatbed", label: "Flatbed", desc: "Open cargo" },
  { key: "tipper", icon: "dump-truck", label: "Tipper", desc: "Sand & gravel" },
  { key: "container", icon: "package-variant-closed", label: "Container", desc: "Sealed load" },
  { key: "lowbed", icon: "truck-trailer", label: "Lowbed", desc: "Heavy plant" },
] as const;

const WEIGHT_RANGES = ["< 1 ton", "1–5 tons", "5–10 tons", "10–20 tons", "20+ tons"];

export function HaulageScreen({ navigation }: Props) {
  const [truckType, setTruckType] = useState<(typeof TRUCK_TYPES)[number]["key"]>("flatbed");
  const [weightRange, setWeightRange] = useState("1–5 tons");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [description, setDescription] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toastOpacity = useSharedValue(0);
  const toastStyle = useAnimatedStyle(() => ({ opacity: toastOpacity.value }));

  const handleRequest = async () => {
    if (!pickup.trim() || !delivery.trim() || !description.trim()) {
      setError("Please fill in pickup, delivery, and cargo description.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await submitHaulage({
        truckType,
        pickup: pickup.trim(),
        dropoff: delivery.trim(),
        description: description.trim(),
        weightRange,
        preferredDate: pickupDate.trim(),
      });
      toastOpacity.value = withTiming(1, { duration: 200 });
      setTimeout(() => navigation.goBack(), 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't submit this request. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <BackHeader title="Book Haulage" subtitle="Heavy cargo & bulk freight services" onBack={() => navigation.goBack()} />

      <Animated.View
        pointerEvents="none"
        style={[{ position: "absolute", top: 8, left: 16, right: 16, zIndex: 50 }, toastStyle]}
        className="flex-row items-center gap-2 rounded-2xl bg-brand px-4 py-3 shadow-lg"
      >
        <Feather name="check-circle" size={18} color="#fff" />
        <Text className="flex-1 text-footnote font-outfit-semibold text-white">
          Request sent — a consultant will call within 2 hours.
        </Text>
      </Animated.View>

      <View className="pt-5">
        <Text className="font-outfit-bold text-[12px] tracking-[0.48px] text-brand">TRUCK TYPE</Text>
        <View className="mt-[10px] flex-row gap-2">
          {TRUCK_TYPES.map((t) => {
            const active = truckType === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => setTruckType(t.key)}
                className={`flex-1 items-center gap-[6px] rounded-2xl border-[1.984px] px-2 py-3 active:opacity-70 ${
                  active ? "border-brand bg-[rgba(27,67,50,0.05)]" : "border-border-brand bg-surface"
                }`}
              >
                <MaterialCommunityIcons name={t.icon as any} size={28} color={active ? "#1B4332" : "#374151"} />
                <Text className={`font-outfit-bold text-[11.5px] ${active ? "text-brand" : "text-body"}`}>{t.label}</Text>
                <Text className="font-outfit text-[9.5px] text-muted">{t.desc}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-4 gap-4 rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.07)] bg-[#EEF1EF] px-4 py-[18px]">
        <SectionLabel label="ROUTE DETAILS" />
        <View className="gap-1">
          <Text className="font-outfit-semibold text-[12px] tracking-[0.48px] text-brand">PICKUP LOCATION</Text>
          <TextField icon="map-pin" placeholder="e.g. 5 Industrial Ave, Apapa" value={pickup} onChangeText={setPickup} />
        </View>
        <View className="gap-1">
          <Text className="font-outfit-semibold text-[12px] tracking-[0.48px] text-brand">DELIVERY LOCATION</Text>
          <TextField icon="map-pin" placeholder="e.g. Plot 12, Idu Industrial, Abuja" value={delivery} onChangeText={setDelivery} />
        </View>
      </View>

      <View className="mt-[14px] gap-4 rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.07)] bg-surface px-4 py-[18px]">
        <SectionLabel label="CARGO DETAILS" />
        <View className="gap-1">
          <Text className="font-outfit-semibold text-[12px] tracking-[0.48px] text-brand">CARGO DESCRIPTION</Text>
          <TextField placeholder="e.g. Steel rods, 50 bundles" value={description} onChangeText={setDescription} />
        </View>

        <View className="gap-1">
          <Text className="font-outfit-semibold text-[12px] tracking-[0.48px] text-brand">WEIGHT RANGE</Text>
          <View className="flex-row flex-wrap gap-2 pt-2">
            {WEIGHT_RANGES.map((w) => {
              const active = weightRange === w;
              return (
                <Pressable
                  key={w}
                  onPress={() => setWeightRange(w)}
                  className={`rounded-full border-[1.322px] px-[14px] py-[7px] active:opacity-70 ${
                    active ? "border-brand bg-brand" : "border-[rgba(27,67,50,0.15)] bg-white"
                  }`}
                >
                  <Text className={`font-outfit-semibold text-[12px] ${active ? "text-white" : "text-[#6B7280]"}`}>{w}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="gap-1">
          <Text className="font-outfit-semibold text-[12px] tracking-[0.48px] text-brand">PREFERRED PICKUP DATE</Text>
          <TextField placeholder="e.g. 5 Oct 2024" value={pickupDate} onChangeText={setPickupDate} />
        </View>
      </View>

      <View className="mt-[14px] flex-row items-start gap-[10px] rounded-2xl border-[0.661px] border-[rgba(30,58,95,0.09)] bg-[rgba(30,58,95,0.05)] px-[15px] py-3">
        <Feather name="info" size={18} color="#374151" style={{ marginTop: 1 }} />
        <Text className="flex-1 text-footnote font-outfit text-body">
          A haulage consultant will call you within 2 hours of booking to confirm pricing and logistics.
        </Text>
      </View>

      {error ? <Text className="pt-4 text-center text-footnote font-outfit-semibold text-[#DC2626]">{error}</Text> : null}

      <View className="py-5">
        <Button label="Request Haulage" onPress={handleRequest} loading={submitting} />
      </View>
    </ScreenContainer>
  );
}
