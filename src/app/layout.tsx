import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CustomCursor } from "@/components/cursor/custom-cursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Democracy Lab | Experience Elections",
  description: "Learn, simulate, and master the election process through interactive simulation and AI assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full custom-cursor-active">
        <AuthProvider>
          <LenisProvider>
            <CustomCursor />
            {children}
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
