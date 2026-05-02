"use client";

import { useStore } from "@/lib/store";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useStore();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage(language === "en" ? "hi" : "en")}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm font-medium text-white group"
      >
        <Languages className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
        <span>{language === "en" ? "Hindi (हिन्दी)" : "English"}</span>
      </button>
    </div>
  );
}
