import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ShipStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { AppHeader } from "../../ui/AppHeader";
import { TextField } from "../../ui/TextField";
import { SectionLabel } from "../../ui/SectionLabel";
import { Button } from "../../ui/Button";

type Props = NativeStackScreenProps<ShipStackParamList, "Ship">;

const CARGO_TYPES = ["General Goods", "Electronics", "Documents", "Fragile Items", "Food & Perishables", "Fashion", "Furniture", "Auto Parts"];

export function ShipScreen({ navigation }: Props) {
  const [senderName, setSenderName] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [cargoType, setCargoType] = useState("General Goods");
  const [cargoTypeOpen, setCargoTypeOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [error, setError] = useState("");

  const handleGetEstimate = () => {
    if (!senderName.trim() || !pickupAddress.trim() || !receiverName.trim() || !deliveryAddress.trim()) {
      setError("Please fill in sender, receiver, and both addresses.");
      return;
    }
    setError("");
    navigation.navigate("GetEstimate", {
      senderName: senderName.trim(),
      pickupAddress: pickupAddress.trim(),
      receiverName: receiverName.trim(),
      deliveryAddress: deliveryAddress.trim(),
      cargoType,
      weight: weight.trim() || "12.5",
      dimensions: dimensions.trim() || "—",
    });
  };

  return (
    <ScreenContainer scroll className="px-0">
      <View className="px-5">
        <AppHeader />
      </View>
      <View className="px-4 pt-4">
        <Text className="font-outfit-extrabold text-[22px] text-ink">Ship Cargo</Text>
        <Text className="pt-[2px] font-outfit text-[13px] text-muted">Fill in the details to book your shipment</Text>

        <View className="mt-5 gap-4 rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.07)] bg-[#EEF1EF] px-4 py-[18px]">
          <SectionLabel label="SENDER & RECEIVER" />
          <View className="gap-1">
            <Text className="font-outfit-semibold text-[12px] tracking-[0.48px] text-brand">SENDER NAME</Text>
            <TextField placeholder="e.g. Adebayo Okafor" value={senderName} onChangeText={setSenderName} />
          </View>
          <View className="gap-1">
            <Text className="font-outfit-semibold text-[12px] tracking-[0.48px] text-brand">PICKUP ADDRESS</Text>
            <TextField icon="map-pin" placeholder="Enter pickup location" value={pickupAddress} onChangeText={setPickupAddress} />
          </View>
          <View className="gap-1">
            <Text className="font-outfit-semibold text-[12px] tracking-[0.48px] text-brand">RECEIVER NAME</Text>
            <TextField placeholder="e.g. Chidi Nwosu" value={receiverName} onChangeText={setReceiverName} />
          </View>
          <View className="gap-1">
            <Text className="font-outfit-semibold text-[12px] tracking-[0.48px] text-brand">DELIVERY ADDRESS</Text>
            <TextField icon="map-pin" placeholder="Enter delivery location" value={deliveryAddress} onChangeText={setDeliveryAddress} />
          </View>
        </View>

        <View className="mt-[14px] gap-4 rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.07)] bg-surface px-4 py-[18px]">
          <View className="flex-row items-center gap-3 border-b-[0.661px] border-[rgba(27,67,50,0.1)] pb-3">
            <Feather name="box" size={22} color="#1B4332" />
            <Text className="font-outfit-bold text-[13px] tracking-[0.26px] text-brand">CARGO DETAILS</Text>
          </View>

          <View className="gap-1">
            <Text className="font-outfit-semibold text-[12px] tracking-[0.48px] text-brand">CARGO TYPE</Text>
            <Pressable
              onPress={() => setCargoTypeOpen(true)}
              className="flex-row items-center justify-between rounded-xl border-[1.322px] border-border-brand bg-white px-[14px] py-3"
            >
              <Text className="font-outfit text-[14px] text-ink">{cargoType}</Text>
              <Feather name="chevron-down" size={16} color="#6B7280" />
            </Pressable>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 gap-1">
              <Text className="font-outfit-semibold text-[12px] tracking-[0.48px] text-brand">WEIGHT (KG)</Text>
              <TextField placeholder="e.g. 12.5" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
            </View>
            <View className="flex-1 gap-1">
              <Text className="font-outfit-semibold text-[12px] tracking-[0.48px] text-brand">DIMENSIONS</Text>
              <TextField placeholder="e.g. 40x30x20" value={dimensions} onChangeText={setDimensions} />
            </View>
          </View>
        </View>

        {error ? <Text className="pt-4 text-center font-outfit-semibold text-[12.5px] text-[#DC2626]">{error}</Text> : null}

        <View className="py-5">
          <Button label="GET ESTIMATE" onPress={handleGetEstimate} />
        </View>
      </View>

      <Modal visible={cargoTypeOpen} transparent animationType="fade" onRequestClose={() => setCargoTypeOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setCargoTypeOpen(false)}>
          <Pressable className="rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-4">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>
            <Text className="pb-3 font-outfit-extrabold text-[16px] text-ink">Select Cargo Type</Text>
            {CARGO_TYPES.map((t) => (
              <Pressable
                key={t}
                onPress={() => {
                  setCargoType(t);
                  setCargoTypeOpen(false);
                }}
                className="flex-row items-center justify-between border-b-[0.661px] border-[rgba(27,67,50,0.07)] py-[14px]"
              >
                <Text className={`font-outfit-semibold text-[14px] ${t === cargoType ? "text-brand" : "text-ink"}`}>{t}</Text>
                {t === cargoType ? <Feather name="check" size={18} color="#1B4332" /> : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}
