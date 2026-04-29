"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366F1] to-[#22D3EE] flex items-center justify-center">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="glass-light p-3 rounded-2xl rounded-tl-sm flex items-center gap-1 min-w-[48px] justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#22D3EE]"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}
