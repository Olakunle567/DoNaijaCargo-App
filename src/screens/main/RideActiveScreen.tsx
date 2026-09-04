import { useEffect, useState } from "react";
import { ActivityIndicator, Linking, Modal, Pressable, Text, TextInput, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RidingStackParamList } from "../../navigation/types";
import { AppHeader } from "../../ui/AppHeader";
import { MapIllustration } from "../../ui/MapIllustration";
import { PulsingMarker } from "../../ui/PulsingMarker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChat } from "../../chat/ChatContext";
import { useRide } from "../../rides/useRide";
import { useSettings } from "../../settings/SettingsContext";
import { formatCurrency } from "../../lib/currency";

type Props = NativeStackScreenProps<RidingStackParamList, "RideActive">;

export function RideActiveScreen({ navigation, route }: Props) {
  const { currency } = useSettings();
  const [sheet, setSheet] = useState<"none" | "contact" | "cancel">("none");
  const [message, setMessage] = useState("");
  const { unreadCount, sendMessage } = useChat();
  const { ride, etaRemaining, cancelling, error, cancel } = useRide(route.params.rideId);
  const rider = ride?.rider ?? null;
  const matched = ride?.status === "matched" && rider !== null;

  const handleQuickSend = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
    setSheet("none");
    navigation.navigate("Chat", { rider: rider! });
  };

  const handleConfirmCancel = async () => {
    try {
      await cancel();
      setSheet("none");
      navigation.goBack();
    } catch {
      // error is surfaced via `error` below; keep the sheet open so it's visible.
    }
  };

  const leftPct = useSharedValue(78);
  const topPct = useSharedValue(10);

  useEffect(() => {
    const easing = Easing.inOut(Easing.quad);
    leftPct.value = withRepeat(
      withSequence(withTiming(40, { duration: 2200, easing }), withTiming(20, { duration: 2200, easing })),
      -1,
      true
    );
    topPct.value = withRepeat(
      withSequence(withTiming(22, { duration: 2200, easing }), withTiming(34, { duration: 2200, easing })),
      -1,
      true
    );
  }, [leftPct, topPct]);

  const riderStyle = useAnimatedStyle(() => ({
    left: `${leftPct.value}%`,
    top: `${topPct.value}%`,
  }));

  return (
    <View className="flex-1 bg-[#C8DCC5]">
      <View className="absolute inset-0 h-[420px]">
        <MapIllustration width={393} height={420} />
      </View>

      <Animated.View style={[{ position: "absolute" }, riderStyle]}>
        <View className="size-8 items-center justify-center rounded-full bg-white shadow">
          <MaterialCommunityIcons name="moped" size={18} color="#1B4332" />
        </View>
      </Animated.View>

      <View className="absolute" style={{ left: "20%", top: "34%" }}>
        <PulsingMarker size={10} ringSize={30} color="#1B4332" />
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
          <Text className="font-outfit-bold text-[14px] text-ink">
            {matched ? "Rider is on the way!" : "Finding your rider…"}
          </Text>
          {matched ? <Text className="ml-auto font-outfit-semibold text-[13px] text-brand">~{etaRemaining} min away</Text> : null}
        </View>

        {matched && rider ? (
          <>
            <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-surface p-3">
              <View className="size-[52px] items-center justify-center rounded-full bg-white">
                <Text className="text-[28px]">🧑🏾</Text>
              </View>
              <View className="flex-1">
                <Text className="font-outfit-bold text-[16px] text-ink">{rider.name}</Text>
                <View className="flex-row items-center gap-1">
                  <Feather name="star" size={12} color="#F59E0B" />
                  <Text className="font-outfit-semibold text-[11px] text-body">{rider.rating}</Text>
                  <Text className="font-outfit text-[11px] text-muted">· {rider.trips} trips completed</Text>
                </View>
              </View>
              <View className="rounded-full bg-[rgba(27,67,50,0.1)] px-[10px] py-1">
                <Text className="font-outfit-bold text-[10px] tracking-[0.3px] text-brand">ONLINE</Text>
              </View>
            </View>

            <View className="mt-3 flex-row justify-between rounded-2xl border-[0.661px] border-border-brand px-4 py-3">
              <View>
                <Text className="font-outfit text-[11px] text-muted">Vehicle</Text>
                <Text className="pt-1 font-outfit-bold text-[13px] text-ink">{rider.vehicle}</Text>
              </View>
              <View>
                <Text className="font-outfit text-[11px] text-muted">Plate</Text>
                <Text className="pt-1 font-outfit-bold text-[13px] text-ink">{rider.plate}</Text>
              </View>
              <View className="items-end">
                <Text className="font-outfit text-[11px] text-muted">ETA</Text>
                <Text className="pt-1 font-outfit-bold text-[13px] text-brand">~{etaRemaining} min</Text>
              </View>
            </View>
          </>
        ) : (
          <View className="mt-4 flex-row items-center gap-3 rounded-2xl bg-surface p-3">
            <ActivityIndicator color="#1B4332" />
            <View className="flex-1">
              <Text className="font-outfit-bold text-[14px] text-ink">Matching you with a nearby rider…</Text>
              <Text className="font-outfit text-[11px] text-muted">This usually takes a few seconds</Text>
            </View>
          </View>
        )}

        {error ? <Text className="pt-3 font-outfit-semibold text-[12px] text-[#DC2626]">{error}</Text> : null}

        <View className="mt-4 flex-row gap-3">
          {matched ? (
            <Pressable
              onPress={() => setSheet("contact")}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border-[1.322px] border-border-brand bg-surface py-[13px]"
            >
              <View>
                <Feather name="phone" size={16} color="#1B4332" />
                {unreadCount > 0 ? (
                  <View className="absolute -right-2 -top-2 size-4 items-center justify-center rounded-full bg-[#DC2626]">
                    <Text className="font-outfit-bold text-[9px] text-white">{unreadCount}</Text>
                  </View>
                ) : null}
              </View>
              <Text className="font-outfit-bold text-[13px] text-brand">Contact</Text>
            </Pressable>
          ) : null}
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

            {sheet === "contact" && rider ? (
              <>
                <View className="flex-row items-center gap-3 pb-4">
                  <View className="size-12 items-center justify-center rounded-full bg-surface">
                    <Text className="text-[24px]">🧑🏾</Text>
                  </View>
                  <View>
                    <Text className="font-outfit-bold text-[16px] text-ink">{rider.name}</Text>
                    <Text className="font-outfit text-[12px] text-muted">~{etaRemaining} min away · {rider.plate}</Text>
                  </View>
                </View>
                <View className="flex-row gap-3 pb-4">
                  <Pressable
                    onPress={() => rider && Linking.openURL(`tel:${rider.phone}`)}
                    className="flex-1 items-center gap-1 rounded-2xl border-[1.322px] border-border-brand bg-surface py-3"
                  >
                    <Feather name="phone" size={16} color="#1B4332" />
                    <Text className="font-outfit-bold text-[13px] text-brand">Call Rider</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => rider && Linking.openURL(`https://wa.me/${rider.phone.replace("+", "")}`)}
                    className="flex-1 items-center gap-1 rounded-2xl border-[1.322px] border-border-brand bg-surface py-3"
                  >
                    <Feather name="message-circle" size={16} color="#1B4332" />
                    <Text className="font-outfit-bold text-[13px] text-brand">WhatsApp</Text>
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => {
                    setSheet("none");
                    navigation.navigate("Chat", { rider: rider! });
                  }}
                  className="mb-3 flex-row items-center justify-center gap-2 rounded-2xl bg-[#EEF1EF] py-3"
                >
                  <Feather name="message-square" size={16} color="#1B4332" />
                  <Text className="font-outfit-bold text-[13px] text-brand">Open Chat</Text>
                  {unreadCount > 0 ? (
                    <View className="ml-1 rounded-full bg-brand px-[7px] py-[1px]">
                      <Text className="font-outfit-bold text-[10px] text-white">{unreadCount} new</Text>
                    </View>
                  ) : null}
                </Pressable>
                <View className="flex-row items-center gap-2 rounded-2xl border-[1.322px] border-border-brand bg-surface px-4 py-2">
                  <TextInput
                    className="flex-1 font-outfit text-[13px] text-ink"
                    placeholder="Send a quick message to your rider…"
                    placeholderTextColor="#99A1AF"
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={handleQuickSend}
                    returnKeyType="send"
                  />
                  <Pressable onPress={handleQuickSend} className="rounded-lg bg-brand px-4 py-2">
                    <Text className="font-outfit-bold text-[12px] text-white">Send</Text>
                  </Pressable>
                </View>
              </>
            ) : null}

            {sheet === "cancel" ? (
              <>
                <Text className="pb-2 text-center text-[36px]">⚠️</Text>
                <Text className="pb-2 text-center font-outfit-extrabold text-[18px] text-ink">Cancel this ride?</Text>
                <Text className="pb-5 text-center font-outfit text-[13px] leading-[19px] text-muted">
                  {matched && rider ? `${rider.name} is already on the way. ` : ""}A {formatCurrency(500, currency)} cancellation fee may apply.
                </Text>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setSheet("none")}
                    disabled={cancelling}
                    className="flex-1 items-center rounded-2xl border-[1.322px] border-border-brand bg-surface py-[13px]"
                  >
                    <Text className="font-outfit-bold text-[14px] text-ink">Keep Ride</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleConfirmCancel}
                    disabled={cancelling}
                    className="flex-1 items-center justify-center rounded-2xl bg-[#DC2626] py-[13px]"
                  >
                    {cancelling ? <ActivityIndicator size="small" color="#fff" /> : <Text className="font-outfit-bold text-[14px] text-white">Yes, Cancel</Text>}
                  </Pressable>
                </View>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
