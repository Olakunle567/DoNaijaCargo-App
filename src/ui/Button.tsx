import { Pressable, Text, View, ActivityIndicator } from "react-native";
import type { ReactNode } from "react";
import * as Haptics from "expo-haptics";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "white" | "dark";
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
};

const variantStyles = {
  primary: "bg-brand shadow-md",
  white: "bg-white border border-border",
  dark: "bg-apple",
};

const labelStyles = {
  primary: "text-white font-outfit-extrabold text-[15px] tracking-[1.05px]",
  white: "text-body font-outfit-semibold text-[14px]",
  dark: "text-white font-outfit-semibold text-[14px]",
};

export function Button({ label, onPress, variant = "primary", icon, loading, disabled }: ButtonProps) {
  const handlePress = () => {
    if (variant === "primary") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center gap-[10px] rounded-xl py-[13px] active:opacity-70 ${variantStyles[variant]} ${disabled ? "opacity-50" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" || variant === "dark" ? "#FFFFFF" : "#1B4332"} />
      ) : (
        <>
          {icon ? <View>{icon}</View> : null}
          <Text className={labelStyles[variant]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
