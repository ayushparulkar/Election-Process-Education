"use client";

import { useState, useCallback, useRef } from "react";
import { useStore } from "@/lib/store";
import type { ChatMessage, ChatMode, ChatContext, Suggestion } from "@/types/chat";
import { DEFAULT_SUGGESTIONS } from "@/types/chat";
import Fuse from "fuse.js";
import data from "@/data/elections.json";

const fuse = new Fuse(data, {
  keys: ["keywords", "topic"],
  threshold: 0.4,
});

function generateResponse(item: any, mode: string) {
  if (!item) {
    return {
      reply:
        "I couldn’t find that. Try asking about voter registration, voting day, or election results.",
    };
  }

  if (mode === "simple") {
    return { reply: item.simple };
  }

  if (mode === "example") {
    return { reply: item.example };
  }

  if (mode === "detailed") {
    const steps = item.detailed?.steps
      ?.map((s: string, i: number) => `${i + 1}. ${s}`)
      .join("\n");

    return {
      reply: `${item.detailed?.description}\n\n${steps}`,
      actions: item.actions || [],
    };
  }

  return { reply: item.simple };
}

const MAX_HISTORY = 5;
const TYPING_SPEED = 12; // ms per char (simulated typing)

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getFollowUpSuggestions(lastMessage: string, context: ChatContext): Suggestion[] {
  const lower = lastMessage.toLowerCase();
  if (lower === "next") {
    return [
      { id: "f13", text: "Learn More", category: "curiosity" },
      { id: "f14", text: "Start Simulation", category: "practical" },
    ];
  }
  if (lower.includes("id") || lower.includes("document")) {
    return [
      { id: "f1", text: "What if I lost my voter ID?", category: "practical" },
      { id: "f2", text: "Can I vote with Aadhaar?", category: "practical" },
      { id: "f3", text: "How to get a duplicate voter ID?", category: "practical" },
    ];
  }
  if (lower.includes("register") || lower.includes("name")) {
    return [
      { id: "f4", text: "My name is not in voter list", category: "practical" },
      { id: "f5", text: "How to update voter details?", category: "practical" },
      { id: "f6", text: "Voter registration deadline?", category: "practical" },
      { id: "f-guided", text: "Guided Registration", category: "practical" },
    ];
  }
  if (lower.includes("vote") || lower.includes("polling")) {
    return [
      { id: "f7", text: "What is NOTA?", category: "faq" },
      { id: "f8", text: "Can I vote from a different city?", category: "practical" },
      { id: "f9", text: "What if EVM malfunctions?", category: "practical" },
      { id: "f-guided2", text: "Guided Voting Day", category: "practical" },
    ];
  }
  if (lower.includes("result") || lower.includes("count")) {
    return [
      { id: "f10", text: "How are votes counted?", category: "faq" },
      { id: "f11", text: "What is VVPAT verification?", category: "faq" },
      { id: "f12", text: "When are results declared?", category: "faq" },
    ];
  }
  const contextSuggestions: Record<ChatContext, Suggestion[]> = {
    general: [
      { id: "g1", text: "Tell me about Indian democracy", category: "curiosity" },
      { id: "g2", text: "How often are elections held?", category: "faq" },
      { id: "g3", text: "Who can vote in India?", category: "faq" },
    ],
    registration: [
      { id: "r1", text: "Documents needed for registration", category: "practical" },
      { id: "r2", text: "Online vs offline registration", category: "practical" },
      { id: "r3", text: "How long does verification take?", category: "faq" },
    ],
    "voting-day": [
      { id: "v1", text: "What time do polls open?", category: "faq" },
      { id: "v2", text: "Can I bring my phone?", category: "practical" },
      { id: "v3", text: "What if there is a long queue?", category: "practical" },
    ],
    results: [
      { id: "res1", text: "How is the winner decided?", category: "faq" },
      { id: "res2", text: "What if results are disputed?", category: "practical" },
      { id: "res3", text: "Role of Election Commission", category: "curiosity" },
    ],
    simulation: [
      { id: "s1", text: "Explain the simulation steps", category: "faq" },
      { id: "s2", text: "What is a mock poll?", category: "curiosity" },
      { id: "s3", text: "How to improve readiness score?", category: "practical" },
    ],
  };
  
  if (lower.includes("step") || lower.includes("next")) {
     return [
       { id: "next-step", text: "Next Step", category: "practical" },
       { id: "learn-more", text: "Learn More", category: "curiosity" }
     ];
  }

  return contextSuggestions[context] || contextSuggestions.general;
}

export function useChat(context: ChatContext = "general") {
  const { isGuest } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      role: "assistant",
      content: "Welcome to Democracy Lab AI! I am here to help you understand the Indian election process. Choose a mode below and ask me anything!",
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

        const result = fuse.search(content.trim());
        const item = result.length > 0 ? result[0].item : null;
        
        const data = generateResponse(item, activeMode);
        
        if (!data.reply) {
          throw new Error("Something went wrong. Please try again.");
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
        simulateTyping(aiMessageId, data.reply, (fullText) => {
          const followUps = getFollowUpSuggestions(fullText, context);

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
      content: `Switched to ${mode.charAt(0).toUpperCase() + mode.slice(1)} mode. I will now provide ${mode === "simple" ? "short and easy" : mode === "detailed" ? "in-depth structured" : mode === "example" ? "real-life scenario-based" : "quiz-style"} explanations. Ask me anything!`,
      mode,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, modeMessage]);
  }, []);

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
        content: "Chat cleared! Welcome back to Democracy Lab AI. How can I help you today?",
        timestamp: Date.now(),
        suggestions: DEFAULT_SUGGESTIONS.slice(0, 3),
      },
    ]);
    setSuggestions(DEFAULT_SUGGESTIONS.slice(0, 3));
    setError(null);
  }, [cancelTyping]);



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

