import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { AppHeader } from "../../ui/AppHeader";
import { MapIllustration } from "../../ui/MapIllustration";
import { PulsingMarker } from "../../ui/PulsingMarker";
import { advanceTracking } from "../../shipments/api";
import { useTrackedShipment, type TimelineStep } from "../../shipments/useTrackedShipment";

function formatMilestoneDetail(step: TimelineStep) {
  if (step.state === "pending") return "Pending";
  if (!step.timestamp) return step.location ?? "";
  const when = step.timestamp.toDate().toLocaleString("en-NG", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  return step.location ? `${when} · ${step.location}` : when;
}

function MilestoneBullet({ state }: { state: TimelineStep["state"] }) {
  if (state === "current") {
    return (
      <View className="size-5 items-center justify-center">
        <PulsingMarker size={12} ringSize={22} color="#1B4332" />
      </View>
    );
  }
  return (
    <View
      className={`size-5 items-center justify-center rounded-full border-[1.984px] ${
        state === "done" ? "border-brand bg-brand" : "border-[#D1D5DB] bg-white"
      }`}
    >
      {state === "done" ? <Feather name="check" size={10} color="#fff" /> : null}
    </View>
  );
}

export function TrackScreen() {
  const [queryInput, setQueryInput] = useState("");
  const [activeTrackingRef, setActiveTrackingRef] = useState<string | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const [advanceError, setAdvanceError] = useState("");
  const { shipment, timeline, loading, notFound } = useTrackedShipment(activeTrackingRef);
  const drift = useSharedValue(0);

  const handleTrack = () => {
    const query = queryInput.trim().toUpperCase();
    if (!query) return;
    setActiveTrackingRef(query);
  };

  const currentStep = timeline.find((s) => s.state === "current");
  const isDelivered = shipment?.status === "Delivered";

  const handleAdvance = async () => {
    if (!shipment) return;
    setAdvanceError("");
    setAdvancing(true);
    try {
      await advanceTracking({ trackingRef: shipment.trackingRef });
    } catch (err) {
      setAdvanceError(err instanceof Error ? err.message : "Couldn't advance tracking.");
    } finally {
      setAdvancing(false);
    }
  };

  useEffect(() => {
    drift.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [drift]);

  const truckStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drift.value }],
  }));

  return (
    <ScreenContainer scroll className="px-0">
      <View className="px-5">
        <AppHeader />
      </View>
      <View className="px-4 pt-4">
        <Text className="font-outfit-extrabold text-[22px] text-ink">Track Shipment</Text>
        <Text className="pt-[2px] font-outfit text-[13px] text-muted">Real-time cargo tracking</Text>

        <View className="mt-4 h-[150px] overflow-hidden rounded-2xl border-[0.661px] border-border-brand">
          <MapIllustration width={358} height={150} />

          <Animated.View style={[{ position: "absolute", left: 90, top: 55, alignItems: "center" }, truckStyle]}>
            <View className="flex-row items-center gap-1 rounded-[10px] bg-brand px-2 py-[5px] shadow">
              <Feather name="truck" size={14} color="#fff" />
              <Text className="font-outfit-bold text-[9px] text-white">{shipment?.status ?? "Tracking"}</Text>
            </View>
            <View className="mt-[2px]">
              <PulsingMarker size={9} ringSize={26} color="#1B4332" />
            </View>
          </Animated.View>

          <Text className="absolute bottom-3 left-3 font-outfit-semibold text-[9px] tracking-[0.45px] text-brand opacity-70">
            {shipment?.fromCity ?? "LAGOS, NG"}
          </Text>
          <Text className="absolute right-3 top-3 font-outfit-semibold text-[9px] tracking-[0.45px] text-[#1e3a5f] opacity-70">
            {shipment?.toCity ?? "ABUJA, NG"}
          </Text>
        </View>

        <View className="mt-4 flex-row items-center gap-2 rounded-2xl border-[1.984px] border-brand bg-[#EEF1EF] px-[14px] py-[10px]">
          <Feather name="map-pin" size={18} color="#1B4332" />
          <TextInput
            testID="track-id-input"
            className="flex-1 font-outfit-medium text-[13px] text-ink"
            placeholder="Enter tracking ID, e.g. DN-2024-08741"
            value={queryInput}
            onChangeText={setQueryInput}
            onSubmitEditing={handleTrack}
            autoCapitalize="characters"
            returnKeyType="search"
          />
          <Pressable onPress={handleTrack} disabled={loading} className="min-w-[64px] items-center rounded-[10px] bg-brand px-[14px] py-[7px]">
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text className="font-outfit-extrabold text-[12px] tracking-[0.72px] text-white">TRACK</Text>}
          </Pressable>
        </View>
        {notFound ? (
          <Text className="pt-2 font-outfit-semibold text-[12px] text-[#DC2626]">No shipment found for that tracking ID.</Text>
        ) : null}

        {!activeTrackingRef ? (
          <View className="mt-4 items-center rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.08)] bg-surface p-8">
            <Feather name="search" size={28} color="#8A9A92" />
            <Text className="pt-3 text-center font-outfit text-[13px] text-muted">
              Enter a tracking ID above to see live status and milestones.
            </Text>
          </View>
        ) : null}

        {shipment ? (
          <>
            <View className="mt-4 gap-1 rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.08)] bg-surface p-[18px]">
              <View className="flex-row items-start justify-between">
                <View>
                  <Text className="font-outfit-semibold text-[11px] tracking-[0.55px] text-muted">TRACKING ID · {shipment.trackingRef}</Text>
                  <Text className="pt-1 font-outfit-extrabold text-[18px] text-ink">Status:</Text>
                  <Text className="font-outfit-extrabold text-[18px] text-brand">{shipment.status}</Text>
                  <View className="mt-2 flex-row items-center gap-[6px] self-start rounded-full bg-[rgba(27,67,50,0.09)] px-3 py-[5px]">
                    <View className="size-[7px] rounded-full bg-brand" />
                    <Text className="font-outfit-bold text-[12px] text-brand">
                      {currentStep ? currentStep.label : shipment.status}
                    </Text>
                  </View>
                </View>
                <Feather name="map-pin" size={44} color="#1B4332" style={{ opacity: 0.85 }} />
              </View>

              <View className="mt-3 flex-row gap-6 border-t-[0.661px] border-[rgba(27,67,50,0.1)] pt-3">
                <View>
                  <Text className="font-outfit-medium text-[10px] text-muted">FROM</Text>
                  <Text className="pt-[2px] font-outfit-bold text-[13px] text-ink" numberOfLines={1}>{shipment.fromCity}</Text>
                </View>
                <Text className="font-outfit text-[16px] text-brand">→</Text>
                <View>
                  <Text className="font-outfit-medium text-[10px] text-muted">TO</Text>
                  <Text className="pt-[2px] font-outfit-bold text-[13px] text-ink" numberOfLines={1}>{shipment.toCity}</Text>
                </View>
                <View className="flex-1 items-end">
                  <Text className="font-outfit-medium text-[10px] text-muted">WEIGHT</Text>
                  <Text className="pt-[2px] font-outfit-bold text-[13px] text-ink">{shipment.cargo.weightKg} kg</Text>
                </View>
              </View>
            </View>

            <View className="mt-[14px] rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.08)] bg-white p-[18px]">
              <Text className="font-outfit-bold text-[13px] tracking-[0.39px] text-brand">SHIPMENT MILESTONES</Text>
              <View className="mt-4 gap-5">
                {timeline.map((step) => (
                  <View key={step.label} className="flex-row items-start gap-4">
                    <MilestoneBullet state={step.state} />
                    <View className="flex-1 pt-px">
                      <Text className={`font-outfit-bold text-[13px] ${step.state === "pending" ? "text-[#9CA3AF]" : "text-ink"}`}>
                        {step.label}
                      </Text>
                      <Text className="pt-[2px] font-outfit text-[11px] text-muted">{formatMilestoneDetail(step)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {__DEV__ ? (
              <View className="mt-[14px] rounded-2xl border-[1.322px] border-dashed border-[#D1D5DB] bg-[#FAFAF9] p-4">
                <Text className="pb-2 font-outfit-bold text-[11px] tracking-[0.44px] text-muted">
                  DEV ONLY · simulates the next tracking webhook event
                </Text>
                <Pressable
                  onPress={handleAdvance}
                  disabled={advancing || isDelivered}
                  className={`flex-row items-center justify-center gap-2 rounded-xl py-[10px] ${isDelivered ? "bg-border" : "bg-ink"}`}
                  testID="dev-advance-tracking"
                >
                  {advancing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="font-outfit-bold text-[12.5px] text-white">
                      {isDelivered ? "Delivered — nothing left to advance" : "Advance to next milestone"}
                    </Text>
                  )}
                </Pressable>
                {advanceError ? <Text className="pt-2 font-outfit-semibold text-[11.5px] text-[#DC2626]">{advanceError}</Text> : null}
              </View>
            ) : null}
          </>
        ) : null}
      </View>
    </ScreenContainer>
  );
}
