"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Vote, LogIn, User, LogOut } from "lucide-react";
import { useAuthContext } from "@/components/auth/auth-provider";
import { LoginModal } from "@/components/auth/login-modal";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Simulation", href: "#simulation" },
  { label: "Timeline", href: "#timeline" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Misinformation", href: "#misinfo" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, isGuest, isAuthenticated, signOut } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass" : "bg-transparent"}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#hero" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#22D3EE] flex items-center justify-center">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">
                Democracy<span className="gradient-text">Lab</span>
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[#9CA3AF] hover:text-white transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6366F1] to-[#22D3EE] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}

              {isAuthenticated && user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#9CA3AF]">
                    Welcome, <span className="text-white font-medium">{user.user_metadata?.full_name || user.email?.split("@")[0]}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-[#9CA3AF] hover:text-white transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-sm font-medium text-white hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  {isGuest ? "Sign In" : "Get Started"}
                </button>
              )}
            </div>

            <button
              className="md:hidden w-10 h-10 rounded-lg glass flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 glass md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="text-2xl font-bold text-white hover:text-[#22D3EE] transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => { setShowLoginModal(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white"
                >
                  <LogIn className="w-5 h-5" />
                  {isGuest ? "Sign In" : "Get Started"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
