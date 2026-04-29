"use client";

import { useState, useEffect, useRef } from "react";
import { ParticleField } from "@/components/three/particle-field";
import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/sections/hero";
import { SimulationSection } from "@/components/sections/simulation";
import { AIAssistant } from "@/components/sections/ai-assistant";
import { TimelineSection } from "@/components/sections/timeline";
import { Dashboard } from "@/components/sections/dashboard";
import { MisinfoBuster } from "@/components/sections/misinfo-buster";
import { CTASection } from "@/components/sections/cta-section";
import type { ChatContext } from "@/types/chat";

const sectionMap: Record<string, ChatContext> = {
  hero: "general",
  simulation: "simulation",
  timeline: "registration",
  dashboard: "voting-day",
  misinfo: "results",
  cta: "general",
};

export default function Home() {
  const [activeContext, setActiveContext] = useState<ChatContext>("general");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id && sectionMap[id]) {
              setActiveContext(sectionMap[id]);
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
    );

    Object.keys(sectionMap).forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        sectionRefs.current[id] = el;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#0B0F1A]">
      <ParticleField />
      <Navigation />

      <div className="relative z-10">
        <section id="hero"><Hero /></section>
        <section id="simulation"><SimulationSection /></section>
        <section id="timeline"><TimelineSection /></section>
        <section id="dashboard"><Dashboard /></section>
        <section id="misinfo"><MisinfoBuster /></section>
        <CTASection />

        <footer className="py-12 px-4 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">
                Democracy<span className="gradient-text">Lab</span>
              </span>
            </div>
            <p className="text-sm text-[#9CA3AF]">
              Empowering citizens through interactive education
            </p>
            <p className="text-xs text-[#9CA3AF]/50">
              Built with Next.js, Three.js & Framer Motion
            </p>
          </div>
        </footer>
      </div>

      <AIAssistant activeContext={activeContext} />
    </main>
  );
}
