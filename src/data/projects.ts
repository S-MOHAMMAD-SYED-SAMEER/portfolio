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
 * The repository. One monorepo holds all three projects and this portfolio, so
 * the same URL was previously written into each project entry and again into
 * the site footer — four copies of one fact. Exported because the footer's
 * "GitHub" link is the same destination, not a different one.
 */
export const REPO_URL = "https://github.com/S-MOHAMMAD-SYED-SAMEER/ai-business-automation";

export type ProjectId = "p1" | "p2" | "p3";

export interface Project {
  id: ProjectId;
  title: string;
  service: string;
  description: string;
  tags: string[];
  status: "In development" | "Built" | "Live";
  /** In-site case-study page. Only projects with a written case study have one. */
  caseStudyHref?: string;
  /**
   * The portfolio's own interactive demo of this workflow.
   *
   * Deliberately distinct from `demoHref`. This one is a simulation that runs
   * in the visitor's browser on invented data — no account, no backend, no
   * waiting — and it exists because two of the three deployed applications sit
   * behind a sign-in a prospective client will not create. `demoHref` remains
   * the real thing, linked and labelled as such.
   */
  interactiveDemoHref?: string;
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
   * What a visitor needs to know before opening the DEPLOYED application.
   *
   * Two things are worth saying in advance and neither is visible from the
   * button: two of these deployments are behind an operator sign-in, and all
   * three are on free-tier hosting that sleeps, so the first request after a
   * quiet spell is slow. A visitor who waits a minute and then meets a
   * password has been misled by a link that said "Live demo" and nothing else.
   *
   * THE SINGLE SOURCE FOR THIS DISCLOSURE
   *
   * Both surfaces that link to a deployment render this exact string: the
   * homepage card and the interactive demo page. Until Phase 2 the demo pages
   * passed their own `liveDemoNote`, which stated the same fact in different
   * words — two wordings that had to be kept in step by hand, with nothing to
   * catch it when they drifted.
   *
   * It describes the DEPLOYMENT only. Nothing about the portfolio's own
   * in-browser demo belongs here: that demo needs no account and has no cold
   * start, and `DemoShell` says so itself, because it is the only surface for
   * which that is true.
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
    status: "Live",
    caseStudyHref: "/case-study-sales-recovery.html",
    interactiveDemoHref: "/demo-sales-recovery.html",
    demoHref: "https://sales-recovery-agent-j0mc.onrender.com",
    repoHref: REPO_URL,
    screenshot: {
      src: "/images/p1-grounded-answer.png",
      width: 942,
      height: 872,
      alt: "The support agent answering a stock question with a real availability figure, tagged with a badge showing it checked product availability before replying.",
    },
    proof: ["206 tests", "16/16 eval"],
    demoNote:
      "The production demo is open to anyone. First load may take up to a minute while the free-tier hosting wakes up.",
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
    status: "Live",
    caseStudyHref: "/case-study-inbox-crm.html",
    interactiveDemoHref: "/demo-inbox-crm.html",
    demoHref: "https://inbox-crm-agent.onrender.com",
    repoHref: REPO_URL,
    screenshot: {
      src: "/images/p2-inbox-full-workflow.png",
      width: 1415,
      height: 868,
      alt: "An inbound email opened in the dashboard, with the original message beside the details the agent extracted from it and the validation applied to that answer.",
    },
    proof: ["895 tests", "10/10 eval"],
    demoNote:
      "Open to anyone: the deployed dashboard runs in read-only demo mode on synthetic data, so no account is needed to look around. Signing in is only required to approve or change anything. First load may take up to a minute while the free-tier hosting wakes up.",
    featured: true,
  },
  {
    // "Live" now that there is a deployed URL to send someone to. The status
    // word and the demo link move together: this file exists to stop one
    // claiming something the other cannot back up.
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
    status: "Live",
    caseStudyHref: "/case-study-explainable-ats.html",
    interactiveDemoHref: "/demo-explainable-ats.html",
    demoHref: "https://explainable-ats.onrender.com",
    repoHref: REPO_URL,
    screenshot: {
      src: "/images/p3-candidate-ranking.png",
      width: 1900,
      height: 3005,
      alt: "A candidate's assessment showing a 100% evidence score, each requirement judged as met, and the passage quoted from their CV that supports it.",
    },
    proof: ["346 tests", "deterministic scoring"],
    demoNote:
      "The deployed dashboard is behind sign-in, so it needs an account. First load may take up to a minute while the free-tier hosting wakes up.",
    featured: true,
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
 * The four link fields are optional on `Project` and have to stay that way.
 * `status` admits "In development" and "Built", `Projects.tsx` renders a
 * separate card for work that is not finished, and every link it draws is
 * already conditional — so a project with no deployment is a state this
 * portfolio models on purpose. Marking `demoHref` required would force a
 * future in-development project to carry a URL that does not exist yet, which
 * is exactly the kind of claim `projects.ts` exists to prevent.
 *
 * What IS guaranteed is narrower and belongs to the caller: the case-study
 * page for P1 is written for a project that has a deployment, a repository and
 * an interactive demo. Asserting that once, at the top of that page, keeps the
 * page's links plain strings without weakening the shared type.
 *
 * Throws rather than substituting anything. A fallback URL would render a
 * button that goes somewhere wrong, which is worse than a page that refuses to
 * load and names the field it is missing.
 */
export function requiredLink(
  project: Project,
  key: "demoHref" | "repoHref" | "caseStudyHref" | "interactiveDemoHref",
): string {
  const value = project[key];
  if (!value) throw new Error(`Project "${project.id}" has no ${key}`);
  return value;
}
