import { Text, View } from "react-native";

export function SectionLabel({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-2 border-b-[0.661px] border-[rgba(27,67,50,0.1)] pb-3">
      <View className="size-[6px] rounded-full bg-brand" />
      <Text className="font-outfit-bold text-[13px] tracking-[0.26px] text-brand">{label}</Text>
    </View>
  );
}
