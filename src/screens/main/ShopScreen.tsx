import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { TextField } from "../../ui/TextField";
import { Button } from "../../ui/Button";

type Props = NativeStackScreenProps<HomeStackParamList, "Shop">;

const CATEGORIES = ["All", "Electronics", "Fashion", "Food", "Home", "Books", "Beauty"];

const PRODUCTS = [
  { name: "Wireless Earbuds Pro", category: "Electronics", emoji: "🎧", bg: "bg-[rgba(30,58,95,0.09)]", rating: 4.7, reviews: 128, price: 18500, badge: "Top Seller", badgeColor: "bg-brand" },
  { name: "Agbada Ensemble Set", category: "Fashion", emoji: "👘", bg: "bg-[rgba(27,67,50,0.09)]", rating: 4.5, reviews: 43, price: 12000, badge: "New", badgeColor: "bg-[#1e3a5f]" },
  { name: "Zobo & Spice Pack", category: "Food", emoji: "🌿", bg: "bg-[rgba(124,45,18,0.09)]", rating: 4.8, reviews: 89, price: 3500 },
  { name: "Smart LED Desk Lamp", category: "Home", emoji: "💡", bg: "bg-[rgba(55,65,81,0.09)]", rating: 4.4, reviews: 62, price: 8900, badge: "Sale", badgeColor: "bg-[#dc2626]" },
  { name: "Ankara Print Sneakers", category: "Fashion", emoji: "👟", bg: "bg-[rgba(6,95,70,0.09)]", rating: 4.6, reviews: 201, price: 15000, badge: "Popular", badgeColor: "bg-brand" },
  { name: "Portable Power Bank", category: "Electronics", emoji: "🔋", bg: "bg-[rgba(30,58,95,0.09)]", rating: 4.3, reviews: 77, price: 22000 },
  { name: "Nigerian Recipe Book", category: "Books", emoji: "📗", bg: "bg-[rgba(146,64,14,0.09)]", rating: 4.9, reviews: 35, price: 4500, badge: "New", badgeColor: "bg-[#1e3a5f]" },
  { name: "Shea Butter Cream Set", category: "Beauty", emoji: "🧴", bg: "bg-[rgba(91,33,182,0.09)]", rating: 4.7, reviews: 154, price: 6800 },
];

function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

export function ShopScreen({ navigation }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = PRODUCTS.filter((p) => cart[p.name]).reduce((sum, p) => sum + p.price * cart[p.name], 0);

  const addToCart = (name: string) => {
    setCart((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + 1 }));
  };

  const filtered = PRODUCTS.filter((p) => {
    const matchesCategory = category === "All" || p.category === category;
    const matchesSearch = !search.trim() || p.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <Pressable onPress={() => setCartOpen(true)} hitSlop={8} testID="cart-button">
          <Feather name="shopping-cart" size={22} color="#111827" />
          {cartCount > 0 ? (
            <View className="absolute -right-2 -top-2 size-4 items-center justify-center rounded-full border-2 border-white bg-brand">
              <Text className="font-outfit-bold text-[9px] text-white">{cartCount}</Text>
            </View>
          ) : null}
        </Pressable>
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
        <Text className="font-outfit text-[11px] text-muted">{filtered.length} items</Text>
      </View>

      {filtered.length === 0 ? (
        <Text className="pt-8 text-center font-outfit text-[13px] text-muted">No products match your search.</Text>
      ) : null}

      <View className="mt-3 flex-row flex-wrap gap-3">
        {filtered.map((p) => (
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
                <Text className="font-outfit-extrabold text-[14px] text-brand">{formatNaira(p.price)}</Text>
                <Pressable onPress={() => addToCart(p.name)} className="size-[30px] items-center justify-center rounded-full bg-brand" testID={`add-to-cart-${p.name}`}>
                  <Feather name="plus" size={14} color="#fff" />
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Modal visible={cartOpen} transparent animationType="fade" onRequestClose={() => setCartOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setCartOpen(false)}>
          <Pressable className="rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-4">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>
            <Text className="pb-4 font-outfit-extrabold text-[17px] text-ink">Your Cart</Text>
            {cartCount === 0 ? (
              <Text className="pb-4 font-outfit text-[13px] text-muted">Your cart is empty. Add something from the Shop.</Text>
            ) : (
              <>
                {PRODUCTS.filter((p) => cart[p.name]).map((p) => (
                  <View key={p.name} className="flex-row items-center justify-between border-b-[0.661px] border-[rgba(27,67,50,0.07)] py-3">
                    <View className="flex-row items-center gap-3">
                      <View className={`size-11 items-center justify-center rounded-xl ${p.bg}`}>
                        <Text className="text-[20px]">{p.emoji}</Text>
                      </View>
                      <View>
                        <Text className="font-outfit-semibold text-[13px] text-ink">{p.name}</Text>
                        <Text className="font-outfit text-[11px] text-muted">Qty {cart[p.name]} · {formatNaira(p.price)} each</Text>
                      </View>
                    </View>
                    <Text className="font-outfit-bold text-[13px] text-brand">{formatNaira(p.price * cart[p.name])}</Text>
                  </View>
                ))}
                <View className="flex-row items-center justify-between pt-4">
                  <Text className="font-outfit-bold text-[15px] text-ink">Total</Text>
                  <Text className="font-outfit-black text-[20px] text-brand">{formatNaira(cartTotal)}</Text>
                </View>
                <View className="pt-4">
                  <Button label="CHECKOUT" onPress={() => setCartOpen(false)} />
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}
