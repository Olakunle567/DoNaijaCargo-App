import { useState } from "react";
import { Modal, Pressable, Switch, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AccountStackParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { BackHeader } from "../../ui/BackHeader";
import { TextField } from "../../ui/TextField";
import { Button } from "../../ui/Button";

type Props = NativeStackScreenProps<AccountStackParamList, "Settings">;

function Row({
  icon,
  title,
  desc,
  value,
  onValueChange,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  desc: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center gap-3 px-4 py-[13px]">
      <View className="size-9 items-center justify-center rounded-xl bg-[rgba(27,67,50,0.07)]">
        <Feather name={icon} size={18} color="#1B4332" />
      </View>
      <View className="flex-1">
        <Text className="font-outfit-semibold text-[14px] text-ink">{title}</Text>
        <Text className="font-outfit text-[11.5px] text-muted">{desc}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: "#D1D5DB", true: "#1B4332" }} thumbColor="#fff" />
    </View>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mt-4">
      <Text className="pb-2 font-outfit-bold text-[12px] tracking-[0.48px] text-brand">{title}</Text>
      <View className="divide-y divide-[rgba(27,67,50,0.07)] overflow-hidden rounded-2xl border-[0.661px] border-[rgba(27,67,50,0.07)] bg-surface">
        {children}
      </View>
    </View>
  );
}

const CURRENCIES = ["NGN (₦)", "USD ($)", "GBP (£)"];
const LANGUAGES = ["English", "Yoruba", "Hausa", "Igbo"];

export function SettingsScreen({ navigation }: Props) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [biometric, setBiometric] = useState(false);

  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [languageOpen, setLanguageOpen] = useState(false);

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const closePasswordModal = () => {
    setPasswordOpen(false);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setPwError("");
    setPwSuccess(false);
  };

  const handleChangePassword = () => {
    if (!currentPw || !newPw || !confirmPw) {
      setPwError("Please fill in every field.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords don't match.");
      return;
    }
    setPwError("");
    setPwSuccess(true);
  };

  return (
    <ScreenContainer scroll>
      <BackHeader title="Settings" subtitle="App preferences & notifications" onBack={() => navigation.goBack()} />

      <SectionCard title="NOTIFICATIONS">
        <Row icon="bell" title="Push Notifications" desc="Shipment & rider updates" value={pushEnabled} onValueChange={setPushEnabled} />
        <Row icon="mail" title="Email Notifications" desc="Receipts & account activity" value={emailEnabled} onValueChange={setEmailEnabled} />
        <Row icon="message-square" title="SMS Alerts" desc="Delivery codes & OTPs" value={smsEnabled} onValueChange={setSmsEnabled} />
      </SectionCard>

      <SectionCard title="SECURITY">
        <Row icon="lock" title="Biometric Login" desc="Use Face ID / fingerprint to sign in" value={biometric} onValueChange={setBiometric} />
        <Pressable onPress={() => setPasswordOpen(true)} className="flex-row items-center gap-3 px-4 py-[13px]">
          <View className="size-9 items-center justify-center rounded-xl bg-[rgba(27,67,50,0.07)]">
            <Feather name="key" size={18} color="#1B4332" />
          </View>
          <View className="flex-1">
            <Text className="font-outfit-semibold text-[14px] text-ink">Change Password</Text>
            <Text className="font-outfit text-[11.5px] text-muted">Update your account password</Text>
          </View>
          <Feather name="chevron-right" size={18} color="#9CA3AF" />
        </Pressable>
      </SectionCard>

      <SectionCard title="PREFERENCES">
        <Pressable onPress={() => setCurrencyOpen(true)} className="flex-row items-center gap-3 px-4 py-[13px]">
          <View className="size-9 items-center justify-center rounded-xl bg-[rgba(27,67,50,0.07)]">
            <Feather name="dollar-sign" size={18} color="#1B4332" />
          </View>
          <Text className="flex-1 font-outfit-semibold text-[14px] text-ink">Currency</Text>
          <Text className="font-outfit text-[13px] text-muted">{currency}</Text>
          <Feather name="chevron-right" size={18} color="#9CA3AF" />
        </Pressable>
        <Pressable onPress={() => setLanguageOpen(true)} className="flex-row items-center gap-3 px-4 py-[13px]">
          <View className="size-9 items-center justify-center rounded-xl bg-[rgba(27,67,50,0.07)]">
            <Feather name="globe" size={18} color="#1B4332" />
          </View>
          <Text className="flex-1 font-outfit-semibold text-[14px] text-ink">Language</Text>
          <Text className="font-outfit text-[13px] text-muted">{language}</Text>
          <Feather name="chevron-right" size={18} color="#9CA3AF" />
        </Pressable>
      </SectionCard>

      <SectionCard title="ABOUT">
        <View className="flex-row items-center justify-between px-4 py-[13px]">
          <Text className="font-outfit-semibold text-[14px] text-ink">App Version</Text>
          <Text className="font-outfit text-[13px] text-muted">1.4.2</Text>
        </View>
        <View className="flex-row items-center justify-between px-4 py-[13px]">
          <Text className="font-outfit-semibold text-[14px] text-ink">Terms of Service</Text>
          <Feather name="external-link" size={16} color="#9CA3AF" />
        </View>
        <View className="flex-row items-center justify-between px-4 py-[13px]">
          <Text className="font-outfit-semibold text-[14px] text-ink">Privacy Policy</Text>
          <Feather name="external-link" size={16} color="#9CA3AF" />
        </View>
      </SectionCard>

      {/* Currency picker */}
      <Modal visible={currencyOpen} transparent animationType="fade" onRequestClose={() => setCurrencyOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setCurrencyOpen(false)}>
          <Pressable className="rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-4">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>
            <Text className="pb-3 font-outfit-extrabold text-[16px] text-ink">Select Currency</Text>
            {CURRENCIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => {
                  setCurrency(c);
                  setCurrencyOpen(false);
                }}
                className="flex-row items-center justify-between border-b-[0.661px] border-[rgba(27,67,50,0.07)] py-[14px]"
              >
                <Text className={`font-outfit-semibold text-[14px] ${c === currency ? "text-brand" : "text-ink"}`}>{c}</Text>
                {c === currency ? <Feather name="check" size={18} color="#1B4332" /> : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Language picker */}
      <Modal visible={languageOpen} transparent animationType="fade" onRequestClose={() => setLanguageOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setLanguageOpen(false)}>
          <Pressable className="rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-4">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>
            <Text className="pb-3 font-outfit-extrabold text-[16px] text-ink">Select Language</Text>
            {LANGUAGES.map((l) => (
              <Pressable
                key={l}
                onPress={() => {
                  setLanguage(l);
                  setLanguageOpen(false);
                }}
                className="flex-row items-center justify-between border-b-[0.661px] border-[rgba(27,67,50,0.07)] py-[14px]"
              >
                <Text className={`font-outfit-semibold text-[14px] ${l === language ? "text-brand" : "text-ink"}`}>{l}</Text>
                {l === language ? <Feather name="check" size={18} color="#1B4332" /> : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Change password */}
      <Modal visible={passwordOpen} transparent animationType="fade" onRequestClose={closePasswordModal}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={closePasswordModal}>
          <Pressable className="gap-3 rounded-t-3xl bg-white px-[18px] pb-8 pt-5" onPress={(e) => e.stopPropagation()}>
            <View className="items-center pb-1">
              <View className="h-1 w-9 rounded-full bg-[#D1D5DB]" />
            </View>
            {pwSuccess ? (
              <View className="items-center py-2">
                <View className="mb-3 size-14 items-center justify-center rounded-full bg-[rgba(27,67,50,0.08)]">
                  <Feather name="check" size={24} color="#1B4332" />
                </View>
                <Text className="pb-1 font-outfit-extrabold text-[17px] text-ink">Password Updated</Text>
                <Text className="pb-5 text-center font-outfit text-[13px] text-muted">Your password has been changed successfully.</Text>
                <View className="w-full">
                  <Button label="Done" onPress={closePasswordModal} />
                </View>
              </View>
            ) : (
              <>
                <Text className="font-outfit-extrabold text-[17px] text-ink">Change Password</Text>
                <TextField icon="lock" placeholder="Current password" value={currentPw} onChangeText={setCurrentPw} secureTextEntry />
                <TextField icon="lock" placeholder="New password" value={newPw} onChangeText={setNewPw} secureTextEntry />
                <TextField icon="lock" placeholder="Confirm new password" value={confirmPw} onChangeText={setConfirmPw} secureTextEntry />
                {pwError ? <Text className="font-outfit-semibold text-[12.5px] text-[#DC2626]">{pwError}</Text> : null}
                <View className="pt-1">
                  <Button label="Update Password" onPress={handleChangePassword} />
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}
