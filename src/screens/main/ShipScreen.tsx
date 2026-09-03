import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ShipStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { AppHeader } from "../../ui/AppHeader";
import { TextField } from "../../ui/TextField";
import { SectionLabel } from "../../ui/SectionLabel";
import { Button } from "../../ui/Button";

type Props = NativeStackScreenProps<ShipStackParamList, "Ship">;

export function ShipScreen({ navigation }: Props) {
  const [senderName, setSenderName] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");

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
            <Pressable className="flex-row items-center justify-between rounded-xl border-[1.322px] border-border-brand bg-white px-[14px] py-3">
              <Text className="font-outfit text-[14px] text-ink">General Goods</Text>
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

        <View className="py-5">
          <Button label="GET ESTIMATE" onPress={() => navigation.navigate("GetEstimate")} />
        </View>
      </View>
    </ScreenContainer>
  );
}
