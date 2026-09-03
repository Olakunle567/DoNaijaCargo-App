import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export function BackHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onBack}
          className="size-[38px] items-center justify-center rounded-xl border-[0.661px] border-border-brand bg-[#EEF1EF]"
          hitSlop={6}
          testID="back-header-button"
        >
          <Feather name="arrow-left" size={19} color="#1B4332" />
        </Pressable>
        <View>
          <Text className="font-outfit-extrabold text-[20px] text-ink">{title}</Text>
          {subtitle ? <Text className="font-outfit text-[12px] text-muted">{subtitle}</Text> : null}
        </View>
      </View>
      {right}
    </View>
  );
}
