import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { TextField } from "../../ui/TextField";
import { Button } from "../../ui/Button";
import { useProducts, type Product } from "../../shop/useProducts";
import { useCart } from "../../shop/useCart";
import { placeOrder } from "../../shop/api";

type Props = NativeStackScreenProps<HomeStackParamList, "Shop">;

const CATEGORIES = ["All", "Electronics", "Fashion", "Food", "Home", "Books", "Beauty"];

// Decorative only — not stored on the product doc. One tint per category
// (the original mock varied this per item; that fidelity was dropped rather
// than adding a styling field to the Firestore schema for it).
const CATEGORY_BG: Record<string, string> = {
  Electronics: "bg-[rgba(30,58,95,0.09)]",
  Fashion: "bg-[rgba(27,67,50,0.09)]",
  Food: "bg-[rgba(124,45,18,0.09)]",
  Home: "bg-[rgba(55,65,81,0.09)]",
  Books: "bg-[rgba(146,64,14,0.09)]",
  Beauty: "bg-[rgba(91,33,182,0.09)]",
};

const BADGE_COLOR: Record<string, string> = {
  "Top Seller": "bg-brand",
  New: "bg-[#1e3a5f]",
  Sale: "bg-[#dc2626]",
  Popular: "bg-brand",
};

function formatNaira(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

function ProductCardSkeleton() {
  return (
    <View className="w-[47.5%] overflow-hidden rounded-[18px] border-[1.322px] border-[rgba(27,67,50,0.07)] bg-white">
      <View className="h-[110px] bg-surface" />
      <View className="gap-2 px-3 pb-3 pt-[10px]">
        <View className="h-[13px] w-3/4 rounded-full bg-surface" />
        <View className="h-[10px] w-1/2 rounded-full bg-surface" />
        <View className="h-5 w-2/3 rounded-full bg-surface" />
      </View>
    </View>
  );
}

export function ShopScreen({ navigation }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const { products, loading: productsLoading } = useProducts();
  const cart = useCart();

  const cartProducts = cart.items
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((entry): entry is { item: (typeof cart.items)[number]; product: Product } => !!entry.product);
  const cartTotal = cartProducts.reduce((sum, { item, product }) => sum + product.price * item.qty, 0);

  const closeCart = () => {
    setCartOpen(false);
    setCheckedOut(false);
    setCheckoutError("");
  };

  const handleCheckout = async () => {
    setCheckoutError("");
    setCheckingOut(true);
    try {
      await placeOrder();
      setCheckedOut(true);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Couldn't place this order. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  const filtered = products.filter((p) => {
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
          {cart.count > 0 ? (
            <View className="absolute -right-2 -top-2 size-4 items-center justify-center rounded-full border-2 border-white bg-brand">
              <Text className="font-outfit-bold text-[9px] text-white">{cart.count}</Text>
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

      {productsLoading ? (
        <View className="mt-3 flex-row flex-wrap gap-3">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </View>
      ) : (
        <>
          {filtered.length === 0 ? (
            <Text className="pt-8 text-center font-outfit text-[13px] text-muted">No products match your search.</Text>
          ) : null}

          <View className="mt-3 flex-row flex-wrap gap-3">
            {filtered.map((p) => (
              <View key={p.id} className="w-[47.5%] overflow-hidden rounded-[18px] border-[1.322px] border-[rgba(27,67,50,0.07)] bg-white">
                <View className={`h-[110px] items-center justify-center ${CATEGORY_BG[p.category] ?? "bg-surface"}`}>
                  <Text className="text-[48px]">{p.emoji}</Text>
                  {p.badge ? (
                    <View className={`absolute left-2 top-2 rounded-md px-[7px] py-[2px] ${BADGE_COLOR[p.badge] ?? "bg-brand"}`}>
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
                    <Text className="font-outfit text-[10px] text-muted">({p.ratingCount})</Text>
                  </View>
                  <View className="flex-row items-center justify-between pt-2">
                    <Text className="font-outfit-extrabold text-[14px] text-brand">{formatNaira(p.price)}</Text>
                    <Pressable
                      onPress={() => cart.addToCart(p.id)}
                      className="size-[30px] items-center justify-center rounded-full bg-brand"
                      testID={`add-to-cart-${p.name}`}
                    >
                      <Feather name="plus" size={14} color="#fff" />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      <Modal visible={cartOpen} transparent animationType="fade" onRequestClose={closeCart}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={closeCart}>
          <Pressable className="rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-4">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>
            {checkedOut ? (
              <View className="items-center py-2">
                <View className="mb-3 size-14 items-center justify-center rounded-full bg-[rgba(27,67,50,0.08)]">
                  <Feather name="check" size={24} color="#1B4332" />
                </View>
                <Text className="pb-1 font-outfit-extrabold text-[17px] text-ink">Order Placed!</Text>
                <Text className="pb-5 text-center font-outfit text-[13px] text-muted">
                  Your order is on its way. Track it anytime from Order History.
                </Text>
                <View className="w-full">
                  <Button label="Done" onPress={closeCart} />
                </View>
              </View>
            ) : (
              <>
                <Text className="pb-4 font-outfit-extrabold text-[17px] text-ink">Your Cart</Text>
                {cartProducts.length === 0 ? (
                  <Text className="pb-4 font-outfit text-[13px] text-muted">Your cart is empty. Add something from the Shop.</Text>
                ) : (
                  <>
                    {cartProducts.map(({ item, product }) => (
                      <View key={product.id} className="flex-row items-center justify-between border-b-[0.661px] border-[rgba(27,67,50,0.07)] py-3">
                        <View className="flex-row items-center gap-3">
                          <View className={`size-11 items-center justify-center rounded-xl ${CATEGORY_BG[product.category] ?? "bg-surface"}`}>
                            <Text className="text-[20px]">{product.emoji}</Text>
                          </View>
                          <View>
                            <Text className="font-outfit-semibold text-[13px] text-ink">{product.name}</Text>
                            <Text className="font-outfit text-[11px] text-muted">Qty {item.qty} · {formatNaira(product.price)} each</Text>
                          </View>
                        </View>
                        <View className="flex-row items-center gap-3">
                          <Text className="font-outfit-bold text-[13px] text-brand">{formatNaira(product.price * item.qty)}</Text>
                          <Pressable onPress={() => cart.removeFromCart(product.id)} hitSlop={8} testID={`remove-from-cart-${product.id}`}>
                            <Feather name="x" size={16} color="#9CA3AF" />
                          </Pressable>
                        </View>
                      </View>
                    ))}
                    <View className="flex-row items-center justify-between pt-4">
                      <Text className="font-outfit-bold text-[15px] text-ink">Total</Text>
                      <Text className="font-outfit-black text-[20px] text-brand">{formatNaira(cartTotal)}</Text>
                    </View>
                    {checkoutError ? (
                      <Text className="pt-3 text-center font-outfit-semibold text-[12px] text-[#DC2626]">{checkoutError}</Text>
                    ) : null}
                    <View className="pt-4">
                      <Button label="CHECKOUT" onPress={handleCheckout} loading={checkingOut} />
                    </View>
                  </>
                )}
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}
