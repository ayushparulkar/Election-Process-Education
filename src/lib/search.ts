import Fuse from "fuse.js";
import electionsData from "@/data/elections.json";
import { ChatMode, ChatContext } from "@/types/chat";

export interface ElectionEntry {
  id: string;
  topic: string;
  keywords: string[];
  content: string;
  steps?: string[];
  examples?: string[];
  related_links?: { title: string; url: string }[];
}

const fuse = new Fuse(electionsData as ElectionEntry[], {
  keys: ["topic", "keywords", "content"],
  threshold: 0.4,
  includeScore: true,
});

export function searchElectionInfo(
  query: string,
  mode: ChatMode = "simple",
  context: ChatContext = "general",
  history: { role: string; content: string }[] = []
): string {
  const lowerQuery = query.toLowerCase();
  
  // Handle "Next" in guided mode
  if (lowerQuery === "next" && history.length > 0) {
    // Find the last assistant message that mentioned a topic
    const lastAssistantMsg = [...history].reverse().find(m => m.role === "assistant");
    if (lastAssistantMsg) {
      const matchedEntry = electionsData.find(e => lastAssistantMsg.content.includes(e.topic));
      if (matchedEntry && matchedEntry.steps) {
        // Count how many steps have been shown
        const stepsShown = history.filter(m => m.role === "assistant" && matchedEntry.steps!.some(s => m.content.includes(s))).length;
        if (stepsShown < matchedEntry.steps.length) {
          return `${matchedEntry.steps[stepsShown]}\n\n(Type "Next" for the next step)`;
        }
        return "That's all the steps for this topic! Is there anything else you'd like to know?";
      }
    }
  }

  const results = fuse.search(query);

  if (results.length === 0) {
    return "I'm sorry, I couldn't find specific information on that topic. You can ask about voter registration, voting day procedures, or voter rights.";
  }

  const bestMatch = results[0].item;

  switch (mode) {
    case "detailed":
      let detailedRes = `### ${bestMatch.topic}\n\n${bestMatch.content}\n\n`;
      if (bestMatch.steps) {
        detailedRes += "**Steps:**\n" + bestMatch.steps.map((s, i) => `${i + 1}. ${s}`).join("\n") + "\n\n";
      }
      if (bestMatch.related_links) {
        detailedRes += "**Resources:**\n" + bestMatch.related_links.map(l => `- [${l.title}](${l.url})`).join("\n");
      }
      return detailedRes;

    case "example":
      if (bestMatch.examples && bestMatch.examples.length > 0) {
        return `**Scenario:** ${bestMatch.examples[0]}\n\nThis illustrates how ${bestMatch.topic} works in a real-life situation.`;
      }
      return `${bestMatch.content}\n\n(No specific example available for this topic yet.)`;

    case "guided":
      if (bestMatch.steps && bestMatch.steps.length > 0) {
        return `Let's go through the steps for **${bestMatch.topic}**:\n\n${bestMatch.steps[0]}\n\n(Type "Next" to see the next step)`;
      }
      return bestMatch.content;

    case "simple":
    default:
      return bestMatch.content;
  }
}
