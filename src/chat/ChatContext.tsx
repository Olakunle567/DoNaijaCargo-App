import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

export type ChatMessage = {
  id: string;
  from: "me" | "rider";
  text: string;
  time: string;
};

type ChatContextValue = {
  messages: ChatMessage[];
  unreadCount: number;
  sendMessage: (text: string) => void;
  markRead: () => void;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function now() {
  return new Date().toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" });
}

const RIDER_REPLIES = [
  "Got it, thanks!",
  "I'm close, just navigating around traffic.",
  "Sure, no problem.",
  "On my way, be there shortly!",
];

// MOCK: no real messaging backend exists yet — this whole provider is a
// client-side simulation (a seeded opening line, canned auto-replies on a
// timer). Nothing here is persisted or tied to a specific ride/rider; the
// rider identity shown alongside it in ChatScreen comes from the real ride
// doc, but the conversation itself is not real.
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "seed-1", from: "rider", text: "Hi! I'm on my way to pick up your package.", time: now() },
  ]);
  const [unreadCount, setUnreadCount] = useState(1);
  const replyIndex = useRef(0);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: `me-${Date.now()}`, from: "me", text: trimmed, time: now() }]);

    setTimeout(() => {
      const reply = RIDER_REPLIES[replyIndex.current % RIDER_REPLIES.length];
      replyIndex.current += 1;
      setMessages((prev) => [...prev, { id: `rider-${Date.now()}`, from: "rider", text: reply, time: now() }]);
      setUnreadCount((n) => n + 1);
    }, 1400);
  }, []);

  const markRead = useCallback(() => setUnreadCount(0), []);

  const value = useMemo(() => ({ messages, unreadCount, sendMessage, markRead }), [messages, unreadCount, sendMessage, markRead]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
