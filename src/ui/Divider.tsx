import { Text, View } from "react-native";

export function Divider({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-[1px] flex-1 bg-border" />
      <Text className="text-footnote font-outfit text-muted">{label}</Text>
      <View className="h-[1px] flex-1 bg-border" />
    </View>
  );
}
