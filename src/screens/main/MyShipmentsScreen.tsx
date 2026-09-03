import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { BackHeader } from "../../ui/BackHeader";
import { TextField } from "../../ui/TextField";

type Props = NativeStackScreenProps<HomeStackParamList, "MyShipments">;

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  "In Transit": { bg: "bg-[rgba(30,58,95,0.08)]", text: "text-[#1e3a5f]" },
  Delivered: { bg: "bg-[rgba(27,67,50,0.09)]", text: "text-brand" },
  "At Sorting Centre": { bg: "bg-[#ede9fe]", text: "text-[#7c3aed]" },
  "Pending Pickup": { bg: "bg-[#fef3c7]", text: "text-[#d97706]" },
  Cancelled: { bg: "bg-[#fee2e2]", text: "text-[#dc2626]" },
};

const SHIPMENTS = [
  { id: "DN-2024-08741", date: "Sept 28, 2024", status: "In Transit", from: "Lagos", to: "Abuja", category: "Electronics", weight: "14.5 kg" },
  { id: "DN-2024-08699", date: "Sept 22, 2024", status: "Delivered", from: "Kano", to: "Lagos", category: "General Goods", weight: "8.2 kg" },
  { id: "DN-2024-08654", date: "Sept 19, 2024", status: "At Sorting Centre", from: "Lagos", to: "Port Harcourt", category: "Documents", weight: "0.4 kg" },
  { id: "DN-2024-08612", date: "Sept 14, 2024", status: "Pending Pickup", from: "Ibadan", to: "Abuja", category: "Fragile Items", weight: "3.1 kg" },
  { id: "DN-2024-08580", date: "Sept 10, 2024", status: "Cancelled", from: "Lagos", to: "Enugu", category: "Food & Perishables", weight: "22.0 kg" },
  { id: "DN-2024-08541", date: "Sept 4, 2024", status: "Delivered", from: "Kaduna", to: "Lagos", category: "General Goods", weight: "5.7 kg" },
];

const FILTERS = ["All", "Active", "Completed", "Cancelled"];

export function MyShipmentsScreen({ navigation }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  return (
    <ScreenContainer scroll>
      <BackHeader title="My Shipments" subtitle={`${SHIPMENTS.length} total shipments`} onBack={() => navigation.goBack()} />

      <View className="pt-5">
        <TextField icon="search" placeholder="Search by ID, city…" value={search} onChangeText={setSearch} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pt-4">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              className={`rounded-full px-4 py-[7px] ${active ? "bg-brand" : "bg-surface"}`}
            >
              <Text className={`font-outfit-semibold text-[12px] ${active ? "text-white" : "text-muted"}`}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="mt-4 gap-3">
        {SHIPMENTS.map((s) => {
          const style = STATUS_STYLES[s.status];
          return (
            <Pressable key={s.id} className="rounded-[18px] border-[1.322px] border-[rgba(27,67,50,0.08)] bg-white px-4 py-[15px]">
              <View className="flex-row items-start justify-between">
                <View>
                  <Text className="font-outfit-medium text-[11px] text-muted">{s.date}</Text>
                  <Text className="pt-[2px] font-outfit-extrabold text-[13px] tracking-[0.26px] text-ink">{s.id}</Text>
                </View>
                <View className={`rounded-full px-[10px] py-1 ${style.bg}`}>
                  <Text className={`font-outfit-bold text-[10.5px] tracking-[0.21px] ${style.text}`}>{s.status}</Text>
                </View>
              </View>

              <View className="mt-3 flex-row items-center gap-2">
                <View className="flex-row items-center gap-[6px]">
                  <View className="size-2 rounded-full bg-brand" />
                  <Text className="font-outfit-bold text-[13px] text-ink">{s.from}</Text>
                </View>
                <View className="h-[1.5px] flex-1 rounded-full bg-[rgba(27,67,50,0.12)]" />
                <View className="flex-row items-center gap-[6px]">
                  <Feather name="map-pin" size={14} color="#111827" />
                  <Text className="font-outfit-bold text-[13px] text-ink">{s.to}</Text>
                </View>
              </View>

              <View className="mt-3 flex-row items-center gap-3">
                <View className="rounded-lg bg-surface px-[10px] py-1">
                  <Text className="font-outfit-medium text-[11px] text-[#6B7280]">{s.category}</Text>
                </View>
                <View className="rounded-lg bg-surface px-[10px] py-1">
                  <Text className="font-outfit-medium text-[11px] text-[#6B7280]">{s.weight}</Text>
                </View>
                <View className="flex-1 items-end">
                  <Text className="font-outfit-bold text-[12px] text-brand">Track →</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScreenContainer>
  );
}
