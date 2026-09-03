import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/types";
import { useAuth } from "../../auth/AuthContext";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { LogoMark } from "../../ui/Logo";
import { TextField } from "../../ui/TextField";
import { Button } from "../../ui/Button";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export function SignUpScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useAuth();

  const handleCreateAccount = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError("Please fill in every field.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signUp({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View className="items-center pb-3">
        <LogoMark />
      </View>

      <View className="pt-2">
        <Text className="font-outfit-extrabold text-[26px] text-ink">Create Account</Text>
        <Text className="pt-[6px] font-outfit text-[13px] text-muted">
          Join D.O Naija Cargo and start shipping smarter.
        </Text>
      </View>

      <View className="gap-4 pt-6">
        <View className="gap-[7px]">
          <Text className="font-outfit-bold text-[12px] tracking-[0.48px] text-body">FULL NAME</Text>
          <TextField icon="user" placeholder="e.g. Adebayo Okafor" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
        </View>

        <View className="gap-[7px]">
          <Text className="font-outfit-bold text-[12px] tracking-[0.48px] text-body">EMAIL ADDRESS</Text>
          <TextField icon="mail" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>

        <View className="gap-[7px]">
          <Text className="font-outfit-bold text-[12px] tracking-[0.48px] text-body">PHONE NUMBER</Text>
          <TextField icon="phone" placeholder="+234 800 000 0000" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>

        <View className="gap-[7px]">
          <Text className="font-outfit-bold text-[12px] tracking-[0.48px] text-body">PASSWORD</Text>
          <TextField icon="lock" placeholder="Min. 8 characters" value={password} onChangeText={setPassword} secureTextEntry />
        </View>

        <View className="gap-[7px]">
          <Text className="font-outfit-bold text-[12px] tracking-[0.48px] text-body">CONFIRM PASSWORD</Text>
          <TextField icon="lock" placeholder="Re-enter password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        </View>
      </View>

      <View className="my-5 rounded-xl border-[0.661px] border-[rgba(27,67,50,0.08)] bg-[#EEF1EF] px-[13px] py-[11px]">
        <Text className="font-outfit text-[11.5px] leading-[17.825px] text-muted">
          By creating an account, you agree to our{" "}
          <Text className="font-outfit-bold text-brand">Terms of Service</Text> and{" "}
          <Text className="font-outfit-bold text-brand">Privacy Policy</Text>.
        </Text>
      </View>

      {error ? <Text className="pb-3 text-center font-outfit-semibold text-[12.5px] text-[#DC2626]">{error}</Text> : null}

      <Button label="Create Account" onPress={handleCreateAccount} loading={loading} />

      <View className="flex-row items-center justify-center gap-[6px] pt-5">
        <Text className="font-outfit text-[13px] text-muted">Already have an account?</Text>
        <Pressable onPress={() => navigation.navigate("SignIn")}>
          <Text className="font-outfit-bold text-[13px] text-brand">Sign In</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
