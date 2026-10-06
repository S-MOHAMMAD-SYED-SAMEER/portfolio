/**
 * Stable identifier for a project.
 *
 * Every surface that needs *this specific* project asks for it by id. The
 * alternative — matching on a title or a URL — makes any page that looks a
 * project up depend on a string that exists to be displayed or navigated to,
 * so renaming a heading or moving a page silently breaks the lookup. An id
 * has no other job, so nothing else can move it.
 */
/**
 * This portfolio site's own repository.
 *
 * Each of the six projects now links to its own standalone repository via
 * `repoHref` below — they were previously split out of a shared monorepo
 * that also held this portfolio, which is what `REPO_URL` used to point at.
 * It still exists only because the footer's "GitHub repository" link needs
 * one fixed destination, and the most accurate one left for a link with no
 * associated project is this site's own source.
 */
export const REPO_URL = "https://github.com/S-MOHAMMAD-SYED-SAMEER/portfolio";

export type ProjectId = "p1" | "p2" | "p3" | "p4" | "p5" | "p6";

export interface Project {
  id: ProjectId;
  title: string;
  service: string;
  description: string;
  tags: string[];
  status: "In development" | "Built";
  /** In-site case-study page. Only projects with a written case study have one. */
  caseStudyHref?: string;
  /**
   * The portfolio's own interactive demo of this workflow.
   *
   * A simulation that runs in the visitor's browser on invented data — no
   * account, no backend, no waiting. Only some projects have one; for the rest
   * the case study and the repository are the whole presentation.
   */
  interactiveDemoHref?: string;
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
  /** Complete work, shown with the full card treatment. */
  featured?: boolean;
}

export const projects: Project[] = [
  {
    // Titled by the service it sells rather than by its internal project name:
    // a visitor reads what this does for their business before they read what
    // it is called. Matches the fixed service labels in CLAUDE.md.
    id: "p1",
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
    status: "Built",
    caseStudyHref: "/case-study-sales-recovery.html",
    interactiveDemoHref: "/demo-sales-recovery.html",
    repoHref: "https://github.com/S-MOHAMMAD-SYED-SAMEER/sales-recovery-agent",
    screenshot: {
      src: "/images/p1-grounded-answer.png",
      width: 942,
      height: 872,
      alt: "The support agent answering a stock question with a real availability figure, tagged with a badge showing it checked product availability before replying.",
    },
    proof: ["247 tests", "16/16 eval"],
    featured: true,
  },
  {
    id: "p2",
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
    status: "Built",
    caseStudyHref: "/case-study-inbox-crm.html",
    interactiveDemoHref: "/demo-inbox-crm.html",
    repoHref: "https://github.com/S-MOHAMMAD-SYED-SAMEER/inbox-crm-agent",
    screenshot: {
      src: "/images/p2-inbox-full-workflow.png",
      width: 1415,
      height: 868,
      alt: "An inbound email opened in the dashboard, with the original message beside the details the agent extracted from it and the validation applied to that answer.",
    },
    proof: ["895 tests", "10/10 eval"],
    featured: true,
  },
  {
    id: "p3",
    title: "Explainable ATS",
    service: "AI Recruitment Intelligence",
    description:
      "Ranks candidates against a job spec and explains every placement with the exact sentence from their CV that earned it — so a screening decision can be defended to the person it was made about, and the recruiter's decision, with its written reason, is kept alongside it.",
    tags: [
      "Evidence quoted from the CV",
      "Deterministic scoring",
      "Personal details masked first",
      "Recruiter decides, on the record",
    ],
    status: "Built",
    caseStudyHref: "/case-study-explainable-ats.html",
    interactiveDemoHref: "/demo-explainable-ats.html",
    repoHref: "https://github.com/S-MOHAMMAD-SYED-SAMEER/explainable-ats",
    screenshot: {
      src: "/images/p3-candidate-ranking.png",
      width: 1900,
      height: 3005,
      alt: "A candidate's assessment showing a 100% evidence score, each requirement judged as met, and the passage quoted from their CV that supports it.",
    },
    proof: ["389 tests", "deterministic scoring"],
    featured: true,
  },
  {
    // Approved as a fourth flagship project, built and shipped as its own
    // standalone repository outside this monorepo. It has no in-browser
    // interactive demo on this site, so `interactiveDemoHref` stays absent
    // rather than pointing at a page that does not exist.
    id: "p4",
    title: "KnowledgeOS",
    service: "RAG / Knowledge Systems",
    description:
      "Retrieval-grounded answers over internal documents: hybrid search and a local reranker find the evidence, and every citation is checked against it in Python before an answer is shown. A deterministic, credential-free demo replays real precomputed embedding and reranking output through the identical production query pipeline — no API key, no network call.",
    tags: [
      "PostgreSQL + pgvector retrieval",
      "Citation validation",
      "Deterministic, credential-free demo",
      "Docker demo packaging",
    ],
    status: "Built",
    caseStudyHref: "/case-study-knowledgeos.html",
    repoHref: "https://github.com/S-MOHAMMAD-SYED-SAMEER/knowledgeos",
    proof: ["1,135 tests · CI green (4 skipped: need model weights)", "deterministic, credential-free demo"],
    featured: true,
  },
  {
    id: "p5",
    title: "DocIntel",
    service: "Document Intelligence",
    description:
      "Extracts structured data from invoices and purchase orders, validates it deterministically outside the model, scores per-field confidence, and routes anything uncertain to a human review queue. A deterministic, credential-free demo provider replays committed, hand-verified answers through the same production extraction, validation and review pipeline.",
    tags: [
      "FastAPI + PostgreSQL pipeline",
      "Confidence-scored human review",
      "Deterministic, credential-free demo",
      "Docker demo packaging",
    ],
    status: "Built",
    caseStudyHref: "/case-study-docintel.html",
    repoHref: "https://github.com/S-MOHAMMAD-SYED-SAMEER/docintel",
    proof: ["513 tests", "deterministic, credential-free demo"],
    featured: false,
  },
  {
    id: "p6",
    title: "VoiceDesk",
    service: "Voice AI",
    description:
      "An AI phone receptionist: understands the caller, checks and books appointments in a real calendar, and hands off to a human when it should. A browser harness runs the identical dialogue, tool-calling and calendar pipeline with no telephony credential required — offline speech recognition and synthesis by default, bounded by a 300-second session limit and a 20-turn cap so a demo session cannot run unbounded.",
    tags: [
      "Real-time voice + tool-calling",
      "PostgreSQL-backed calendar",
      "Offline STT/TTS demo mode",
      "Docker Compose browser demo",
    ],
    status: "Built",
    caseStudyHref: "/case-study-voicedesk.html",
    repoHref: "https://github.com/S-MOHAMMAD-SYED-SAMEER/voicedesk",
    proof: ["1,661 tests"],
    featured: false,
  },
];

/**
 * The project with this id.
 *
 * Throws rather than returning undefined. The array above is a literal compiled
 * into the bundle, so a miss is not a runtime condition to handle — it is a
 * typo, and it should stop the page loudly at startup instead of quietly
 * rendering a card with no links.
 */
export function projectById(id: ProjectId): Project {
  const found = projects.find((project) => project.id === id);
  if (!found) throw new Error(`No project with id "${id}"`);
  return found;
}

/**
 * A link the caller knows this project has.
 *
 * WHY THIS EXISTS RATHER THAN THE FIELDS BEING REQUIRED
 *
 * The three link fields are optional on `Project` and have to stay that way.
 * `status` admits "In development" and "Built", `Projects.tsx` renders a
 * separate card for work that is not finished, and every link it draws is
 * already conditional — so a project with no interactive demo is a state this
 * portfolio models on purpose. Marking `interactiveDemoHref` required would
 * force a project without one to carry a URL that does not exist, which is
 * exactly the kind of claim `projects.ts` exists to prevent.
 *
 * What IS guaranteed is narrower and belongs to the caller: the case-study
 * page for P1 is written for a project that has a repository and an
 * interactive demo. Asserting that once, at the top of that page, keeps the
 * page's links plain strings without weakening the shared type.
 *
 * Throws rather than substituting anything. A fallback URL would render a
 * button that goes somewhere wrong, which is worse than a page that refuses to
 * load and names the field it is missing.
 */
export function requiredLink(
  project: Project,
  key: "repoHref" | "caseStudyHref" | "interactiveDemoHref",
): string {
  const value = project[key];
  if (!value) throw new Error(`Project "${project.id}" has no ${key}`);
  return value;
}
