"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuthContext } from "@/components/auth/auth-provider";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "@/components/chat/chat-message";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { SuggestionChips } from "@/components/chat/suggestion-chips";
import type { ChatContext, ChatMode } from "@/types/chat";
import { MODE_LABELS, MODE_DESCRIPTIONS } from "@/types/chat";
import {
  Bot, Send, X, Sparkles, BookOpen, Lightbulb, HelpCircle,
  Trash2, RotateCcw, User, LogOut, AlertTriangle,
} from "lucide-react";

const modeIcons: Record<ChatMode, typeof Sparkles> = {
  simple: Sparkles,
  detailed: BookOpen,
  example: Lightbulb,
  guided: HelpCircle,
};

const modeColors: Record<ChatMode, string> = {
  simple: "bg-[#6366F1]",
  detailed: "bg-[#8B5CF6]",
  example: "bg-[#10B981]",
  guided: "bg-[#F59E0B]",
};

interface AIAssistantProps {
  activeContext?: ChatContext;
}

export function AIAssistant({ activeContext = "general" }: AIAssistantProps) {
  const { user, isGuest, signOut } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isTyping,
    error,
    activeMode,
    suggestions,
    sendMessage,
    changeMode,
    clearChat,
    retryLastMessage,
  } = useChat(activeContext);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isAuthenticated = !!user && !isGuest;

  return (
    <>
      {isOpen && isMobile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
      )}

      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)" }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
              <Bot className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed z-50 ${isMobile ? "inset-4 bottom-20" : "bottom-24 right-6 w-[420px]"}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <GlassCard className={`flex flex-col overflow-hidden ${isMobile ? "h-[calc(100vh-100px)]" : "h-[580px]"}`} glow hover={false}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6366F1] to-[#22D3EE] flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Democracy AI</h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#10B981]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                      {error ? "Error" : "Online"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={clearChat}
                    className="p-2 rounded-lg hover:bg-white/5 text-[#9CA3AF] hover:text-white transition-colors"
                    title="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isAuthenticated && user ? (
                    <div className="flex items-center gap-2">
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="" className="w-7 h-7 rounded-full" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <button onClick={() => signOut()} className="p-2 rounded-lg hover:bg-white/5 text-[#9CA3AF] hover:text-red-400 transition-colors" title="Logout">
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : isGuest ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B]">Guest</span>
                  ) : null}
                </div>
              </div>

              <div className="flex gap-1.5 py-3 overflow-x-auto scrollbar-hide">
                {(Object.keys(modeIcons) as ChatMode[]).map((mode) => {
                  const Icon = modeIcons[mode];
                  const isActive = activeMode === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => changeMode(mode)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${isActive ? `${modeColors[mode]} text-white shadow-md` : "bg-white/5 text-[#9CA3AF] hover:bg-white/10"}`}
                      title={MODE_DESCRIPTIONS[mode]}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {MODE_LABELS[mode]}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-4 min-h-0">
                {messages.map((message, i) => (
                  <div key={message.id}>
                    <ChatMessage
                      message={message}
                      index={i}
                      isTyping={isTyping && i === messages.length - 1 && message.role === "assistant" && !message.isError}
                    />
                    {message.suggestions && (
                      <SuggestionChips suggestions={message.suggestions} onSuggestionClick={(text) => { sendMessage(text); }} />
                    )}
                  </div>
                ))}

                {isTyping && messages[messages.length - 1]?.role !== "assistant" && <TypingIndicator />}

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 mx-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300"
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button
                      onClick={retryLastMessage}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Retry
                    </button>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {suggestions.length > 0 && messages.length < 3 && (
                <div className="px-1 pt-2 pb-1">
                  <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]/50 mb-1.5 px-1">Quick questions</p>
                  <SuggestionChips suggestions={suggestions.slice(0, 3)} onSuggestionClick={(text) => { sendMessage(text); }} />
                </div>
              )}

              <div className="pt-3 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about elections..."
                    disabled={isTyping}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6366F1]/50 transition-colors disabled:opacity-50"
                  />
                  <motion.button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] flex items-center justify-center hover:from-[#4F46E5] hover:to-[#4338CA] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}