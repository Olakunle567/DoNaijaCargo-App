import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/types";
import { AUTH_SOCIAL_REAL, APPLE_SIGN_IN_SUPPORTED, GOOGLE_SIGN_IN_SUPPORTED, useAuth } from "../../auth/AuthContext";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { LogoMark } from "../../ui/Logo";
import { TextField } from "../../ui/TextField";
import { Button } from "../../ui/Button";
import { Divider } from "../../ui/Divider";
import { GoogleIcon } from "../../ui/brand-icons/GoogleIcon";
import { AppleIcon } from "../../ui/brand-icons/AppleIcon";
import { GoogleAuthSheet } from "./GoogleAuthSheet";
import { AppleAuthSheet } from "./AppleAuthSheet";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

export function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();

  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const [googleOpen, setGoogleOpen] = useState(false);
  const [appleOpen, setAppleOpen] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSignIn = async () => {
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSuccess = async (provider: () => Promise<void>) => {
    try {
      await provider();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  // AUTH_SOCIAL_REAL: the provider's own native UI (Google account picker,
  // Apple Face ID sheet) replaces our mocked GoogleAuthSheet/AppleAuthSheet.
  const handleGooglePress = () => {
    if (!AUTH_SOCIAL_REAL || !GOOGLE_SIGN_IN_SUPPORTED) {
      setGoogleOpen(true);
      return;
    }
    setError("");
    setSocialLoading("google");
    handleSocialSuccess(signInWithGoogle).finally(() => setSocialLoading(null));
  };

  const handleApplePress = () => {
    if (!AUTH_SOCIAL_REAL) {
      setAppleOpen(true);
      return;
    }
    setError("");
    setSocialLoading("apple");
    handleSocialSuccess(signInWithApple).finally(() => setSocialLoading(null));
  };

  const closeForgot = () => {
    setForgotOpen(false);
    setResetSent(false);
    setResetEmail("");
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

      <Pressable className="items-end py-3" onPress={() => setForgotOpen(true)}>
        <Text className="font-outfit-semibold text-[12.5px] text-brand">Forgot Password?</Text>
      </Pressable>

      {error ? <Text className="pb-3 text-center font-outfit-semibold text-[12.5px] text-[#DC2626]">{error}</Text> : null}

      <View className="pt-3">
        <Button label="Sign In" onPress={handleSignIn} loading={loading} disabled={!canSubmit} />
      </View>

      <View className="py-6">
        <Divider label="Or continue with" />
      </View>

      <View className="gap-[10px]">
        <Button
          label="Continue with Google"
          variant="white"
          icon={<GoogleIcon size={20} />}
          onPress={handleGooglePress}
          loading={socialLoading === "google"}
          disabled={socialLoading !== null}
        />
        {APPLE_SIGN_IN_SUPPORTED ? (
          <Button
            label="Continue with Apple"
            variant="dark"
            icon={<AppleIcon size={18} />}
            onPress={handleApplePress}
            loading={socialLoading === "apple"}
            disabled={socialLoading !== null}
          />
        ) : null}
      </View>

      <View className="flex-row items-center justify-center gap-[6px] pt-7">
        <Text className="font-outfit text-[13px] text-muted">Don't have an account?</Text>
        <Pressable onPress={() => navigation.navigate("SignUp")}>
          <Text className="font-outfit-bold text-[13px] text-brand">Sign Up</Text>
        </Pressable>
      </View>

      <Modal visible={forgotOpen} transparent animationType="fade" onRequestClose={closeForgot}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={closeForgot}>
          <Pressable className="rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-4">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>
            {resetSent ? (
              <View className="items-center py-2">
                <View className="mb-3 size-14 items-center justify-center rounded-full bg-[rgba(27,67,50,0.08)]">
                  <Feather name="check" size={24} color="#1B4332" />
                </View>
                <Text className="pb-1 font-outfit-extrabold text-[17px] text-ink">Check your email</Text>
                <Text className="pb-5 text-center font-outfit text-[13px] text-muted">
                  If an account exists for {resetEmail || "that address"}, a reset link is on its way.
                </Text>
                <View className="w-full">
                  <Button label="Done" onPress={closeForgot} />
                </View>
              </View>
            ) : (
              <>
                <Text className="pb-1 font-outfit-extrabold text-[17px] text-ink">Reset your password</Text>
                <Text className="pb-4 font-outfit text-[13px] text-muted">
                  Enter the email on your account and we'll send a reset link.
                </Text>
                <TextField icon="mail" placeholder="you@example.com" value={resetEmail} onChangeText={setResetEmail} keyboardType="email-address" />
                <View className="pt-4">
                  <Button label="Send Reset Link" onPress={() => setResetSent(true)} disabled={!resetEmail.trim()} />
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <GoogleAuthSheet
        visible={googleOpen}
        onClose={() => setGoogleOpen(false)}
        onSuccess={() => { setGoogleOpen(false); handleSocialSuccess(signInWithGoogle); }}
      />
      <AppleAuthSheet
        visible={appleOpen}
        onClose={() => setAppleOpen(false)}
        onSuccess={() => { setAppleOpen(false); handleSocialSuccess(signInWithApple); }}
      />
    </ScreenContainer>
  );
}
