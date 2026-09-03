import { useState } from "react";
import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ShipStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { BackHeader } from "../../ui/BackHeader";
import { Button } from "../../ui/Button";
import { bookShipment, getEstimate, SERVICE_TIER_META, type ServiceTier } from "../../shipments/api";

type Props = NativeStackScreenProps<ShipStackParamList, "GetEstimate">;

function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

export function GetEstimateScreen({ navigation, route }: Props) {
  const { senderName, pickupAddress, receiverName, deliveryAddress, cargoType, weightKg, dimensions } = route.params;
  const [service, setService] = useState<ServiceTier>("express");
  const [insured, setInsured] = useState(false);
  const [tiers, setTiers] = useState(route.params.tiers);
  const [estimating, setEstimating] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  const breakdown = tiers[service];

  const handleInsuredChange = async (next: boolean) => {
    setInsured(next);
    setEstimating(true);
    setError("");
    try {
      // Insurance genuinely changes the server-computed total, so re-ask
      // the function rather than adding ₦500 on the client. Keep showing
      // the previous numbers while this is in flight (optimistic), rather
      // than blanking the panel.
      const nextTiers = await getEstimate({ weightKg, insured: next });
      setTiers(nextTiers);
    } catch (err) {
      setInsured(!next);
      setError(err instanceof Error ? err.message : "Couldn't update the estimate. Please try again.");
    } finally {
      setEstimating(false);
    }
  };

  const handleConfirmAndBook = async () => {
    setError("");
    setBooking(true);
    try {
      const { trackingRef } = await bookShipment({
        sender: { name: senderName, address: pickupAddress },
        receiver: { name: receiverName, address: deliveryAddress },
        cargo: { type: cargoType, weightKg, dimensions },
        serviceTier: service,
        insured,
      });
      navigation.navigate("Confirmed", { trackingRef });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't book this shipment. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <BackHeader title="Shipment Estimate" subtitle="Review your quote before confirming" onBack={() => navigation.goBack()} />

      <View className="mt-5 overflow-hidden rounded-[20px] bg-brand px-[18px] py-4">
        <View className="absolute -right-[15px] -top-[30px] size-[120px] rounded-full bg-white/5" />
        <Text className="font-outfit-semibold text-[10px] tracking-[0.8px] text-white/60">SHIPMENT SUMMARY</Text>
        <View className="flex-row gap-3 pt-[10px]">
          <View className="flex-1">
            <Text className="text-[10px] text-white/55">FROM</Text>
            <Text className="pt-[2px] font-outfit-bold text-[13px] text-white" numberOfLines={1}>{senderName}</Text>
            <Text className="font-outfit text-[11px] text-white/65" numberOfLines={1}>{pickupAddress}</Text>
          </View>
          <View className="items-center justify-center pt-[6px]">
            <View className="size-7 items-center justify-center rounded-full bg-white/15">
              <Feather name="arrow-right" size={14} color="#fff" />
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-[10px] text-white/55">TO</Text>
            <Text className="pt-[2px] font-outfit-bold text-[13px] text-white" numberOfLines={1}>{receiverName}</Text>
            <Text className="font-outfit text-[11px] text-white/65" numberOfLines={1}>{deliveryAddress}</Text>
          </View>
        </View>
        <View className="flex-row gap-4 border-t-[0.661px] border-white/15 pt-[10px] mt-3">
          <View>
            <Text className="font-outfit-medium text-[9.5px] text-white/50">Type</Text>
            <Text className="font-outfit-bold text-[12px] text-white">{cargoType}</Text>
          </View>
          <View>
            <Text className="font-outfit-medium text-[9.5px] text-white/50">Weight</Text>
            <Text className="font-outfit-bold text-[12px] text-white">{weightKg} kg</Text>
          </View>
          <View>
            <Text className="font-outfit-medium text-[9.5px] text-white/50">Dimensions</Text>
            <Text className="font-outfit-bold text-[12px] text-white">{dimensions}</Text>
          </View>
        </View>
      </View>

      <View className="pt-4">
        <Text className="font-outfit-bold text-[12px] tracking-[0.48px] text-brand">SELECT SERVICE</Text>
        <View className="mt-[10px] gap-2">
          {SERVICE_TIER_META.map((s) => {
            const active = service === s.key;
            return (
              <Pressable
                key={s.key}
                onPress={() => setService(s.key)}
                className={`flex-row items-center gap-3 rounded-2xl border-[1.984px] px-[15px] py-[13px] ${
                  active ? "border-brand bg-[#EEF1EF]" : "border-[rgba(27,67,50,0.09)] bg-surface"
                }`}
              >
                <View
                  className={`size-5 items-center justify-center rounded-full border-[1.984px] ${
                    active ? "border-brand bg-brand" : "border-[#D1D5DB] bg-white"
                  }`}
                >
                  {active ? <View className="size-[7px] rounded-full bg-white" /> : null}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className={`font-outfit-bold text-[14px] ${active ? "text-brand" : "text-ink"}`}>{s.name}</Text>
                    {s.badge ? (
                      <View className={`rounded-md px-[7px] py-[2px] ${active ? "bg-[rgba(27,67,50,0.09)]" : "bg-border"}`}>
                        <Text className={`font-outfit-bold text-[9.5px] tracking-[0.38px] ${active ? "text-brand" : "text-muted"}`}>
                          {s.badge}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text className="pt-px font-outfit text-[11.5px] text-muted">{s.eta}</Text>
                </View>
                <Text className={`font-outfit-extrabold text-[15px] ${active ? "text-brand" : "text-body"}`}>{formatNaira(tiers[s.key].total)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="mt-[14px] gap-3 rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.07)] bg-surface px-[18px] py-4">
        <View className="flex-row items-center gap-2">
          <Text className="font-outfit-bold text-[12px] tracking-[0.48px] text-brand">PRICE BREAKDOWN</Text>
          {estimating ? <ActivityIndicator size="small" color="#1B4332" /> : null}
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="font-outfit text-[13px] text-[#6B7280]">Base rate</Text>
          <Text className="font-outfit-semibold text-[13px] text-body">{formatNaira(breakdown.base)}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="font-outfit text-[13px] text-[#6B7280]">Weight charge ({weightKg} kg × ₦220)</Text>
          <Text className="font-outfit-semibold text-[13px] text-body">{formatNaira(breakdown.weightCharge)}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="font-outfit text-[13px] text-[#6B7280]">Fuel surcharge</Text>
          <Text className="font-outfit-semibold text-[13px] text-body">{formatNaira(breakdown.fuel)}</Text>
        </View>
        <View className="flex-row items-center justify-between border-t-[0.661px] border-[rgba(27,67,50,0.1)] pt-3">
          <View className="flex-row items-center gap-2">
            <Feather name="shield" size={18} color="#374151" />
            <View>
              <Text className="font-outfit-medium text-[13px] text-body">Cargo Insurance</Text>
              <Text className="font-outfit text-[11px] text-muted">Covers loss & damage</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="font-outfit text-[12px] text-muted">+₦500</Text>
            <Switch
              value={insured}
              onValueChange={handleInsuredChange}
              disabled={estimating}
              trackColor={{ false: "#D1D5DB", true: "#1B4332" }}
              thumbColor="#fff"
            />
          </View>
        </View>
        <View className="flex-row items-center justify-between border-t-[1.322px] border-[rgba(27,67,50,0.12)] pt-3">
          <Text className="font-outfit-bold text-[15px] text-ink">Total Estimate</Text>
          <Text className="font-outfit-black text-[22px] text-brand">{formatNaira(breakdown.total)}</Text>
        </View>
      </View>

      <View className="mt-[14px] flex-row items-center gap-[10px] rounded-2xl border-[0.661px] border-[rgba(30,58,95,0.09)] bg-[rgba(30,58,95,0.05)] px-[15px] py-3">
        <Feather name="map-pin" size={20} color="#1e3a5f" />
        <View className="flex-1">
          <Text className="font-outfit-semibold text-[12px] text-[#1e3a5f]">
            Estimated delivery: <Text className="font-outfit-black">{SERVICE_TIER_META.find((s) => s.key === service)?.eta}</Text>
          </Text>
          <Text className="pt-px font-outfit text-[11px] text-muted">Pickup scheduled within 24 hours of booking</Text>
        </View>
      </View>

      {error ? <Text className="pt-4 text-center font-outfit-semibold text-[12.5px] text-[#DC2626]">{error}</Text> : null}

      <View className="pt-5">
        <Button
          label="CONFIRM & BOOK"
          icon={<Feather name="check" size={16} color="#fff" />}
          onPress={handleConfirmAndBook}
          loading={booking}
        />
        <Text className="pt-[10px] text-center font-outfit text-[11px] text-muted">
          You won't be charged until pickup is confirmed.
        </Text>
      </View>
    </ScreenContainer>
  );
}
