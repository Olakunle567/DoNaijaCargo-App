import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RidingStackParamList } from "../../navigation/types";
import { AppHeader } from "../../ui/AppHeader";
import { MapIllustration } from "../../ui/MapIllustration";
import { Button } from "../../ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RidingStackParamList, "RideActive">;

export function RideActiveScreen({ navigation }: Props) {
  const [sheet, setSheet] = useState<"none" | "contact" | "cancel">("none");
  const [message, setMessage] = useState("");

  return (
    <View className="flex-1 bg-[#C8DCC5]">
      <View className="absolute inset-0 h-[420px]">
        <MapIllustration width={393} height={420} />
      </View>
      <SafeAreaView edges={["top"]}>
        <AppHeader />
      </SafeAreaView>

      <View className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white px-[18px] pb-6 pt-5 shadow-lg">
        <View className="items-center">
          <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
        </View>

        <View className="mt-4 flex-row items-center gap-2">
          <View className="size-2 rounded-full bg-brand" />
          <Text className="font-outfit-bold text-[14px] text-ink">Rider is on the way!</Text>
          <Text className="ml-auto font-outfit-semibold text-[13px] text-brand">~4 min away</Text>
        </View>

        <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-surface p-3">
          <View className="size-[52px] items-center justify-center rounded-full bg-white">
            <Text className="text-[28px]">🧑🏾</Text>
          </View>
          <View className="flex-1">
            <Text className="font-outfit-bold text-[16px] text-ink">Emeka Obi</Text>
            <View className="flex-row items-center gap-1">
              <Feather name="star" size={12} color="#F59E0B" />
              <Text className="font-outfit-semibold text-[11px] text-body">4.8</Text>
              <Text className="font-outfit text-[11px] text-muted">· 202 trips completed</Text>
            </View>
          </View>
          <View className="rounded-full bg-[rgba(27,67,50,0.1)] px-[10px] py-1">
            <Text className="font-outfit-bold text-[10px] tracking-[0.3px] text-brand">ONLINE</Text>
          </View>
        </View>

        <View className="mt-3 flex-row justify-between rounded-2xl border-[0.661px] border-border-brand px-4 py-3">
          <View>
            <Text className="font-outfit text-[11px] text-muted">Vehicle</Text>
            <Text className="pt-1 font-outfit-bold text-[13px] text-ink">Green Bajaj</Text>
          </View>
          <View>
            <Text className="font-outfit text-[11px] text-muted">Plate</Text>
            <Text className="pt-1 font-outfit-bold text-[13px] text-ink">LND 482 JK</Text>
          </View>
          <View className="items-end">
            <Text className="font-outfit text-[11px] text-muted">ETA</Text>
            <Text className="pt-1 font-outfit-bold text-[13px] text-brand">~4 min</Text>
          </View>
        </View>

        <View className="mt-4 flex-row gap-3">
          <Pressable
            onPress={() => setSheet("contact")}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border-[1.322px] border-border-brand bg-surface py-[13px]"
          >
            <Feather name="phone" size={16} color="#1B4332" />
            <Text className="font-outfit-bold text-[13px] text-brand">Contact</Text>
          </Pressable>
          <Pressable
            onPress={() => setSheet("cancel")}
            className="flex-1 items-center justify-center rounded-2xl border-[1.322px] border-[#DC2626]/30 bg-white py-[13px]"
          >
            <Text className="font-outfit-bold text-[13px] text-[#DC2626]">Cancel Ride</Text>
          </Pressable>
        </View>
      </View>

      <Modal visible={sheet !== "none"} transparent animationType="fade" onRequestClose={() => setSheet("none")}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setSheet("none")}>
          <Pressable className="rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-4">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>

            {sheet === "contact" ? (
              <>
                <View className="flex-row items-center gap-3 pb-4">
                  <View className="size-12 items-center justify-center rounded-full bg-surface">
                    <Text className="text-[24px]">🧑🏾</Text>
                  </View>
                  <View>
                    <Text className="font-outfit-bold text-[16px] text-ink">Emeka Obi</Text>
                    <Text className="font-outfit text-[12px] text-muted">~4 min away · LND 482 JK</Text>
                  </View>
                </View>
                <View className="flex-row gap-3 pb-4">
                  <View className="flex-1 items-center gap-1 rounded-2xl border-[1.322px] border-border-brand bg-surface py-3">
                    <Feather name="phone" size={16} color="#1B4332" />
                    <Text className="font-outfit-bold text-[13px] text-brand">Call Rider</Text>
                  </View>
                  <View className="flex-1 items-center gap-1 rounded-2xl border-[1.322px] border-border-brand bg-surface py-3">
                    <Feather name="message-circle" size={16} color="#1B4332" />
                    <Text className="font-outfit-bold text-[13px] text-brand">WhatsApp</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2 rounded-2xl border-[1.322px] border-border-brand bg-surface px-4 py-2">
                  <TextInput
                    className="flex-1 font-outfit text-[13px] text-ink"
                    placeholder="Send a quick message to your rider…"
                    placeholderTextColor="#99A1AF"
                    value={message}
                    onChangeText={setMessage}
                  />
                  <Pressable className="rounded-lg bg-brand px-4 py-2">
                    <Text className="font-outfit-bold text-[12px] text-white">Send</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text className="pb-2 text-center text-[36px]">⚠️</Text>
                <Text className="pb-2 text-center font-outfit-extrabold text-[18px] text-ink">Cancel this ride?</Text>
                <Text className="pb-5 text-center font-outfit text-[13px] leading-[19px] text-muted">
                  Emeka is already on the way. A ₦500 cancellation fee may apply.
                </Text>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setSheet("none")}
                    className="flex-1 items-center rounded-2xl border-[1.322px] border-border-brand bg-surface py-[13px]"
                  >
                    <Text className="font-outfit-bold text-[14px] text-ink">Keep Ride</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setSheet("none");
                      navigation.goBack();
                    }}
                    className="flex-1 items-center rounded-2xl bg-[#DC2626] py-[13px]"
                  >
                    <Text className="font-outfit-bold text-[14px] text-white">Yes, Cancel</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
