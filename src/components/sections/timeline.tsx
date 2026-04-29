"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { staggerContainer, fadeInUp } from "@/lib/animation-variants";
import { Calendar, Users, FileCheck, Vote, BarChart3, Award } from "lucide-react";

const timelineEvents = [
  {
    id: 1,
    title: "Election Announcement",
    description: "Election Commission announces dates and schedule",
    date: "Day 1",
    icon: Calendar,
    color: "#6366F1",
  },
  {
    id: 2,
    title: "Nomination Filing",
    description: "Candidates file their nomination papers",
    date: "Day 7",
    icon: FileCheck,
    color: "#22D3EE",
  },
  {
    id: 3,
    title: "Campaign Period",
    description: "Candidates campaign and present their manifestos",
    date: "Day 14-30",
    icon: Users,
    color: "#10B981",
  },
  {
    id: 4,
    title: "Voting Day",
    description: "Citizens cast their votes at polling stations",
    date: "Day 35",
    icon: Vote,
    color: "#F59E0B",
  },
  {
    id: 5,
    title: "Vote Counting",
    description: "Votes are counted and verified",
    date: "Day 36",
    icon: BarChart3,
    color: "#EF4444",
  },
  {
    id: 6,
    title: "Results Declared",
    description: "Winners are announced and certificates issued",
    date: "Day 37",
    icon: Award,
    color: "#8B5CF6",
  },
];

export function TimelineSection() {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="timeline" className="relative py-32 px-4 overflow-hidden">
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
            Election <span className="gradient-text">Timeline</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
            The journey from announcement to results
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Horizontal Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#6366F1]/50 to-transparent" />

          {/* Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {timelineEvents.map((event, index) => {
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
                            This phase is crucial for ensuring a fair and transparent
                            election process. All procedures follow the guidelines set
                            by the Election Commission.
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

