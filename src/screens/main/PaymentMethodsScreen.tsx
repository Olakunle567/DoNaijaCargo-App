import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AccountStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { BackHeader } from "../../ui/BackHeader";
import { Button } from "../../ui/Button";
import { useWallet } from "../../wallet/useWallet";
import { useSettings } from "../../settings/SettingsContext";
import { formatCurrency } from "../../lib/currency";

type Props = NativeStackScreenProps<AccountStackParamList, "PaymentMethods">;

type Card = { id: string; brand: "Visa" | "Mastercard"; last4: string; expiry: string; name: string };

const BRAND_COLOR: Record<Card["brand"], string> = { Visa: "#1A1F71", Mastercard: "#EB001B" };

function detectBrand(number: string): Card["brand"] {
  return number.trim().startsWith("5") ? "Mastercard" : "Visa";
}

export function PaymentMethodsScreen({ navigation }: Props) {
  const { wallet } = useWallet();
  const { currency } = useSettings();
  const [cards, setCards] = useState<Card[]>([]);
  const [defaultId, setDefaultId] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setNumber("");
    setExpiry("");
    setCvv("");
    setName("");
    setError("");
  };

  const handleAddCard = () => {
    const digits = number.replace(/\s/g, "");
    if (digits.length < 12 || !/^\d+$/.test(digits)) {
      setError("Enter a valid card number.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Expiry must be in MM/YY format.");
      return;
    }
    if (cvv.length < 3) {
      setError("Enter a valid CVV.");
      return;
    }
    if (!name.trim()) {
      setError("Enter the name on the card.");
      return;
    }
    const newCard: Card = {
      id: `card-${Date.now()}`,
      brand: detectBrand(digits),
      last4: digits.slice(-4),
      expiry,
      name: name.trim(),
    };
    setCards((prev) => [...prev, newCard]);
    setDefaultId(newCard.id);
    setAddOpen(false);
    resetForm();
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    if (defaultId === id) {
      setDefaultId((cards.find((c) => c.id !== id)?.id) ?? "");
    }
  };

  return (
    <ScreenContainer scroll>
      <BackHeader title="Payment Methods" subtitle="Cards, bank & wallet" onBack={() => navigation.goBack()} />

      <View className="mt-5 gap-3">
        <View className="flex-row items-center gap-3 rounded-2xl border-[1.322px] border-border-brand bg-surface px-4 py-[14px]">
          <View className="size-10 items-center justify-center rounded-xl bg-[rgba(27,67,50,0.08)]">
            <MaterialCommunityIcons name="wallet-outline" size={20} color="#1B4332" />
          </View>
          <View className="flex-1">
            <Text className="font-outfit-semibold text-[14px] text-ink">D.O Naija Wallet</Text>
            <Text className="font-outfit text-[11.5px] text-muted">
              {wallet ? `${formatCurrency(wallet.balance, currency)} available · ${wallet.walletId}` : "···"}
            </Text>
          </View>
        </View>

        {cards.map((c) => {
          const isDefault = defaultId === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => setDefaultId(c.id)}
              className={`flex-row items-center gap-3 rounded-2xl border-[1.322px] px-4 py-[14px] active:opacity-70 ${
                isDefault ? "border-brand bg-[#EEF1EF]" : "border-border-brand bg-white"
              }`}
            >
              <View className="h-10 w-14 items-center justify-center rounded-lg" style={{ backgroundColor: BRAND_COLOR[c.brand] }}>
                <Text className="font-outfit-extrabold text-[10px] text-white">{c.brand}</Text>
              </View>
              <View className="flex-1">
                <Text className="font-outfit-semibold text-[14px] text-ink">•••• {c.last4}</Text>
                <Text className="font-outfit text-[11.5px] text-muted">Expires {c.expiry} · {c.name}</Text>
              </View>
              {isDefault ? (
                <View className="rounded-full bg-brand px-[10px] py-1">
                  <Text className="font-outfit-bold text-[10px] text-white">DEFAULT</Text>
                </View>
              ) : null}
              <Pressable onPress={() => removeCard(c.id)} hitSlop={8} className="pl-1">
                <Feather name="trash-2" size={17} color="#9CA3AF" />
              </Pressable>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => setAddOpen(true)}
          className="flex-row items-center justify-center gap-2 rounded-2xl border-[1.322px] border-dashed border-border-brand py-[14px] active:opacity-70"
        >
          <Feather name="plus" size={17} color="#1B4332" />
          <Text className="font-outfit-bold text-[13px] text-brand">Add New Card</Text>
        </Pressable>
      </View>

      <Modal visible={addOpen} transparent animationType="fade" onRequestClose={() => setAddOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setAddOpen(false)}>
          <Pressable className="gap-3 rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-1">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>
            <Text className="text-headline font-outfit-semibold text-ink">Add New Card</Text>

            <View className="flex-row items-center gap-3 rounded-xl border-[1.322px] border-border-brand bg-surface px-[15px] py-[13px]">
              <Feather name="credit-card" size={18} color="#374151" />
              <TextInput
                className="flex-1 font-outfit text-[14px] text-ink"
                placeholder="Card number"
                placeholderTextColor="#99A1AF"
                value={number}
                onChangeText={setNumber}
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-xl border-[1.322px] border-border-brand bg-surface px-[15px] py-[13px]">
                <TextInput
                  className="font-outfit text-[14px] text-ink"
                  placeholder="MM/YY"
                  placeholderTextColor="#99A1AF"
                  value={expiry}
                  onChangeText={setExpiry}
                  maxLength={5}
                />
              </View>
              <View className="flex-1 rounded-xl border-[1.322px] border-border-brand bg-surface px-[15px] py-[13px]">
                <TextInput
                  className="font-outfit text-[14px] text-ink"
                  placeholder="CVV"
                  placeholderTextColor="#99A1AF"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                />
              </View>
            </View>
            <View className="rounded-xl border-[1.322px] border-border-brand bg-surface px-[15px] py-[13px]">
              <TextInput
                className="font-outfit text-[14px] text-ink"
                placeholder="Name on card"
                placeholderTextColor="#99A1AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {error ? <Text className="text-footnote font-outfit-semibold text-[#DC2626]">{error}</Text> : null}

            <View className="pt-1">
              <Button label="Save Card" onPress={handleAddCard} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}
