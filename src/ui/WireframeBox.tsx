import Svg, { Path } from "react-native-svg";

export function WireframeBox({ size = 100 }: { size?: number }) {
  const height = size * (119.992 / 129.993);
  return (
    <Svg width={size} height={height} viewBox="0 0 129.993 119.992" fill="none" opacity={0.18}>
      <Path d="M64.9965 9.99933L109.994 31.9979V75.9949L64.9965 97.9935L19.9995 75.9949V31.9979L64.9965 9.99933Z" stroke="white" strokeWidth={1.4999} />
      <Path d="M64.9965 9.99933V97.9935" stroke="white" strokeWidth={0.999933} strokeDasharray="4 3" />
      <Path d="M19.9995 31.9979L64.9965 53.9964L109.994 31.9979" stroke="white" strokeWidth={1.4999} />
      <Path d="M64.9965 53.9964V97.9935" stroke="white" strokeWidth={0.999933} />
      <Path d="M19.9995 53.9964L64.9965 75.9949L109.994 53.9964" stroke="white" strokeWidth={0.999933} strokeDasharray="4 3" />
      <Path d="M41.998 20.9986V64.9957" stroke="white" strokeWidth={0.799947} strokeDasharray="3 3" />
      <Path d="M87.995 20.9986V64.9957" stroke="white" strokeWidth={0.799947} strokeDasharray="3 3" />
    </Svg>
  );
}
