import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AccountStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { BackHeader } from "../../ui/BackHeader";
import { useOrders } from "../../orders/api";
import { useShipments } from "../../shipments/useShipments";
import { useSettings } from "../../settings/SettingsContext";
import { formatCurrency } from "../../lib/currency";

type Props = NativeStackScreenProps<AccountStackParamList, "OrderHistory">;

function formatDate(timestamp: { toDate: () => Date } | null) {
  if (!timestamp) return "—";
  return timestamp.toDate().toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" });
}

function CardSkeleton() {
  return (
    <View className="rounded-[18px] border-[1.322px] border-[rgba(27,67,50,0.08)] bg-white px-4 py-[15px]">
      <View className="flex-row items-start justify-between">
        <View className="gap-[6px]">
          <View className="h-[11px] w-20 rounded-full bg-surface" />
          <View className="h-[13px] w-28 rounded-full bg-surface" />
        </View>
        <View className="h-5 w-20 rounded-full bg-surface" />
      </View>
      <View className="mt-4 h-[14px] w-full rounded-full bg-surface" />
    </View>
  );
}

export function OrderHistoryScreen({ navigation }: Props) {
  const { currency } = useSettings();
  const { orders, loading: ordersLoading } = useOrders();
  const { shipments, loading: shipmentsLoading } = useShipments();
  const deliveredShipments = shipments.filter((s) => s.status === "Delivered");

  return (
    <ScreenContainer scroll>
      <BackHeader title="Order History" subtitle="Past cargo & shop deliveries" onBack={() => navigation.goBack()} />

      <Text className="pt-5 font-outfit-bold text-[12px] tracking-[0.48px] text-brand">SHOP ORDERS</Text>
      {ordersLoading ? (
        <View className="mt-2 gap-3">
          <CardSkeleton />
        </View>
      ) : orders.length === 0 ? (
        <View className="mt-2 rounded-2xl border-[0.661px] border-[rgba(27,67,50,0.08)] bg-surface px-4 py-6">
          <Text className="text-center font-outfit text-[13px] text-muted">No shop orders yet.</Text>
        </View>
      ) : (
        <View className="mt-2 gap-3">
          {orders.map((o) => (
            <View key={o.id} className="rounded-[18px] border-[1.322px] border-[rgba(27,67,50,0.08)] bg-white px-4 py-[15px]">
              <View className="flex-row items-start justify-between">
                <View>
                  <Text className="font-outfit-medium text-[11px] text-muted">{formatDate(o.createdAt)}</Text>
                  <Text className="pt-[2px] font-outfit-extrabold text-[13px] tracking-[0.26px] text-ink">{o.id}</Text>
                </View>
                <View className="rounded-full bg-[rgba(27,67,50,0.09)] px-[10px] py-1">
                  <Text className="font-outfit-bold text-[10.5px] text-brand">{o.status === "placed" ? "Placed" : o.status}</Text>
                </View>
              </View>
              <View className="mt-3 gap-1">
                {o.items.map((item) => (
                  <View key={item.productId} className="flex-row items-center gap-2">
                    <Text className="text-[16px]">{item.emoji}</Text>
                    <Text className="flex-1 font-outfit text-[12.5px] text-body" numberOfLines={1}>
                      {item.name} <Text className="text-muted">× {item.qty}</Text>
                    </Text>
                  </View>
                ))}
              </View>
              <View className="mt-3 flex-row items-center justify-between border-t-[0.661px] border-[rgba(27,67,50,0.08)] pt-3">
                <Text className="font-outfit text-[12px] text-muted">Total</Text>
                <Text className="font-outfit-bold text-[14px] text-brand">{formatCurrency(o.total, currency)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <Text className="pt-6 font-outfit-bold text-[12px] tracking-[0.48px] text-brand">DELIVERED SHIPMENTS</Text>
      {shipmentsLoading ? (
        <View className="mt-2 gap-3">
          <CardSkeleton />
        </View>
      ) : deliveredShipments.length === 0 ? (
        <View className="mt-2 rounded-2xl border-[0.661px] border-[rgba(27,67,50,0.08)] bg-surface px-4 py-6">
          <Text className="text-center font-outfit text-[13px] text-muted">No delivered shipments yet.</Text>
        </View>
      ) : (
        <View className="mt-2 gap-3">
          {deliveredShipments.map((s) => (
            <View key={s.id} className="rounded-[18px] border-[1.322px] border-[rgba(27,67,50,0.08)] bg-white px-4 py-[15px]">
              <View className="flex-row items-start justify-between">
                <View>
                  <Text className="font-outfit-medium text-[11px] text-muted">{formatDate(s.createdAt)}</Text>
                  <Text className="pt-[2px] font-outfit-extrabold text-[13px] tracking-[0.26px] text-ink">{s.trackingRef}</Text>
                </View>
                <View className="rounded-full bg-[rgba(27,67,50,0.09)] px-[10px] py-1">
                  <Text className="font-outfit-bold text-[10.5px] text-brand">Delivered</Text>
                </View>
              </View>
              <View className="mt-3 flex-row items-center gap-2">
                <View className="flex-row items-center gap-[6px]">
                  <View className="size-2 rounded-full bg-brand" />
                  <Text className="font-outfit-bold text-[13px] text-ink">{s.fromCity}</Text>
                </View>
                <View className="h-[1.5px] flex-1 rounded-full bg-[rgba(27,67,50,0.12)]" />
                <View className="flex-row items-center gap-[6px]">
                  <Feather name="map-pin" size={14} color="#111827" />
                  <Text className="font-outfit-bold text-[13px] text-ink">{s.toCity}</Text>
                </View>
              </View>
              <View className="mt-3 flex-row items-center gap-3">
                <View className="rounded-lg bg-surface px-[10px] py-1">
                  <Text className="font-outfit-medium text-[11px] text-[#6B7280]">{s.cargo.type}</Text>
                </View>
                <View className="rounded-lg bg-surface px-[10px] py-1">
                  <Text className="font-outfit-medium text-[11px] text-[#6B7280]">{s.cargo.weightKg} kg</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
