export interface SkillGroup {
  /** What the client gets. Leads, because a store owner buys the outcome. */
  outcome: string;
  detail: string;
  /** The technologies behind it — supporting evidence, not the headline. */
  technologies: string[];
}

// Grouped around what each capability achieves rather than what it is
// called. Extended once, when the portfolio grew from three projects to six
// — every technology genuinely demonstrated by one of the six is named
// somewhere below, and nothing is listed twice.
export const skillGroups: SkillGroup[] = [
  {
    outcome: "Answer customer questions accurately",
    detail:
      "Agents that look up a business's own policies and live data before replying, and remember the conversation while they do it.",
    technologies: [
      "Retrieval-Augmented Generation (RAG)",
      "Hybrid retrieval & reranking (PostgreSQL + pgvector, Chroma, Qdrant)",
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
      "Deterministic validation & confidence scoring",
      "Explainable AI output",
    ],
  },
  {
    outcome: "Extend automation beyond chat",
    detail:
      "The same retrieval, tool-calling and guardrail engineering applied past a text conversation: a scanned document instead of a chat message, a phone call instead of a browser tab.",
    technologies: [
      "Document extraction & human-review workflows",
      "Real-time voice (Deepgram speech-to-text, ElevenLabs text-to-speech)",
      "Twilio telephony integration",
      "PostgreSQL exclusion constraints for scheduling",
    ],
  },
  {
    outcome: "Ship it as working software",
    detail:
      "Deployed, documented systems with automated tests — built to be handed over and maintained, not demonstrated once.",
    technologies: [
      "Python / FastAPI / PostgreSQL / SQLAlchemy / Alembic",
      "React / TypeScript / Vite / Tailwind CSS",
      "Node.js",
      "Docker & Docker Compose",
      "Claude API (Haiku 4.5, Sonnet 5)",
    ],
  },
];
