import Svg, { Path } from "react-native-svg";
import { View } from "react-native";

export function MapIllustration({ width, height }: { width: number; height: number }) {
  return (
    <View style={{ width, height, overflow: "hidden" }}>
      <Svg width={width} height={height} viewBox="0 0 356.69 148.673" fill="none" preserveAspectRatio="none">
        <Path d="M356.69 0H0V148.673H356.69V0Z" fill="#C8DCCF" />
        <Path opacity={0.7} d="M58 0H2C0.89543 0 0 0.89543 0 2V48C0 49.1046 0.89543 50 2 50H58C59.1046 50 60 49.1046 60 48V2C60 0.89543 59.1046 0 58 0Z" fill="#B8CFB5" />
        <Path opacity={0.7} d="M158 0H82C80.8954 0 80 0.89543 80 2V38C80 39.1046 80.8954 40 82 40H158C159.105 40 160 39.1046 160 38V2C160 0.89543 159.105 0 158 0Z" fill="#B8CFB5" />
        <Path opacity={0.7} d="M238 0H182C180.895 0 180 0.89543 180 2V53C180 54.1046 180.895 55 182 55H238C239.105 55 240 54.1046 240 53V2C240 0.89543 239.105 0 238 0Z" fill="#B8CFB5" />
        <Path opacity={0.5} d="M48 70H2C0.89543 70 0 70.8954 0 72V148C0 149.105 0.89543 150 2 150H48C49.1046 150 50 149.105 50 148V72C50 70.8954 49.1046 70 48 70Z" fill="#B8CFB5" />
        <Path opacity={0.5} d="M158 55H72C70.8954 55 70 55.8954 70 57V148C70 149.105 70.8954 150 72 150H158C159.105 150 160 149.105 160 148V57C160 55.8954 159.105 55 158 55Z" fill="#B8CFB5" />
        <Path opacity={0.5} d="M248 70H182C180.895 70 180 70.8954 180 72V148C180 149.105 180.895 150 182 150H248C249.105 150 250 149.105 250 148V72C250 70.8954 249.105 70 248 70Z" fill="#B8CFB5" />
        <Path opacity={0.9} d="M356.69 52H0V67H356.69V52Z" fill="#E8F0EB" />
        <Path opacity={0.9} d="M356.69 115H0V127H356.69V115Z" fill="#E8F0EB" />
        <Path opacity={0.9} d="M78 0H62V150H78V0Z" fill="#E8F0EB" />
        <Path opacity={0.9} d="M177 0H163V150H177V0Z" fill="#E8F0EB" />
        <Path opacity={0.9} d="M30 130V60H80H160V25H260" stroke="#1B4332" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path opacity={0.5} d="M260 25H340" stroke="#1B4332" strokeWidth={3.5} strokeLinecap="round" strokeDasharray="6 4" />
        <Path d="M30 136C33.3137 136 36 133.314 36 130C36 126.686 33.3137 124 30 124C26.6863 124 24 126.686 24 130C24 133.314 26.6863 136 30 136Z" fill="white" stroke="#1B4332" strokeWidth={2.5} />
        <Path d="M30 133C31.6569 133 33 131.657 33 130C33 128.343 31.6569 127 30 127C28.3431 127 27 128.343 27 130C27 131.657 28.3431 133 30 133Z" fill="#1B4332" />
        <Path opacity={0.85} d="M330 32C333.866 32 337 28.866 337 25C337 21.134 333.866 18 330 18C326.134 18 323 21.134 323 25C323 28.866 326.134 32 330 32Z" fill="#1E3A5F" />
        <Path d="M330 28C331.657 28 333 26.6569 333 25C333 23.3431 331.657 22 330 22C328.343 22 327 23.3431 327 25C327 26.6569 328.343 28 330 28Z" fill="white" />
      </Svg>
    </View>
  );
}
