import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { AppHeader } from "../../ui/AppHeader";
import { MapIllustration } from "../../ui/MapIllustration";

const MILESTONES = [
  { title: "Order Placed", detail: "Sept 28, 08:12 AM · D.O Naija HQ, Lagos", done: true },
  { title: "Arrived at Sorting Center", detail: "Sept 28, 11:45 AM · Apapa Sorting Facility", done: true },
  { title: "In Transit", detail: "Sept 29, 07:30 AM · En route to Abuja", done: true },
  { title: "Out for Delivery", detail: "Expected Sept 30, from 9:00 AM", done: false },
  { title: "Delivered", detail: "Pending confirmation", done: false },
];

export function TrackScreen() {
  const [trackingId, setTrackingId] = useState("DN-2024-08741");

  return (
    <ScreenContainer scroll className="px-0">
      <View className="px-5">
        <AppHeader />
      </View>
      <View className="px-4 pt-4">
        <Text className="font-outfit-extrabold text-[22px] text-ink">Track Shipment</Text>
        <Text className="pt-[2px] font-outfit text-[13px] text-muted">Real-time cargo tracking</Text>

        <View className="mt-4 h-[150px] overflow-hidden rounded-2xl border-[0.661px] border-border-brand">
          <MapIllustration width={358} height={150} />
          <View className="absolute left-[100px] top-[24px] flex-row items-center gap-1 rounded-[10px] bg-brand px-2 py-[5px]">
            <Feather name="truck" size={14} color="#fff" />
            <Text className="font-outfit-bold text-[9px] text-white">In Transit</Text>
          </View>
          <Text className="absolute bottom-3 left-3 font-outfit-semibold text-[9px] tracking-[0.45px] text-brand opacity-70">
            LAGOS, NG
          </Text>
          <Text className="absolute right-3 top-3 font-outfit-semibold text-[9px] tracking-[0.45px] text-[#1e3a5f] opacity-70">
            ABUJA, NG
          </Text>
        </View>

        <View className="mt-4 flex-row items-center gap-2 rounded-2xl border-[1.984px] border-brand bg-[#EEF1EF] px-[14px] py-[10px]">
          <Feather name="map-pin" size={18} color="#1B4332" />
          <Text className="flex-1 font-outfit-medium text-[13px] text-ink">{trackingId}</Text>
          <Pressable className="rounded-[10px] bg-brand px-[14px] py-[7px]">
            <Text className="font-outfit-extrabold text-[12px] tracking-[0.72px] text-white">TRACK</Text>
          </Pressable>
        </View>

        <View className="mt-4 gap-1 rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.08)] bg-surface p-[18px]">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="font-outfit-semibold text-[11px] tracking-[0.55px] text-muted">TRACKING ID · {trackingId}</Text>
              <Text className="pt-1 font-outfit-extrabold text-[18px] text-ink">Estimated Delivery:</Text>
              <Text className="font-outfit-extrabold text-[18px] text-brand">Tue, Sept 30 · 2–5 PM</Text>
              <View className="mt-2 flex-row items-center gap-[6px] self-start rounded-full bg-[rgba(27,67,50,0.09)] px-3 py-[5px]">
                <View className="size-[7px] rounded-full bg-brand" />
                <Text className="font-outfit-bold text-[12px] text-brand">Arriving Today</Text>
              </View>
            </View>
            <Feather name="map-pin" size={44} color="#1B4332" style={{ opacity: 0.85 }} />
          </View>

          <View className="mt-3 flex-row gap-6 border-t-[0.661px] border-[rgba(27,67,50,0.1)] pt-3">
            <View>
              <Text className="font-outfit-medium text-[10px] text-muted">FROM</Text>
              <Text className="pt-[2px] font-outfit-bold text-[13px] text-ink">Lagos, NG</Text>
            </View>
            <Text className="font-outfit text-[16px] text-brand">→</Text>
            <View>
              <Text className="font-outfit-medium text-[10px] text-muted">TO</Text>
              <Text className="pt-[2px] font-outfit-bold text-[13px] text-ink">Abuja, NG</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="font-outfit-medium text-[10px] text-muted">WEIGHT</Text>
              <Text className="pt-[2px] font-outfit-bold text-[13px] text-ink">14.5 kg</Text>
            </View>
          </View>
        </View>

        <View className="mt-[14px] rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.08)] bg-white p-[18px]">
          <Text className="font-outfit-bold text-[13px] tracking-[0.39px] text-brand">SHIPMENT MILESTONES</Text>
          <View className="mt-4 gap-5">
            {MILESTONES.map((m) => (
              <View key={m.title} className="flex-row items-start gap-4">
                <View
                  className={`size-5 items-center justify-center rounded-full border-[1.984px] ${
                    m.done ? "border-brand bg-brand" : "border-[#D1D5DB] bg-white"
                  }`}
                >
                  {m.done ? <Feather name="check" size={10} color="#fff" /> : null}
                </View>
                <View className="flex-1 pt-px">
                  <Text className={`font-outfit-bold text-[13px] ${m.done ? "text-ink" : "text-[#9CA3AF]"}`}>{m.title}</Text>
                  <Text className="pt-[2px] font-outfit text-[11px] text-muted">{m.detail}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
