import { useEffect } from "react";
import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/types";
import { LogoFull } from "../../ui/Logo";

type Props = NativeStackScreenProps<AuthStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace("SignIn"), 1800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-between bg-[#F2F5F3] py-9">
      <View className="flex-1 items-center justify-center">
        <LogoFull />
      </View>
      <View className="items-center gap-[10px]">
        <View className="flex-row items-center gap-2">
          <Text className="font-outfit-bold text-[13px] tracking-[0.52px] text-body">Fast.</Text>
          <Text className="font-outfit-bold text-[13px] tracking-[0.52px] text-body">Secure.</Text>
          <Text className="font-outfit text-[13px] tracking-[0.13px] text-[#6B7280]">Reliable Logistics.</Text>
        </View>
        <View className="h-[3px] w-9 overflow-hidden rounded-full bg-[#E5EAE7]">
          <View className="h-[3px] w-[35px] rounded-full bg-brand" />
        </View>
        <Text className="font-outfit text-[11px] text-[#A8B5AC]">© 2024 D.O Naija Cargo.</Text>
      </View>
    </View>
  );
}
