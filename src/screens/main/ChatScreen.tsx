import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Linking, Platform, Pressable, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RidingStackParamList } from "../../navigation/types";
import { useChat, type ChatMessage } from "../../chat/ChatContext";

type Props = NativeStackScreenProps<RidingStackParamList, "Chat">;

const RIDER_PHONE = "+2348012345678";

export function ChatScreen({ navigation }: Props) {
  const { messages, sendMessage, markRead } = useChat();
  const [draft, setDraft] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
    markRead();
  }, [messages.length, markRead]);

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <View className="flex-row items-center gap-3 border-b-[0.661px] border-border-brand px-4 py-3">
          <Pressable
            onPress={() => navigation.goBack()}
            className="size-9 items-center justify-center rounded-xl border-[0.661px] border-border-brand bg-[#EEF1EF]"
            hitSlop={6}
          >
            <Feather name="arrow-left" size={18} color="#1B4332" />
          </Pressable>
          <View className="size-9 items-center justify-center rounded-full bg-surface">
            <Text className="text-[18px]">🧑🏾</Text>
          </View>
          <View className="flex-1">
            <Text className="font-outfit-bold text-[15px] text-ink">Emeka Obi</Text>
            <View className="flex-row items-center gap-1">
              <View className="size-[6px] rounded-full bg-[#22C55E]" />
              <Text className="font-outfit text-[11px] text-muted">Online · Green Bajaj</Text>
            </View>
          </View>
          <Pressable onPress={() => Linking.openURL(`tel:${RIDER_PHONE}`)} className="size-9 items-center justify-center rounded-xl bg-[#EEF1EF]" hitSlop={6}>
            <Feather name="phone" size={17} color="#1B4332" />
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerClassName="gap-3 px-4 py-4"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const mine = item.from === "me";
            return (
              <View className={mine ? "items-end" : "items-start"}>
                <View
                  className={`max-w-[80%] rounded-2xl px-4 py-[10px] ${
                    mine ? "rounded-br-sm bg-brand" : "rounded-bl-sm bg-surface"
                  }`}
                >
                  <Text className={`font-outfit text-[14px] ${mine ? "text-white" : "text-ink"}`}>{item.text}</Text>
                </View>
                <Text className="mt-1 font-outfit text-[10px] text-muted">{item.time}</Text>
              </View>
            );
          }}
        />

        <View className="flex-row items-center gap-2 border-t-[0.661px] border-border-brand px-4 py-3">
          <View className="flex-1 flex-row items-center rounded-2xl border-[1.322px] border-border-brand bg-surface px-4 py-[10px]">
            <TextInput
              className="flex-1 font-outfit text-[14px] text-ink"
              placeholder="Message Emeka…"
              placeholderTextColor="#99A1AF"
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
          </View>
          <Pressable
            onPress={handleSend}
            disabled={!draft.trim()}
            className={`size-11 items-center justify-center rounded-full ${draft.trim() ? "bg-brand" : "bg-border"}`}
          >
            <Feather name="send" size={18} color={draft.trim() ? "#fff" : "#9CA3AF"} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
