"use client";

import { motion } from "framer-motion";
import type { Suggestion } from "@/types/chat";
import { MessageCircle, Lightbulb, HelpCircle } from "lucide-react";

interface SuggestionChipsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (text: string) => void;
}

const categoryIcons = {
  faq: HelpCircle,
  practical: Lightbulb,
  curiosity: MessageCircle,
};

const categoryColors = {
  faq: "from-[#6366F1]/20 to-[#6366F1]/5 border-[#6366F1]/30",
  practical: "from-[#10B981]/20 to-[#10B981]/5 border-[#10B981]/30",
  curiosity: "from-[#22D3EE]/20 to-[#22D3EE]/5 border-[#22D3EE]/30",
};

export function SuggestionChips({ suggestions, onSuggestionClick }: SuggestionChipsProps) {
  if (!suggestions.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap gap-2 mt-3 pl-11"
    >
      {suggestions.map((suggestion, i) => {
        const Icon = categoryIcons[suggestion.category];
        return (
          <motion.button
            key={suggestion.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => onSuggestionClick(suggestion.text)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[suggestion.category]} border hover:scale-105 transition-transform`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-3 h-3 opacity-70" />
            {suggestion.text}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
