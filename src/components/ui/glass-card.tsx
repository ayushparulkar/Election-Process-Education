"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300",
        hover && "hover:scale-[1.02] hover:-translate-y-1",
        glow && "glow-border",
        className
      )}
      whileHover={
        hover
          ? {
              scale: 1.02,
              y: -4,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={{
        boxShadow: hover
          ? "0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
          : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}

