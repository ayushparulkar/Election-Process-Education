"use client";

import { useState, useCallback, useRef } from "react";
import { useStore } from "@/lib/store";
import { searchElectionInfo } from "@/lib/search";
import type { ChatMessage, ChatMode, ChatContext, Suggestion } from "@/types/chat";
import { DEFAULT_SUGGESTIONS } from "@/types/chat";

const chatI18n = {
  en: {
    welcome: "Welcome to Election Assistant! I am here to help you understand the Indian election process. Choose a mode below and ask me anything!",
    cleared: "Chat cleared! Welcome back to Democracy Lab AI. How can I help you today?",
    switched: (mode: string) => `Switched to ${mode.charAt(0).toUpperCase() + mode.slice(1)} mode. I will now provide ${mode === "simple" ? "short and easy" : mode === "detailed" ? "in-depth structured" : mode === "example" ? "real-life scenario-based" : "guided step-by-step"} explanations. Ask me anything!`,
    error: "Something went wrong. Please try again.",
    nextStep: "Next Step",
    learnMore: "Learn More",
  },
  hi: {
    welcome: "इलेक्शन असिस्टेंट में आपका स्वागत है! मैं यहां आपको भारतीय चुनाव प्रक्रिया को समझने में मदद करने के लिए हूं। नीचे दिए गए मोड में से एक चुनें और मुझसे कुछ भी पूछें!",
    cleared: "चैट साफ़ कर दी गई! डेमोक्रेसी लैब एआई में वापस स्वागत है। मैं आज आपकी क्या मदद कर सकता हूँ?",
    switched: (mode: string) => `मोड बदलकर ${mode === "simple" ? "सरल" : mode === "detailed" ? "विस्तृत" : mode === "example" ? "उदाहरण" : "निर्देशित"} कर दिया गया है। मैं अब ${mode === "simple" ? "छोटे और आसान" : mode === "detailed" ? "गहराई से संरचित" : mode === "example" ? "वास्तविक जीवन के परिदृश्य आधारित" : "चरण-दर-चरण"} स्पष्टीकरण प्रदान करूँगा। मुझसे कुछ भी पूछें!`,
    error: "कुछ गलत हो गया। कृपया पुन: प्रयास करें।",
    nextStep: "अगला चरण",
    learnMore: "अधिक जानें",
  },
};

const MAX_HISTORY = 5;
const TYPING_SPEED = 12; // ms per char (simulated typing)

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getFollowUpSuggestions(lastMessage: string, context: ChatContext, lang: "en" | "hi"): Suggestion[] {
  const t = chatI18n[lang];
  const lower = lastMessage.toLowerCase();
  
  if (lower.includes("step") || lower.includes("next") || lower.includes("अगला") || lower.includes("चरण")) {
     return [
       { id: "next-step", text: t.nextStep, category: "practical" },
       { id: "learn-more", text: t.learnMore, category: "curiosity" }
     ];
  }
  
  // Return default suggestions if no specific keyword matched
  return DEFAULT_SUGGESTIONS.slice(0, 3).map(s => {
      // In a real app, we'd translate these too
      return s;
  });
}

export function useChat(context: ChatContext = "general") {
  const { isGuest, language } = useStore();
  const t = chatI18n[language];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      role: "assistant",
      content: t.welcome,
      timestamp: Date.now(),
      suggestions: DEFAULT_SUGGESTIONS.slice(0, 3),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<ChatMode>("simple");
  const [suggestions, setSuggestions] = useState<Suggestion[]>(DEFAULT_SUGGESTIONS.slice(0, 3));
  const abortControllerRef = useRef<AbortController | null>(null);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getHistory = useCallback(() => {
    return messages.slice(-MAX_HISTORY).map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));
  }, [messages]);

  const cancelTyping = useCallback(() => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  }, []);

  const simulateTyping = useCallback((
    aiMessageId: string,
    fullText: string,
    onComplete: (text: string) => void
  ) => {
    cancelTyping();
    let index = 0;

    typingIntervalRef.current = setInterval(() => {
      index++;
      const partial = fullText.slice(0, index);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, content: partial } : msg
        )
      );

      if (index >= fullText.length) {
        cancelTyping();
        onComplete(fullText);
      }
    }, TYPING_SPEED);
  }, [cancelTyping]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Cancel any in-flight requests or typing
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      cancelTyping();

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);
      setError(null);
      setSuggestions([]);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network latency

        const history = messages.slice(-MAX_HISTORY).map(m => ({ role: m.role, content: m.content }));
        const reply = searchElectionInfo(content.trim(), activeMode, language, context, history);
        
        if (!reply) {
          throw new Error(t.error);
        }

        const aiMessageId = generateId();

        setMessages((prev) => [
          ...prev,
          {
            id: aiMessageId,
            role: "assistant",
            content: "",
            mode: activeMode,
            context,
            timestamp: Date.now(),
          },
        ]);

        setIsTyping(false);

        // Simulate typing effect
        simulateTyping(aiMessageId, reply, (fullText) => {
          const followUps = getFollowUpSuggestions(fullText, context, language);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: fullText, suggestions: followUps }
                : msg
            )
          );
          setSuggestions(followUps);
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        cancelTyping();
        const friendlyError =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";

        console.error("[useChat] Error:", err);
        setError(friendlyError);
        setIsTyping(false);

        // Add error as a system message (not a real assistant message)
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: friendlyError,
            timestamp: Date.now(),
            isError: true,
          },
        ]);
      } finally {
        abortControllerRef.current = null;
      }
    },
    [activeMode, context, getHistory, simulateTyping, cancelTyping]
  );

  const changeMode = useCallback((mode: ChatMode) => {
    setActiveMode(mode);
    const modeMessage: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: t.switched(mode),
      mode,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, modeMessage]);
  }, [t]);

  const retryLastMessage = useCallback(() => {
    // Remove any error messages
    setMessages((prev) => prev.filter((m) => !m.isError));
    setError(null);

    // Find last user message
    const msgs = [...messages];
    let idx = msgs.length - 1;
    while (idx >= 0 && msgs[idx].role !== "user") idx--;

    if (idx >= 0) {
      sendMessage(msgs[idx].content);
    }
  }, [messages, sendMessage]);

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    cancelTyping();
    setMessages([
      {
        id: generateId(),
        role: "assistant",
        content: t.cleared,
        timestamp: Date.now(),
        suggestions: DEFAULT_SUGGESTIONS.slice(0, 3),
      },
    ]);
    setSuggestions(DEFAULT_SUGGESTIONS.slice(0, 3));
    setError(null);
  }, [cancelTyping, t.cleared]);



  return {
    messages,
    isTyping,
    error,
    activeMode,
    suggestions,
    sendMessage,
    changeMode,
    clearChat,
    retryLastMessage,
  };
}

