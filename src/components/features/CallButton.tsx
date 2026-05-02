"use client";

import { Phone } from "lucide-react";

export function CallButton() {
  return (
    <a href="tel:1950" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-semibold transition-all">
      <Phone className="w-4 h-4" />
      Call Election Helpline
    </a>
  );
}
