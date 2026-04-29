"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
}

export function MagneticButton({
  children,
  className,
  onClick,
  glow = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.3;
    const y = (clientY - top - height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        "relative px-8 py-4 rounded-full font-semibold text-white overflow-hidden transition-all",
        glow && "glow-border",
        className
      )}
      style={{
        background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 40px rgba(99, 102, 241, 0.5)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-[#22D3EE] to-[#6366F1] opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
}

