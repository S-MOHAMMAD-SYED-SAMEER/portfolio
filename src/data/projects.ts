export interface Project {
  title: string;
  service: string;
  description: string;
  tags: string[];
  status: "In development" | "Built" | "Live";
  href?: string;
}

export const projects: Project[] = [
  {
    title: "Sales-Recovery Support Agent",
    service: "AI Customer Support & Sales Recovery",
    description:
      "A RAG-and-tool-calling chatbot that answers product questions, checks stock and orders in real time, spots buying signals, and recovers carts before they're abandoned.",
    tags: ["RAG", "Tool-calling", "Memory", "Eval harness"],
    status: "Built",
  },
  {
    title: "Inbox-to-CRM Agent",
    service: "AI Inbox & Lead Management",
    description:
      "Classifies incoming messages, drafts replies, and logs everything to a CRM automatically — a visible, auditable three-step agent chain.",
    tags: ["Agent chain", "Classification", "CRM integration"],
    status: "In development",
  },
  {
    title: "Explainable ATS",
    service: "AI Recruitment Intelligence",
    description:
      "Ranks resumes against a job spec and gives a plain-language reason for every rank — no black-box scoring.",
    tags: ["Explainable AI", "Claude Sonnet 5"],
    status: "In development",
  },
];
