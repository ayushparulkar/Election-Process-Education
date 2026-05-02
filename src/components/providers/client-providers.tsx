"use client";

import { useEffect, useState } from "react";
import LenisProvider from "./lenis-provider";
import CustomCursor from "../cursor/custom-cursor";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LenisProvider>
      <CustomCursor />
      {children}
    </LenisProvider>
  );
}
