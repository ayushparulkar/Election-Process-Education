"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { staggerContainer, fadeInUp } from "@/lib/animation-variants";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const myths = [
  {
    id: 1,
    myth: "My vote doesn't matter",
    reality:
      "Every single vote counts. Elections have been decided by just a few votes. Your vote is your voice in democracy.",
    category: "Voter Apathy",
  },
  {
    id: 2,
    myth: "Elections are rigged",
    reality:
      "India's EVMs are standalone machines with no internet connection. They are tested, sealed, and monitored by representatives of all parties.",
    category: "Misinformation",
  },
  {
    id: 3,
    myth: "I need money to vote",
    reality:
      "Voting is completely free. No one can charge you for voting or ask for money at polling stations. It's your constitutional right.",
    category: "Voter Education",
  },
  {
    id: 4,
    myth: "I can vote multiple times",
    reality:
      "Each voter has a unique ID and is registered at one polling station. Multiple voting is illegal and punishable.",
    category: "Legal",
  },
  {
    id: 5,
    myth: "My vote is not secret",
    reality:
      "The Indian Constitution guarantees secret ballot. No one can know who you voted for, ensuring free and fair expression.",
    category: "Privacy",
  },
  {
    id: 6,
    myth: "Election results are instant",
    reality:
      "Counting takes time due to multiple rounds of verification. Results are announced only after thorough checking by officials.",
    category: "Process",
  },
];

function FlipCard({
  myth,
  reality,
  category,
}: {
  myth: string;
  reality: string;
  category: string;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative h-64 cursor-hover perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 glass rounded-2xl p-6 flex flex-col items-center justify-center text-center backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <span className="text-xs text-red-400 font-medium mb-2">{category}</span>
          <h3 className="text-lg font-bold">{myth}</h3>
          <p className="text-xs text-[#9CA3AF] mt-2">Hover to reveal truth</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 glass rounded-2xl p-6 flex flex-col items-center justify-center text-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #10B98115, #0B0F1A)",
          }}
        >
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <span className="text-xs text-green-400 font-medium mb-2">Reality</span>
          <p className="text-sm">{reality}</p>
        </div>
      </motion.div>
    </div>
  );
}

export function MisinfoBuster() {
  return (
    <section id="misinfo" className="relative py-32 px-4">
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
            Misinformation <span className="gradient-text">Buster</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
            Don't fall for myths. Hover over the cards to reveal the truth.
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {myths.map((item) => (
            <motion.div key={item.id} variants={fadeInUp}>
              <FlipCard
                myth={item.myth}
                reality={item.reality}
                category={item.category}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

