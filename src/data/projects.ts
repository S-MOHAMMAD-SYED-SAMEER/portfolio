export interface Project {
  title: string;
  service: string;
  description: string;
  tags: string[];
  status: "In development" | "Built" | "Live";
  href?: string;
  /** In-site case-study page. Only projects with a written case study have one. */
  caseStudyHref?: string;
  /** Deployed, publicly reachable demo. Absent means there is nothing to open. */
  demoHref?: string;
  /** Public source repository. */
  repoHref?: string;
  /**
   * The one screenshot the card leads with.
   *
   * A real capture of the running product, which is why the workflow diagram
   * that used to sit here is gone: the diagram existed because there were no
   * screenshots, and keeping both would put two competing visuals on one card.
   *
   * `alt` describes what is actually visible in the image, not what the file
   * is called — two of these three filenames do not match their contents.
   *
   * `width`/`height` are the capture's intrinsic pixels. The CSS decides the
   * rendered box; these tell the browser the real dimensions up front so it can
   * budget the decode rather than discovering a 5.7-megapixel image late.
   */
  screenshot?: { src: string; alt: string; width: number; height: number };
  /**
   * The verified figures shown under the description.
   *
   * Every entry has to be reproducible from the repository — `npm test` in the
   * project's own folder, or its evaluation command. Nothing aspirational and
   * nothing rounded up.
   */
  proof?: string[];
  /**
   * What a visitor needs to know before pressing "Live demo".
   *
   * Two things are worth saying in advance and neither is visible from the
   * button: two of these demos are behind an operator sign-in, and all three
   * are on free-tier hosting that sleeps, so the first request after a quiet
   * spell is slow. A visitor who waits a minute and then meets a password has
   * been misled by a link that said "Live demo" and nothing else.
   *
   * Wording matches the disclosure the case studies already carry, so the two
   * surfaces say the same thing.
   */
  demoNote?: string;
  /** Complete work, shown with the full card treatment. */
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
    screenshot: {
      src: "/images/p1-grounded-answer.png",
      width: 942,
      height: 872,
      alt: "The support agent answering a stock question with a real availability figure, tagged with a badge showing it checked product availability before replying.",
    },
    proof: ["206 tests", "16/16 eval"],
    demoNote: "First load may take up to a minute while the free-tier hosting wakes up.",
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
    screenshot: {
      src: "/images/p2-inbox-full-workflow.png",
      width: 1415,
      height: 868,
      alt: "An inbound email opened in the dashboard, with the original message beside the details the agent extracted from it and the validation applied to that answer.",
    },
    proof: ["827 tests", "10/10 eval"],
    demoNote:
      "The dashboard is behind sign-in, so the demo needs an account. First load may take up to a minute while the free-tier hosting wakes up.",
    featured: true,
  },
  {
    // "Live" now that there is a deployed URL to send someone to. The status
    // word and the demo link move together: this file exists to stop one
    // claiming something the other cannot back up.
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
    status: "Live",
    caseStudyHref: "/case-study-explainable-ats.html",
    demoHref: "https://explainable-ats.onrender.com",
    repoHref: "https://github.com/S-MOHAMMAD-SYED-SAMEER/ai-business-automation",
    screenshot: {
      src: "/images/p3-candidate-ranking.png",
      width: 1900,
      height: 3005,
      alt: "A candidate's assessment showing a 100% evidence score, each requirement judged as met, and the passage quoted from their CV that supports it.",
    },
    proof: ["326 tests", "deterministic scoring"],
    demoNote:
      "The dashboard is behind sign-in, so the demo needs an account. First load may take up to a minute while the free-tier hosting wakes up.",
    featured: true,
  },
];
