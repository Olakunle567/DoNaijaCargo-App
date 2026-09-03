import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AccountStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { BackHeader } from "../../ui/BackHeader";
import { useOrders } from "../../orders/OrdersContext";

type Props = NativeStackScreenProps<AccountStackParamList, "OrderHistory">;

const DELIVERED_SHIPMENTS = [
  { id: "DN-2024-08699", date: "Sept 22, 2024", from: "Kano", to: "Lagos", category: "General Goods", weight: "8.2 kg" },
  { id: "DN-2024-08541", date: "Sept 4, 2024", from: "Kaduna", to: "Lagos", category: "General Goods", weight: "5.7 kg" },
];

function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

export function OrderHistoryScreen({ navigation }: Props) {
  const { orders } = useOrders();

  return (
    <ScreenContainer scroll>
      <BackHeader title="Order History" subtitle="Past cargo & shop deliveries" onBack={() => navigation.goBack()} />

      <Text className="pt-5 font-outfit-bold text-[12px] tracking-[0.48px] text-brand">SHOP ORDERS</Text>
      {orders.length === 0 ? (
        <View className="mt-2 rounded-2xl border-[0.661px] border-[rgba(27,67,50,0.08)] bg-surface px-4 py-6">
          <Text className="text-center font-outfit text-[13px] text-muted">No shop orders yet.</Text>
        </View>
      ) : (
        <View className="mt-2 gap-3">
          {orders.map((o) => (
            <View key={o.id} className="rounded-[18px] border-[1.322px] border-[rgba(27,67,50,0.08)] bg-white px-4 py-[15px]">
              <View className="flex-row items-start justify-between">
                <View>
                  <Text className="font-outfit-medium text-[11px] text-muted">{o.date}</Text>
                  <Text className="pt-[2px] font-outfit-extrabold text-[13px] tracking-[0.26px] text-ink">{o.id}</Text>
                </View>
                <View className="rounded-full bg-[rgba(27,67,50,0.09)] px-[10px] py-1">
                  <Text className="font-outfit-bold text-[10.5px] text-brand">Delivered</Text>
                </View>
              </View>
              <View className="mt-3 gap-1">
                {o.items.map((item) => (
                  <View key={item.name} className="flex-row items-center gap-2">
                    <Text className="text-[16px]">{item.emoji}</Text>
                    <Text className="flex-1 font-outfit text-[12.5px] text-body" numberOfLines={1}>
                      {item.name} <Text className="text-muted">× {item.qty}</Text>
                    </Text>
                  </View>
                ))}
              </View>
              <View className="mt-3 flex-row items-center justify-between border-t-[0.661px] border-[rgba(27,67,50,0.08)] pt-3">
                <Text className="font-outfit text-[12px] text-muted">Total</Text>
                <Text className="font-outfit-bold text-[14px] text-brand">{formatNaira(o.total)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <Text className="pt-6 font-outfit-bold text-[12px] tracking-[0.48px] text-brand">DELIVERED SHIPMENTS</Text>
      <View className="mt-2 gap-3">
        {DELIVERED_SHIPMENTS.map((s) => (
          <View key={s.id} className="rounded-[18px] border-[1.322px] border-[rgba(27,67,50,0.08)] bg-white px-4 py-[15px]">
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="font-outfit-medium text-[11px] text-muted">{s.date}</Text>
                <Text className="pt-[2px] font-outfit-extrabold text-[13px] tracking-[0.26px] text-ink">{s.id}</Text>
              </View>
              <View className="rounded-full bg-[rgba(27,67,50,0.09)] px-[10px] py-1">
                <Text className="font-outfit-bold text-[10.5px] text-brand">Delivered</Text>
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
            </View>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}
