import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ShipStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { Button } from "../../ui/Button";

type Props = NativeStackScreenProps<ShipStackParamList, "Confirmed">;

export function ConfirmedScreen({ navigation, route }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(route.params.trackingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 size-[100px] items-center justify-center rounded-full bg-[rgba(27,67,50,0.08)]">
          <View className="size-[72px] items-center justify-center rounded-full bg-brand">
            <Feather name="check" size={32} color="#fff" />
          </View>
        </View>

        <Text className="pb-2 text-center font-outfit-extrabold text-[24px] text-ink">Booking Confirmed!</Text>
        <Text className="pb-7 text-center font-outfit text-[13.5px] leading-[21.6px] text-muted">
          Your shipment has been booked successfully. A pickup agent will contact you within 24 hours.
        </Text>

        <View className="mb-7 items-center rounded-2xl border-[0.661px] border-border-brand bg-[#EEF1EF] px-5 py-3">
          <Text className="font-outfit-medium text-[11px] text-muted">TRACKING REFERENCE</Text>
          <View className="flex-row items-center gap-2 pt-[3px]">
            <Text className="font-outfit-extrabold text-[18px] tracking-[1.44px] text-brand">{route.params.trackingRef}</Text>
            <Pressable onPress={handleCopy} hitSlop={8} testID="copy-tracking-ref">
              <Feather name={copied ? "check" : "copy"} size={16} color="#1B4332" />
            </Pressable>
          </View>
          {copied ? <Text className="pt-1 font-outfit-semibold text-[10.5px] text-brand">Copied!</Text> : null}
        </View>

        <View className="w-full">
          <Button label="Back to Home" onPress={() => navigation.getParent()?.navigate("HomeTab")} />
        </View>
      </View>
    </ScreenContainer>
  );
}
