export type ChatMode = "simple" | "detailed" | "example" | "guided";

export type ChatContext =
  | "general"
  | "registration"
  | "voting-day"
  | "results"
  | "simulation";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: ChatMode;
  context?: ChatContext;
  timestamp: number;
  suggestions?: Suggestion[];
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatRequest {
  message: string;
  mode: ChatMode;
  context: ChatContext;
  history: { role: "user" | "assistant"; content: string }[];
}

export interface Suggestion {
  id: string;
  text: string;
  category: "faq" | "practical" | "curiosity";
}

export const MODE_LABELS: Record<ChatMode, string> = {
  simple: "Simple",
  detailed: "Detailed",
  example: "Example",
  guided: "Guided",
};

export const MODE_DESCRIPTIONS: Record<ChatMode, string> = {
  simple: "Short & easy explanations",
  detailed: "In-depth structured info",
  example: "Real-life scenarios",
  guided: "Step-by-step guidance",
};

export const CONTEXT_LABELS: Record<ChatContext, string> = {
  general: "General",
  registration: "Voter Registration",
  "voting-day": "Voting Day",
  results: "Election Results",
  simulation: "Simulation",
};

export const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { id: "1", text: "What is NOTA?", category: "faq" },
  { id: "2", text: "Documents needed to vote", category: "practical" },
  { id: "3", text: "How to register as a voter?", category: "practical" },
  { id: "4", text: "What if my name is not in voter list?", category: "practical" },
  { id: "5", text: "Can I vote without ID?", category: "practical" },
  { id: "6", text: "How does EVM work?", category: "curiosity" },
];

