import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { GoogleIcon } from "../../ui/brand-icons/GoogleIcon";

const DEMO_ACCOUNT = { name: "Adebayo Okafor", email: "adebayo.okafor@gmail.com" };

export function GoogleAuthSheet({ visible, onClose, onSuccess }: { visible: boolean; onClose: () => void; onSuccess: () => void }) {
  const [signingIn, setSigningIn] = useState(false);

  const close = () => {
    if (signingIn) return;
    setSigningIn(false);
    onClose();
  };

  const chooseAccount = () => {
    setSigningIn(true);
    setTimeout(() => {
      setSigningIn(false);
      onSuccess();
    }, 1100);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable className="flex-1 justify-end bg-black/50" onPress={close}>
        <Pressable className="overflow-hidden rounded-t-3xl bg-white" onPress={(e) => e.stopPropagation()}>
          <View className="flex-row items-center gap-3 border-b-[0.661px] border-[#e8eaed] px-5 py-4">
            <GoogleIcon size={20} />
            <View className="flex-1">
              <Text className="font-outfit-semibold text-[14px] text-[#202124]">Sign in with Google</Text>
              <Text className="font-outfit text-[11px] text-[#5f6368]">to continue to D.O Naija Cargo</Text>
            </View>
          </View>

          <View className="gap-3 px-5 pb-8 pt-4">
            <Text className="font-outfit text-[12px] text-[#5f6368]">Choose an account</Text>

            <Pressable
              onPress={chooseAccount}
              disabled={signingIn}
              className="flex-row items-center gap-3 rounded-xl border-[1.322px] border-[#e8eaed] px-3 py-[10px]"
            >
              <View className="size-10 items-center justify-center rounded-full bg-[#4285F4]">
                <Text className="font-outfit-bold text-[16px] text-white">A</Text>
              </View>
              <View className="flex-1">
                <Text className="font-outfit-semibold text-[13px] text-[#202124]">{DEMO_ACCOUNT.name}</Text>
                <Text className="font-outfit text-[11.5px] text-[#5f6368]">{DEMO_ACCOUNT.email}</Text>
              </View>
              {signingIn ? <ActivityIndicator size="small" color="#4285F4" /> : <Feather name="chevron-right" size={16} color="#5f6368" />}
            </Pressable>

            <Pressable
              onPress={chooseAccount}
              disabled={signingIn}
              className="flex-row items-center gap-3 rounded-xl border-[1.322px] border-[#e8eaed] px-3 py-[10px]"
            >
              <View className="size-10 items-center justify-center rounded-full bg-[#e8eaed]">
                <Feather name="plus" size={18} color="#5f6368" />
              </View>
              <Text className="font-outfit-medium text-[13px] text-[#202124]">Use another account</Text>
            </Pressable>

            <Text className="pt-2 text-center font-outfit text-[10.5px] leading-[16.8px] text-[#70757a]">
              To continue, Google will share your name, email address, and profile picture with D.O Naija Cargo.
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
