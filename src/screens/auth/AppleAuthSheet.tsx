import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppleIcon } from "../../ui/brand-icons/AppleIcon";

const DEMO_APPLE_ID = "adebayo.o@icloud.com";

export function AppleAuthSheet({ visible, onClose, onSuccess }: { visible: boolean; onClose: () => void; onSuccess: () => void }) {
  const [stage, setStage] = useState<"confirm" | "scanning" | "success">("confirm");

  useEffect(() => {
    if (visible) setStage("confirm");
  }, [visible]);

  const close = () => {
    if (stage === "scanning") return;
    onClose();
  };

  const startFaceId = () => {
    setStage("scanning");
    setTimeout(() => {
      setStage("success");
      setTimeout(onSuccess, 500);
    }, 1200);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable className="flex-1 justify-end bg-black/60" onPress={close}>
        <Pressable className="items-center overflow-hidden rounded-t-3xl bg-[#1c1c1e] px-6 pb-10 pt-7" onPress={(e) => e.stopPropagation()}>
          <View className="mb-4 size-12 items-center justify-center rounded-full bg-white/10">
            <AppleIcon size={24} color="#fff" />
          </View>

          {stage === "confirm" ? (
            <>
              <Text className="pb-1 font-outfit-bold text-[17px] text-white">Sign in with Apple ID</Text>
              <Text className="pb-6 font-outfit text-[13px] text-white/60">{DEMO_APPLE_ID}</Text>
              <Pressable onPress={startFaceId} className="w-full items-center rounded-2xl bg-white py-[13px]">
                <Text className="font-outfit-bold text-[15px] text-[#1c1c1e]">Continue</Text>
              </Pressable>
              <Text className="pt-4 text-center font-outfit text-[11px] leading-[16.5px] text-white/40">
                Your name and email will be shared with D.O Naija Cargo.
              </Text>
            </>
          ) : null}

          {stage === "scanning" ? (
            <>
              <ActivityIndicator size="large" color="#fff" style={{ marginBottom: 16 }} />
              <Text className="font-outfit-semibold text-[15px] text-white">Verifying Face ID…</Text>
            </>
          ) : null}

          {stage === "success" ? (
            <>
              <View className="mb-2 size-14 items-center justify-center rounded-full bg-[#22C55E]/20">
                <Feather name="check" size={26} color="#22C55E" />
              </View>
              <Text className="font-outfit-semibold text-[15px] text-white">Done</Text>
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
