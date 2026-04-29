"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { staggerContainer, fadeInUp } from "@/lib/animation-variants";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const titleWords = "Experience Democracy Like Never Before".split(" ");

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background Layer */}
      <motion.div
        className="absolute inset-0 gradient-bg"
        style={{ y, opacity }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-sm text-[#9CA3AF]">Interactive Election Experience</span>
        </motion.div>

        {/* Title with word-by-word animation */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em]"
              variants={{
                hidden: { opacity: 0, y: 60, rotateX: -40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  transition: {
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
            >
              {word === "Democracy" || word === "Never" || word === "Before" ? (
                <span className="gradient-text glow-text">{word}</span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl text-[#9CA3AF] mb-12 max-w-2xl mx-auto"
        >
          Learn, simulate, and master the election process through immersive
          storytelling and AI guidance
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={fadeInUp}>
          <MagneticButton
            onClick={() => {
              document
                .getElementById("simulation")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            glow
          >
            Start Simulation
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-[#6366F1]/50 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

