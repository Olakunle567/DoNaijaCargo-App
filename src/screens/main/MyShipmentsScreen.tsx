import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { BackHeader } from "../../ui/BackHeader";
import { TextField } from "../../ui/TextField";
import { useShipments } from "../../shipments/useShipments";

type Props = NativeStackScreenProps<HomeStackParamList, "MyShipments">;

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  "In Transit": { bg: "bg-[rgba(30,58,95,0.08)]", text: "text-[#1e3a5f]" },
  Delivered: { bg: "bg-[rgba(27,67,50,0.09)]", text: "text-brand" },
  "At Sorting Centre": { bg: "bg-[#ede9fe]", text: "text-[#7c3aed]" },
  "Out for Delivery": { bg: "bg-[#e0f2fe]", text: "text-[#0284c7]" },
  "Pending Pickup": { bg: "bg-[#fef3c7]", text: "text-[#d97706]" },
  Cancelled: { bg: "bg-[#fee2e2]", text: "text-[#dc2626]" },
};

const FILTERS = ["All", "Active", "Completed", "Cancelled"] as const;
const ACTIVE_STATUSES = ["In Transit", "At Sorting Centre", "Out for Delivery", "Pending Pickup"];

function formatDate(timestamp: { toDate: () => Date } | null) {
  if (!timestamp) return "—";
  return timestamp.toDate().toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" });
}

function ShipmentCardSkeleton() {
  return (
    <View className="rounded-[18px] border-[1.322px] border-[rgba(27,67,50,0.08)] bg-white px-4 py-[15px]">
      <View className="flex-row items-start justify-between">
        <View className="gap-[6px]">
          <View className="h-[11px] w-20 rounded-full bg-surface" />
          <View className="h-[13px] w-28 rounded-full bg-surface" />
        </View>
        <View className="h-5 w-24 rounded-full bg-surface" />
      </View>
      <View className="mt-4 h-[14px] w-full rounded-full bg-surface" />
      <View className="mt-4 flex-row gap-3">
        <View className="h-5 w-16 rounded-lg bg-surface" />
        <View className="h-5 w-14 rounded-lg bg-surface" />
      </View>
    </View>
  );
}

export function MyShipmentsScreen({ navigation }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const { shipments, loading } = useShipments();

  const filtered = shipments.filter((s) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Active" && ACTIVE_STATUSES.includes(s.status)) ||
      (filter === "Completed" && s.status === "Delivered") ||
      (filter === "Cancelled" && s.status === "Cancelled");
    if (!matchesFilter) return false;

    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      s.trackingRef.toLowerCase().includes(q) ||
      s.fromCity.toLowerCase().includes(q) ||
      s.toCity.toLowerCase().includes(q)
    );
  });

  return (
    <ScreenContainer scroll>
      <BackHeader title="My Shipments" subtitle={`${shipments.length} total shipments`} onBack={() => navigation.goBack()} />

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
        {loading ? (
          <>
            <ShipmentCardSkeleton />
            <ShipmentCardSkeleton />
            <ShipmentCardSkeleton />
          </>
        ) : (
          <>
            {filtered.length === 0 ? (
              <Text className="pt-8 text-center font-outfit text-[13px] text-muted">
                {shipments.length === 0 ? "No shipments yet. Book one from Ship Cargo." : "No shipments match your search."}
              </Text>
            ) : null}
            {filtered.map((s) => {
              const style = STATUS_STYLES[s.status] ?? { bg: "bg-surface", text: "text-muted" };
              return (
                <Pressable
                  key={s.id}
                  onPress={() => navigation.getParent()?.navigate("TrackingTab")}
                  className="rounded-[18px] border-[1.322px] border-[rgba(27,67,50,0.08)] bg-white px-4 py-[15px]"
                >
                  <View className="flex-row items-start justify-between">
                    <View>
                      <Text className="font-outfit-medium text-[11px] text-muted">{formatDate(s.createdAt)}</Text>
                      <Text className="pt-[2px] font-outfit-extrabold text-[13px] tracking-[0.26px] text-ink">{s.trackingRef}</Text>
                    </View>
                    <View className={`rounded-full px-[10px] py-1 ${style.bg}`}>
                      <Text className={`font-outfit-bold text-[10.5px] tracking-[0.21px] ${style.text}`}>{s.status}</Text>
                    </View>
                  </View>

                  <View className="mt-3 flex-row items-center gap-2">
                    <View className="flex-row items-center gap-[6px]">
                      <View className="size-2 rounded-full bg-brand" />
                      <Text className="font-outfit-bold text-[13px] text-ink" numberOfLines={1}>{s.fromCity}</Text>
                    </View>
                    <View className="h-[1.5px] flex-1 rounded-full bg-[rgba(27,67,50,0.12)]" />
                    <View className="flex-row items-center gap-[6px]">
                      <Feather name="map-pin" size={14} color="#111827" />
                      <Text className="font-outfit-bold text-[13px] text-ink" numberOfLines={1}>{s.toCity}</Text>
                    </View>
                  </View>

                  <View className="mt-3 flex-row items-center gap-3">
                    <View className="rounded-lg bg-surface px-[10px] py-1">
                      <Text className="font-outfit-medium text-[11px] text-[#6B7280]">{s.cargo.type}</Text>
                    </View>
                    <View className="rounded-lg bg-surface px-[10px] py-1">
                      <Text className="font-outfit-medium text-[11px] text-[#6B7280]">{s.cargo.weightKg} kg</Text>
                    </View>
                    <View className="flex-1 items-end">
                      <Text className="font-outfit-bold text-[12px] text-brand">Track →</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}
      </View>
    </ScreenContainer>
  );
}
