export interface SkillGroup {
  category: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Agentic AI",
    items: [
      "Retrieval-Augmented Generation (RAG)",
      "Tool-calling / function-calling agents",
      "Multi-step agent chains",
      "Conversation memory",
    ],
  },
  {
    category: "Evaluation & Reliability",
    items: ["Eval harnesses", "Guardrails", "Explainable AI output"],
  },
  {
    category: "Engineering",
    items: [
      "React / TypeScript",
      "Node.js",
      "Vector databases (Chroma, Qdrant)",
      "Claude API (Haiku 4.5, Sonnet 5)",
    ],
  },
];
