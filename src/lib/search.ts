import Fuse from "fuse.js";
import electionsDataEn from "@/data/elections.json";
import electionsDataHi from "@/data/elections_hi.json";
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

const dataMap = {
  en: electionsDataEn as ElectionEntry[],
  hi: electionsDataHi as ElectionEntry[],
};

const fuseEn = new Fuse(dataMap.en, {
  keys: ["topic", "keywords", "content"],
  threshold: 0.4,
  includeScore: true,
});

const fuseHi = new Fuse(dataMap.hi, {
  keys: ["topic", "keywords", "content"],
  threshold: 0.4,
  includeScore: true,
});

const fuseMap = {
  en: fuseEn,
  hi: fuseHi,
};

const i18n = {
  en: {
    next: "next",
    nextPrompt: '(Type "Next" for the next step)',
    nextGuidedPrompt: '(Type "Next" to see the next step)',
    allStepsDone: "That's all the steps for this topic! Is there anything else you'd like to know?",
    noResults: "I'm sorry, I couldn't find specific information on that topic. You can ask about voter registration, voting day procedures, or voter rights.",
    scenario: "**Scenario:**",
    illustrates: "This illustrates how",
    worksIn: "works in a real-life situation.",
    noExample: "(No specific example available for this topic yet.)",
    guidedHeader: "Let's go through the steps for",
    stepsLabel: "**Steps:**",
    resourcesLabel: "**Resources:**",
  },
  hi: {
    next: "अगला",
    nextPrompt: '(अगले चरण के लिए "अगला" टाइप करें)',
    nextGuidedPrompt: '(अगला चरण देखने के लिए "अगला" टाइप करें)',
    allStepsDone: "इस विषय के लिए सभी चरण पूरे हो गए हैं! क्या आप कुछ और जानना चाहेंगे?",
    noResults: "क्षमा करें, मुझे उस विषय पर विशिष्ट जानकारी नहीं मिली। आप मतदाता पंजीकरण, मतदान दिवस की प्रक्रियाओं या मतदाता अधिकारों के बारे में पूछ सकते हैं।",
    scenario: "**परिदृश्य:**",
    illustrates: "यह दर्शाता है कि",
    worksIn: "वास्तविक जीवन की स्थिति में कैसे काम करता है।",
    noExample: "(इस विषय के लिए अभी तक कोई विशिष्ट उदाहरण उपलब्ध नहीं है।)",
    guidedHeader: "आइए **{topic}** के चरणों को देखें:",
    stepsLabel: "**चरण:**",
    resourcesLabel: "**संसाधन:**",
  },
};

export function searchElectionInfo(
  query: string,
  mode: ChatMode = "simple",
  language: "en" | "hi" = "en",
  context: ChatContext = "general",
  history: { role: string; content: string }[] = []
): string {
  const lowerQuery = query.toLowerCase();
  const currentData = dataMap[language];
  const currentFuse = fuseMap[language];
  const t = i18n[language];
  
  // Handle "Next" in guided mode
  if ((lowerQuery === t.next.toLowerCase() || lowerQuery === "next") && history.length > 0) {
    // Find the last assistant message that mentioned a topic
    const lastAssistantMsg = [...history].reverse().find(m => m.role === "assistant");
    if (lastAssistantMsg) {
      const matchedEntry = currentData.find(e => lastAssistantMsg.content.includes(e.topic));
      if (matchedEntry && matchedEntry.steps) {
        // Count how many steps have been shown
        const stepsShown = history.filter(m => m.role === "assistant" && matchedEntry.steps!.some(s => m.content.includes(s))).length;
        if (stepsShown < matchedEntry.steps.length) {
          return `${matchedEntry.steps[stepsShown]}\n\n${t.nextPrompt}`;
        }
        return t.allStepsDone;
      }
    }
  }

  const results = currentFuse.search(query);

  if (results.length === 0) {
    return t.noResults;
  }

  const bestMatch = results[0].item;

  switch (mode) {
    case "detailed":
      let detailedRes = `### ${bestMatch.topic}\n\n${bestMatch.content}\n\n`;
      if (bestMatch.steps) {
        detailedRes += `${t.stepsLabel}\n` + bestMatch.steps.map((s, i) => `${i + 1}. ${s}`).join("\n") + "\n\n";
      }
      if (bestMatch.related_links) {
        detailedRes += `${t.resourcesLabel}\n` + bestMatch.related_links.map(l => `- [${l.title}](${l.url})`).join("\n");
      }
      return detailedRes;

    case "example":
      if (bestMatch.examples && bestMatch.examples.length > 0) {
        return `${t.scenario} ${bestMatch.examples[0]}\n\n${t.illustrates} ${bestMatch.topic} ${t.worksIn}`;
      }
      return `${bestMatch.content}\n\n${t.noExample}`;

    case "guided":
      if (bestMatch.steps && bestMatch.steps.length > 0) {
        const header = language === 'hi' ? t.guidedHeader.replace('{topic}', bestMatch.topic) : `${t.guidedHeader} **${bestMatch.topic}**:`;
        return `${header}\n\n${bestMatch.steps[0]}\n\n${t.nextGuidedPrompt}`;
      }
      return bestMatch.content;

    case "simple":
    default:
      return bestMatch.content;
  }
}
