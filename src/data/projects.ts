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
  /** Given the full-width featured treatment. Only completed, live work. */
  featured?: boolean;
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
    featured: true,
  },
  {
    title: "Inbox-to-CRM Agent",
    service: "AI Inbox & Lead Management",
    description:
      "Reads incoming business email, matches it against the CRM, drafts a reply and logs the work — while a person approves anything consequential. Nothing is ever sent without that approval.",
    tags: [
      "Human approval gate",
      "Auto-logged to CRM",
      "Prompt-injection contained",
      "Eval-tested",
    ],
    status: "Live",
    caseStudyHref: "/case-study-inbox-crm.html",
    demoHref: "https://inbox-crm-agent.onrender.com",
    repoHref: "https://github.com/S-MOHAMMAD-SYED-SAMEER/ai-business-automation",
    featured: true,
  },
  {
    // "Built", not "Live": it is complete and runnable, and there is no
    // deployed URL to send anyone to. Saying "Live" without a demo link would
    // be the kind of small overstatement this file exists to avoid.
    title: "Explainable ATS",
    service: "AI Recruitment Intelligence",
    description:
      "Ranks candidates against a job spec and explains every placement with the exact sentence from their CV that earned it — so a screening decision can be defended to the person it was made about.",
    tags: [
      "Evidence quoted from the CV",
      "Deterministic scoring",
      "Personal details masked first",
      "Every ranking explained",
    ],
    status: "Built",
    caseStudyHref: "/case-study-explainable-ats.html",
    repoHref: "https://github.com/S-MOHAMMAD-SYED-SAMEER/ai-business-automation",
    featured: true,
  },
];
