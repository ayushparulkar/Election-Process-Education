"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { useStore } from "@/lib/store";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/animation-variants";
import {
  UserCheck,
  ShieldCheck,
  Vote,
  BarChart3,
  X,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Registration",
    description: "Register as a voter with your details",
    icon: UserCheck,
    color: "#6366F1",
    content: [
      {
        question: "What is your eligibility status?",
        options: [
          "I am 18+ years old",
          "I am a citizen",
          "I have valid ID proof",
        ],
      },
      {
        question: "Choose your registration method:",
        options: ["Online Portal", "Offline Booth", "Mobile App"],
      },
    ],
  },
  {
    id: 2,
    title: "Verification",
    description: "Verify your identity and documents",
    icon: ShieldCheck,
    color: "#22D3EE",
    content: [
      {
        question: "Upload your identity document:",
        options: ["Aadhaar Card", "Voter ID", "Passport", "Driving License"],
      },
      {
        question: "Verification method:",
        options: ["Biometric", "OTP", "Physical Verification"],
      },
    ],
  },
  {
    id: 3,
    title: "Voting",
    description: "Cast your vote securely",
    icon: Vote,
    color: "#10B981",
    content: [
      {
        question: "Select your polling station:",
        options: ["Nearest Booth", "Home Voting", "Postal Ballot"],
      },
      {
        question: "How do you want to vote?",
        options: ["EVM Machine", "Ballot Paper", "Electronic Voting"],
      },
    ],
  },
  {
    id: 4,
    title: "Results",
    description: "View and understand election results",
    icon: BarChart3,
    color: "#F59E0B",
    content: [
      {
        question: "View results by:",
        options: ["Constituency", "State", "National"],
      },
      {
        question: "Analyze trends:",
        options: ["Vote Share", "Swing Analysis", "Demographics"],
      },
    ],
  },
];

export function SimulationSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { completeStep, completedSteps } = useStore();

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
    setCurrentQuestion(0);
  };

  const handleOptionSelect = () => {
    const step = steps.find((s) => s.id === activeStep);
    if (!step) return;

    if (currentQuestion < step.content.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      completeStep(activeStep!);
      setActiveStep(null);
    }
  };

  return (
    <section id="simulation" className="relative py-32 px-4">
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
            Interactive <span className="gradient-text">Simulation</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
            Experience each step of the election process through interactive
            storytelling
          </motion.p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);

            return (
              <motion.div key={step.id} variants={fadeInUp}>
                <GlassCard
                  onClick={() => handleStepClick(step.id)}
                  className={`relative cursor-hover h-full ${
                    isCompleted ? "border-[#10B981]/30" : ""
                  }`}
                  glow
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#0B0F1A] border border-[#6366F1]/30 flex items-center justify-center text-sm font-bold text-[#6366F1]">
                    {index + 1}
                  </div>

                  {/* Completed Badge */}
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </motion.div>
                  )}

                  <div className="flex flex-col items-center text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                      style={{
                        background: `${step.color}15`,
                        border: `1px solid ${step.color}30`,
                      }}
                    >
                      <Icon className="w-8 h-8" style={{ color: step.color }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-[#9CA3AF] text-sm">{step.description}</p>

                    {isCompleted && (
                      <span className="mt-4 text-xs text-[#10B981] font-medium">
                        Completed
                      </span>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Simulation Modal */}
      <AnimatePresence>
        {activeStep !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setActiveStep(null)}
            />

            {/* Modal Content */}
            <motion.div
              className="relative w-full max-w-2xl glass rounded-3xl p-8 overflow-hidden"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveStep(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Progress */}
              <div className="flex gap-2 mb-8">
                {steps
                  .find((s) => s.id === activeStep)
                  ?.content.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                        i <= currentQuestion ? "bg-[#6366F1]" : "bg-white/10"
                      }`}
                    />
                  ))}
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold mb-6">
                    {
                      steps.find((s) => s.id === activeStep)?.content[
                        currentQuestion
                      ].question
                    }
                  </h3>

                  <div className="grid gap-4">
                    {steps
                      .find((s) => s.id === activeStep)
                      ?.content[currentQuestion].options.map((option, i) => (
                        <motion.button
                          key={i}
                          className="w-full p-4 rounded-xl glass-light text-left hover:bg-white/5 transition-all group flex items-center justify-between"
                          onClick={handleOptionSelect}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>{option}</span>
                          <ChevronRight className="w-5 h-5 text-[#6366F1] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                      ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

