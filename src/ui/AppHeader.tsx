import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LogoMark } from "./Logo";

export function AppHeader({ notificationCount = 3 }: { notificationCount?: number }) {
  return (
    <View className="h-[55px] w-full flex-row items-center justify-between px-5">
      <Pressable className="size-[34px] items-center justify-center rounded-xl bg-transparent" hitSlop={8}>
        <Feather name="menu" size={22} color="#1B4332" />
      </Pressable>

      <View className="flex-row items-center gap-2">
        <LogoMark width={32} height={34} />
        <View>
          <Text className="font-outfit-medium text-[10px] tracking-[0.4px] text-[#1e3a5f]">D.O NAIJA</Text>
          <Text className="font-outfit-extrabold text-[13px] tracking-[0.26px] text-brand">CARGO</Text>
        </View>
      </View>

      <Pressable className="size-[34px] items-center justify-center rounded-xl" hitSlop={8}>
        <Feather name="bell" size={22} color="#1B4332" />
        {notificationCount > 0 ? (
          <View className="absolute -right-1 -top-1 size-4 items-center justify-center rounded-full border-2 border-white bg-brand">
            <Text className="font-outfit-bold text-[9px] text-white">{notificationCount}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}
