"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { staggerContainer, fadeInUp } from "@/lib/animation-variants";
import { Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #6366F1 0%, #22D3EE 50%, transparent 70%)",
            filter: "blur(80px)",
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Sparkles className="w-4 h-4 text-[#22D3EE]" />
          <span className="text-sm text-[#9CA3AF]">Start Your Journey</span>
        </motion.div>

        <motion.h2
          variants={fadeInUp}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
        >
          Ready to Vote{" "}
          <span className="gradient-text glow-text">Smart?</span>
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-xl text-[#9CA3AF] mb-12 max-w-2xl mx-auto"
        >
          Equip yourself with knowledge, practice the process, and become a
          confident voter. Your democracy needs you.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <MagneticButton
            onClick={() => {
              document
                .getElementById("simulation")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            glow
          >
            Start Now
          </MagneticButton>

          <motion.button
            className="px-8 py-4 rounded-full font-semibold text-white border border-white/20 hover:bg-white/5 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document
                .getElementById("dashboard")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Progress
          </motion.button>
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#6366F1]/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>
    </section>
  );
}

