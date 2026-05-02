"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { staggerContainer, fadeInUp } from "@/lib/animation-variants";
import { Calendar, Users, FileCheck, Vote, BarChart3, Award } from "lucide-react";

import { useStore } from "@/lib/store";

const timelineI18n = {
  en: {
    header: ["Election", "Process"],
    sub: "A step-by-step flow of the Indian election journey",
    events: [
      { id: 1, title: "Register as voter", description: "Apply online or offline to get your name on the electoral roll.", date: "Step 1", icon: Calendar, color: "#6366F1" },
      { id: 2, title: "Verify voter ID", description: "Check your name in the voter list and verify your EPIC details.", date: "Step 2", icon: FileCheck, color: "#22D3EE" },
      { id: 3, title: "Find polling booth", description: "Locate your assigned polling station near your residence.", date: "Step 3", icon: Users, color: "#10B981" },
      { id: 4, title: "Vote using EVM", description: "Visit the booth on election day and cast your vote securely.", date: "Step 4", icon: Vote, color: "#F59E0B" },
      { id: 5, title: "View results", description: "Wait for counting day to see the official election results.", date: "Step 5", icon: BarChart3, color: "#EF4444" },
    ],
    info: "This phase is crucial for ensuring a fair and transparent election process. All procedures follow the guidelines set by the Election Commission."
  },
  hi: {
    header: ["चुनाव", "प्रक्रिया"],
    sub: "भारतीय चुनाव यात्रा का चरण-दर-चरण प्रवाह",
    events: [
      { id: 1, title: "मतदाता पंजीकरण", description: "मतदाता सूची में अपना नाम दर्ज कराने के लिए ऑनलाइन या ऑफलाइन आवेदन करें।", date: "चरण 1", icon: Calendar, color: "#6366F1" },
      { id: 2, title: "वोटर आईडी सत्यापित करें", description: "मतदाता सूची में अपना नाम जांचें और अपने एपिक विवरणों को सत्यापित करें।", date: "चरण 2", icon: FileCheck, color: "#22D3EE" },
      { id: 3, title: "पोलिंग बूथ खोजें", description: "अपने निवास के पास अपने निर्धारित मतदान केंद्र का पता लगाएं।", date: "चरण 3", icon: Users, color: "#10B981" },
      { id: 4, title: "ईवीएम का उपयोग करके वोट दें", description: "चुनाव के दिन बूथ पर जाएं और अपना वोट सुरक्षित रूप से डालें।", date: "चरण 4", icon: Vote, color: "#F59E0B" },
      { id: 5, title: "परिणाम देखें", description: "आधिकारिक चुनाव परिणाम देखने के लिए मतगणना के दिन का इंतजार करें।", date: "चरण 5", icon: BarChart3, color: "#EF4444" },
    ],
    info: "यह चरण निष्पक्ष और पारदर्शी चुनाव प्रक्रिया सुनिश्चित करने के लिए महत्वपूर्ण है। सभी प्रक्रियाएं चुनाव आयोग द्वारा निर्धारित दिशानिर्देशों का पालन करती हैं।"
  }
};

export function TimelineSection() {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { language } = useStore();
  const t = timelineI18n[language];

  return (
    <section id="process" className="relative py-32 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t.header[0]} <span className="gradient-text">{t.header[1]}</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
            {t.sub}
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Horizontal Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#6366F1]/50 to-transparent" />

          {/* Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.events.map((event, index) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                >
                  <GlassCard
                    className={`cursor-hover relative overflow-hidden transition-all duration-500 ${
                      activeEvent === event.id ? "scale-105" : ""
                    }`}
                    onClick={() =>
                      setActiveEvent(activeEvent === event.id ? null : event.id)
                    }
                    glow={activeEvent === event.id}
                  >
                    {/* Node Indicator */}
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{
                        backgroundColor: `${event.color}20`,
                        borderColor: event.color,
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: event.color }}
                      />
                    </div>

                    <div className="flex flex-col items-center text-center pt-4">
                      {/* Date Badge */}
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full mb-4"
                        style={{
                          backgroundColor: `${event.color}20`,
                          color: event.color,
                        }}
                      >
                        {event.date}
                      </span>

                      {/* Icon */}
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                        style={{
                          background: `${event.color}15`,
                          border: `1px solid ${event.color}30`,
                        }}
                      >
                        <Icon className="w-7 h-7" style={{ color: event.color }} />
                      </div>

                      <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                      <p className="text-[#9CA3AF] text-sm">{event.description}</p>

                      {/* Expanded Info */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: activeEvent === event.id ? "auto" : 0,
                          opacity: activeEvent === event.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-sm text-[#9CA3AF]">
                            {t.info}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

