import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isGuest: boolean;
  setUser: (user: User | null) => void;
  setGuest: (isGuest: boolean) => void;
  logout: () => void;
}

interface SimulationState {
  currentStep: number;
  completedSteps: number[];
  score: number;
  readinessScore: number;
  setCurrentStep: (step: number) => void;
  completeStep: (step: number) => void;
  setScore: (score: number) => void;
  setReadinessScore: (score: number) => void;
  reset: () => void;
}

interface UIState {
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
}

interface StoreState extends AuthState, SimulationState, UIState {}

export const useStore = create<StoreState>((set) => ({
  // UI state
  language: "en",
  setLanguage: (language) => set({ language }),
  // Auth state
  user: null,
  isGuest: false,
  setUser: (user) => set({ user }),
  setGuest: (isGuest) => set({ isGuest }),
  logout: () => set({ user: null, isGuest: false }),

  // Simulation state
  currentStep: 0,
  completedSteps: [],
  score: 0,
  readinessScore: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  completeStep: (step) =>
    set((state) => ({
      completedSteps: [...new Set([...state.completedSteps, step])],
      score: state.score + 25,
      readinessScore: Math.min(state.readinessScore + 25, 100),
    })),
  setScore: (score) => set({ score }),
  setReadinessScore: (score) => set({ readinessScore: score }),
  reset: () => set({ currentStep: 0, completedSteps: [], score: 0, readinessScore: 0 }),
}));

