export interface SkillGroup {
  /** What the client gets. Leads, because a store owner buys the outcome. */
  outcome: string;
  detail: string;
  /** The technologies behind it — supporting evidence, not the headline. */
  technologies: string[];
}

// Same capabilities as before, reordered around what they achieve rather than
// what they are called. Every technology from the previous list is preserved.
export const skillGroups: SkillGroup[] = [
  {
    outcome: "Answer customer questions accurately",
    detail:
      "Agents that look up a business's own policies and live data before replying, and remember the conversation while they do it.",
    technologies: [
      "Retrieval-Augmented Generation (RAG)",
      "Vector databases (Chroma, Qdrant)",
      "Tool-calling / function-calling agents",
      "Conversation memory",
    ],
  },
  {
    outcome: "Keep the output trustworthy",
    detail:
      "Explicit rules that check what the model says before a customer sees it, and a repeatable way to measure whether it is actually working.",
    technologies: [
      "Guardrails",
      "Eval harnesses",
      "Explainable AI output",
    ],
  },
  {
    outcome: "Ship it as working software",
    detail:
      "Deployed, documented systems with automated tests — built to be handed over and maintained, not demonstrated once.",
    technologies: [
      "React / TypeScript",
      "Node.js",
      "Multi-step agent chains",
      "Claude API (Haiku 4.5, Sonnet 5)",
    ],
  },
];
