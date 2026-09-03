import { Image, View } from "react-native";

const logoFull = require("../../assets/images/logo-full.png");

export function LogoFull({ width = 357, height = 164 }: { width?: number; height?: number }) {
  return (
    <Image
      source={logoFull}
      style={{ width, height }}
      resizeMode="cover"
    />
  );
}

export function LogoMark({ width = 97, height = 105 }: { width?: number; height?: number }) {
  const innerWidth = width * 2.3487;
  const innerHeight = height * 1.0884;
  const top = -(height * 0.0442);
  return (
    <View style={{ width, height, overflow: "hidden" }}>
      <Image
        source={logoFull}
        style={{ width: innerWidth, height: innerHeight, top, left: 0 }}
        resizeMode="cover"
      />
    </View>
  );
}
