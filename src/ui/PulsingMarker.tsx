import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated";

export function PulsingMarker({ size = 12, color = "#1B4332", ringSize = 34 }: { size?: number; color?: string; ringSize?: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.ease) }), -1, false);
  }, [progress]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.3 + progress.value * 0.7 }],
    opacity: 1 - progress.value,
  }));

  return (
    <View style={{ width: ringSize, height: ringSize, alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={[
          { position: "absolute", width: ringSize, height: ringSize, borderRadius: ringSize / 2, backgroundColor: color },
          ringStyle,
        ]}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: "#fff",
        }}
      />
    </View>
  );
}
