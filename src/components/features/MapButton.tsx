"use client";

import { MapPin } from "lucide-react";

export function MapButton() {
  const openMaps = () => {
    window.open("https://www.google.com/maps/search/polling+booth+near+me");
  };

  return (
    <button 
      onClick={openMaps}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold transition-all"
    >
      <MapPin className="w-4 h-4" />
      Find Polling Booth Near Me
    </button>
  );
}
