import { useState } from "react";
import { Pressable, TextInput, View, type KeyboardTypeOptions } from "react-native";
import { Feather } from "@expo/vector-icons";

type TextFieldProps = {
  icon?: keyof typeof Feather.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export function TextField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
}: TextFieldProps) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View className="flex-row items-center gap-3 rounded-xl border-[1.322px] border-border-brand bg-surface px-[15px] py-[13px]">
      {icon ? <Feather name={icon} size={18} color="#374151" /> : null}
      <TextInput
        className="flex-1 text-body font-outfit text-ink"
        placeholder={placeholder}
        placeholderTextColor="#99A1AF"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={hidden}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {secureTextEntry ? (
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={13}>
          <Feather name={hidden ? "eye-off" : "eye"} size={18} color="#374151" />
        </Pressable>
      ) : null}
    </View>
  );
}
