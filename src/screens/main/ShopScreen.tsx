import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { TextField } from "../../ui/TextField";

type Props = NativeStackScreenProps<HomeStackParamList, "Shop">;

const CATEGORIES = ["All", "Electronics", "Fashion", "Food", "Home", "Books", "Beauty"];

const PRODUCTS = [
  { name: "Wireless Earbuds Pro", emoji: "🎧", bg: "bg-[rgba(30,58,95,0.09)]", rating: 4.7, reviews: 128, price: "₦18,500", badge: "Top Seller", badgeColor: "bg-brand" },
  { name: "Agbada Ensemble Set", emoji: "👘", bg: "bg-[rgba(27,67,50,0.09)]", rating: 4.5, reviews: 43, price: "₦12,000", badge: "New", badgeColor: "bg-[#1e3a5f]" },
  { name: "Zobo & Spice Pack", emoji: "🌿", bg: "bg-[rgba(124,45,18,0.09)]", rating: 4.8, reviews: 89, price: "₦3,500" },
  { name: "Smart LED Desk Lamp", emoji: "💡", bg: "bg-[rgba(55,65,81,0.09)]", rating: 4.4, reviews: 62, price: "₦8,900", badge: "Sale", badgeColor: "bg-[#dc2626]" },
  { name: "Ankara Print Sneakers", emoji: "👟", bg: "bg-[rgba(6,95,70,0.09)]", rating: 4.6, reviews: 201, price: "₦15,000", badge: "Popular", badgeColor: "bg-brand" },
  { name: "Portable Power Bank", emoji: "🔋", bg: "bg-[rgba(30,58,95,0.09)]", rating: 4.3, reviews: 77, price: "₦22,000" },
  { name: "Nigerian Recipe Book", emoji: "📗", bg: "bg-[rgba(146,64,14,0.09)]", rating: 4.9, reviews: 35, price: "₦4,500", badge: "New", badgeColor: "bg-[#1e3a5f]" },
  { name: "Shea Butter Cream Set", emoji: "🧴", bg: "bg-[rgba(91,33,182,0.09)]", rating: 4.7, reviews: 154, price: "₦6,800" },
];

export function ShopScreen({ navigation }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  return (
    <ScreenContainer scroll>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => navigation.goBack()}
            className="size-[38px] items-center justify-center rounded-xl border-[0.661px] border-border-brand bg-[#EEF1EF]"
          >
            <Feather name="arrow-left" size={19} color="#1B4332" />
          </Pressable>
          <View>
            <Text className="font-outfit-extrabold text-[20px] text-ink">Shop</Text>
            <Text className="font-outfit text-[12px] text-muted">Order goods, we deliver them</Text>
          </View>
        </View>
        <Feather name="shopping-cart" size={22} color="#111827" />
      </View>

      <View className="pt-4">
        <TextField icon="search" placeholder="Search products…" value={search} onChangeText={setSearch} />
      </View>

      <View className="mt-4 flex-row items-center justify-between overflow-hidden rounded-2xl bg-brand px-[18px] py-4">
        <View className="w-[180px]">
          <Text className="font-outfit-semibold text-[11px] tracking-[0.66px] text-white/65">FREE DELIVERY</Text>
          <Text className="pt-1 font-outfit-extrabold text-[16px] text-white">On orders over ₦10,000</Text>
          <Text className="pt-1 font-outfit text-[11px] text-white/60">Delivered in 24–48 hours</Text>
        </View>
        <Text className="text-[40px]">🚚</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pt-4">
        {CATEGORIES.map((c) => {
          const active = category === c;
          return (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              className={`rounded-full px-4 py-[7px] ${active ? "bg-brand" : "bg-surface"}`}
            >
              <Text className={`font-outfit-semibold text-[12px] ${active ? "text-white" : "text-muted"}`}>{c}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="mt-4 flex-row items-center justify-between">
        <Text className="font-outfit-bold text-[13px] text-ink">Featured Products</Text>
        <Text className="font-outfit text-[11px] text-muted">{PRODUCTS.length} items</Text>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-3">
        {PRODUCTS.map((p) => (
          <View key={p.name} className="w-[47.5%] overflow-hidden rounded-[18px] border-[1.322px] border-[rgba(27,67,50,0.07)] bg-white">
            <View className={`h-[110px] items-center justify-center ${p.bg}`}>
              <Text className="text-[48px]">{p.emoji}</Text>
              {p.badge ? (
                <View className={`absolute left-2 top-2 rounded-md px-[7px] py-[2px] ${p.badgeColor}`}>
                  <Text className="font-outfit-bold text-[9px] tracking-[0.36px] text-white">{p.badge}</Text>
                </View>
              ) : null}
            </View>
            <View className="gap-1 px-3 pb-3 pt-[10px]">
              <Text className="font-outfit-bold text-[12.5px] text-ink" numberOfLines={1}>
                {p.name}
              </Text>
              <View className="flex-row items-center gap-1">
                <Feather name="star" size={11} color="#F59E0B" />
                <Text className="font-outfit-semibold text-[10.5px] text-body">{p.rating}</Text>
                <Text className="font-outfit text-[10px] text-muted">({p.reviews})</Text>
              </View>
              <View className="flex-row items-center justify-between pt-2">
                <Text className="font-outfit-extrabold text-[14px] text-brand">{p.price}</Text>
                <Pressable className="size-[30px] items-center justify-center rounded-full bg-brand">
                  <Feather name="plus" size={14} color="#fff" />
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}
