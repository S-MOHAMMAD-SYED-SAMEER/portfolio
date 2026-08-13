export interface Project {
  title: string;
  service: string;
  description: string;
  tags: string[];
  status: "In development" | "Built" | "Live";
  href?: string;
  /** In-site case-study page. Only projects with a written case study have one. */
  caseStudyHref?: string;
  /** Deployed, publicly reachable demo. */
  demoHref?: string;
  /** Public source repository. */
  repoHref?: string;
  /** Marks the project as having a thumbnail illustration on its card. */
  thumbnail?: "salesRecovery";
}

export const projects: Project[] = [
  {
    // Titled by the service it sells rather than by its internal project name:
    // a visitor reads what this does for their business before they read what
    // it is called. Matches the fixed service labels in CLAUDE.md.
    title: "AI Customer Support & Sales Recovery",
    service: "AI Customer Support & Sales Recovery",
    description:
      "An AI support agent that helps online stores answer customer questions, recover hesitant buyers, and reduce repetitive support work.",
    tags: [
      "Knowledge-grounded answers",
      "Order & stock lookup",
      "Buying-signal detection",
      "Eval-tested",
    ],
    status: "Live",
    caseStudyHref: "/case-study-sales-recovery.html",
    demoHref: "https://sales-recovery-agent-j0mc.onrender.com",
    repoHref: "https://github.com/S-MOHAMMAD-SYED-SAMEER/ai-business-automation",
    thumbnail: "salesRecovery",
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
