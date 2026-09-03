import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/types";
import { useAuth } from "../../auth/AuthContext";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { LogoMark } from "../../ui/Logo";
import { TextField } from "../../ui/TextField";
import { Button } from "../../ui/Button";
import { Divider } from "../../ui/Divider";
import { GoogleIcon } from "../../ui/brand-icons/GoogleIcon";
import { AppleIcon } from "../../ui/brand-icons/AppleIcon";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

export function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signIn();
    }, 900);
  };

  return (
    <ScreenContainer scroll>
      <View className="items-center pb-3">
        <LogoMark />
      </View>

      <View className="pt-2">
        <Text className="font-outfit-extrabold text-[28px] text-ink">Welcome Back!</Text>
        <Text className="pt-2 font-outfit text-[13.5px] text-muted">
          Sign in to manage your shipments and dispatch rides.
        </Text>
      </View>

      <View className="gap-4 pt-7">
        <View className="gap-[7px]">
          <Text className="font-outfit-bold text-[12px] tracking-[0.48px] text-body">EMAIL ADDRESS</Text>
          <TextField icon="mail" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>

        <View className="gap-[7px]">
          <Text className="font-outfit-bold text-[12px] tracking-[0.48px] text-body">PASSWORD</Text>
          <TextField icon="lock" placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />
        </View>
      </View>

      <Pressable className="items-end py-3">
        <Text className="font-outfit-semibold text-[12.5px] text-brand">Forgot Password?</Text>
      </Pressable>

      <View className="pt-3">
        <Button label="Sign In" onPress={handleSignIn} loading={loading} />
      </View>

      <View className="py-6">
        <Divider label="Or continue with" />
      </View>

      <View className="gap-[10px]">
        <Button label="Continue with Google" variant="white" icon={<GoogleIcon size={20} />} onPress={signIn} />
        <Button label="Continue with Apple" variant="dark" icon={<AppleIcon size={18} />} onPress={signIn} />
      </View>

      <View className="flex-row items-center justify-center gap-[6px] pt-7">
        <Text className="font-outfit text-[13px] text-muted">Don't have an account?</Text>
        <Pressable onPress={() => navigation.navigate("SignUp")}>
          <Text className="font-outfit-bold text-[13px] text-brand">Sign Up</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
