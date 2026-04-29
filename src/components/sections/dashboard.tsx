"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { useStore } from "@/lib/store";
import { staggerContainer, fadeInUp } from "@/lib/animation-variants";
import { Brain, Target, Shield, TrendingUp } from "lucide-react";

function CircularProgress({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setProgress(value), 500);
      return () => clearTimeout(timer);
    }
  }, [isInView, value]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg
          ref={ref}
          className="w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 10px ${color}50)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      </div>
      <span className="mt-4 text-sm text-[#9CA3AF]">{label}</span>
    </div>
  );
}

function AnimatedBar({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-[#9CA3AF]">{value}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : {}}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

const stats = [
  { label: "Knowledge", value: 85, color: "#6366F1", icon: Brain },
  { label: "Awareness", value: 72, color: "#22D3EE", icon: Target },
  { label: "Security", value: 90, color: "#10B981", icon: Shield },
  { label: "Participation", value: 65, color: "#F59E0B", icon: TrendingUp },
];

export function Dashboard() {
  const { readinessScore } = useStore();

  return (
    <section id="dashboard" className="relative py-32 px-4">
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
            Your <span className="gradient-text">Voting Readiness</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
            Track your progress and knowledge across key areas
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Score Card */}
          <GlassCard className="flex flex-col items-center justify-center py-12" glow>
            <h3 className="text-xl font-bold mb-8">Overall Readiness</h3>
            <CircularProgress
              value={readinessScore || 75}
              label="Complete all simulations to improve"
              color="#6366F1"
            />
            <div className="mt-8 text-center">
              <p className="text-[#9CA3AF] text-sm max-w-xs">
                {readinessScore >= 100
                  ? "Excellent! You're fully prepared to vote."
                  : "Complete simulation steps to increase your readiness score."}
              </p>
            </div>
          </GlassCard>

          {/* Stats Breakdown */}
          <GlassCard className="space-y-6 py-8">
            <h3 className="text-xl font-bold mb-6">Skill Breakdown</h3>
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${stat.color}15`,
                    border: `1px solid ${stat.color}30`,
                  }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className="flex-1">
                  <AnimatedBar
                    label={stat.label}
                    value={stat.value}
                    color={stat.color}
                    delay={index * 0.2}
                  />
                </div>
              </div>
            ))}
          </GlassCard>
        </div>

        {/* Achievement Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            { label: "Simulations", value: "4", sub: "Steps" },
            { label: "Questions", value: "12+", sub: "Answered" },
            { label: "Accuracy", value: "94%", sub: "Rate" },
            { label: "Time", value: "15m", sub: "Spent" },
          ].map((item) => (
            <motion.div key={item.label} variants={fadeInUp}>
              <GlassCard className="text-center py-6">
                <div className="text-3xl font-bold gradient-text mb-1">
                  {item.value}
                </div>
                <div className="text-sm text-[#9CA3AF]">{item.label}</div>
                <div className="text-xs text-[#6366F1] mt-1">{item.sub}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

