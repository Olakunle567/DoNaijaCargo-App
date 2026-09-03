import { useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";

export function BobbingPin({ delay = 0 }: { delay?: number }) {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 900, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, [offset, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Animated.View
      style={[
        { width: 34, height: 30, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
        { shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
        style,
      ]}
    >
      <MaterialCommunityIcons name="moped" size={20} color="#1B4332" />
    </Animated.View>
  );
}
