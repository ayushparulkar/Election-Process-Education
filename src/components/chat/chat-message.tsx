"use client";

import { motion } from "framer-motion";
import { Bot, User, AlertCircle } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
  index: number;
  isTyping?: boolean;
}

export function ChatMessage({ message, index, isTyping = false }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isError = message.isError === true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-white/10"
            : isError
            ? "bg-red-500/80"
            : "bg-gradient-to-r from-[#6366F1] to-[#22D3EE]"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      <div
        className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-[#6366F1]/20 rounded-tr-sm text-white"
            : isError
            ? "bg-red-500/10 border border-red-500/20 rounded-tl-sm text-red-200"
            : "glass-light rounded-tl-sm text-[#E5E7EB]"
        }`}
      >
        <div className="whitespace-pre-wrap">
          {message.content}
          {!isUser && !isError && isTyping && (
            <span className="inline-block w-2 h-4 ml-0.5 bg-[#22D3EE] animate-pulse align-middle" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

