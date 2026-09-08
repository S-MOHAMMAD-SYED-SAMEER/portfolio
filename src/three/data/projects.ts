import {
  projectById as canonicalProject,
  REPO_URL,
  type ProjectId as CanonicalId,
} from '../../data/projects.ts'

/**
 * The facts this project shares with the rest of the site.
 *
 * The portfolio's `src/data/projects.ts` is the source of truth for every value
 * another surface also states — title, deployment status, the three live URLs,
 * the test count and the evaluation result. Restating any of them here would
 * make a second copy that drifts silently.
 */
function canonical(id: CanonicalId) {
  const project = canonicalProject(id)

  return {
    title: project.title,
    // The 3D status vocabulary is narrower: it only needs to know whether
    // there is something deployed to open.
    status: (project.demoHref === undefined ? 'demo-pending' : 'live') as ProjectStatus,
    links: {
      demo: project.demoHref ?? null,
      github: REPO_URL,
      caseStudy: project.caseStudyHref ?? null,
    },
    interactiveDemo: project.interactiveDemoHref !== undefined,
  }
}

/**
 * The measured half of `proof`, parsed out of the canonical strings.
 *
 * The portfolio stores these as `["206 tests", "16/16 eval"]`; the 3D panels
 * want a number and a ratio. Parsing rather than re-typing means the two can
 * never disagree, and an unparseable count throws at module load instead of
 * rendering "NaN tests".
 */
function canonicalProof(id: CanonicalId): { tests: number; evaluation: string | null } {
  const project = canonicalProject(id)
  const tests = Number.parseInt(project.proof?.[0] ?? '', 10)
  if (!Number.isFinite(tests)) throw new Error(`Project ${id} has no parseable test count`)

  const ratio = /^[0-9]+\/[0-9]+$/.exec(project.proof?.[1] ?? '')
  return { tests, evaluation: ratio === null ? null : ratio[0] }
}

export type ProjectId = 'p1' | 'p2' | 'p3'

/** Deployment state of a project. */
export type ProjectStatus =
  /** Publicly reachable live demo. */
  | 'live'
  /** Complete and source-available, no public demo deployed yet. */
  | 'demo-pending'

export interface ProjectProof {
  /** Number of automated tests in the project's suite. */
  tests: number
  /**
   * Formal evaluation result, written exactly as the project reports it.
   * `null` when the project has no evaluation harness.
   */
  evaluation: string | null
  /** Other verified engineering properties worth surfacing. */
  properties: string[]
}

export interface ProjectLinks {
  /** Live deployment. `null` until one exists. */
  demo: string | null
  /** Source repository. `null` until the URL is filled in. */
  github: string | null
  /** Long-form write-up. `null` until the URL is filled in. */
  caseStudy: string | null
}

/**
 * What a visitor needs in order to use the live demo.
 *
 * `public-demo` is the only variant that carries credentials, and it exists
 * for an account deliberately created to be shared in public. Nothing that
 * belongs to a real person or a real customer goes in here, and no value is
 * ever guessed: a project with no known access simply leaves `access` unset
 * and the demo link behaves like any other link.
 */
export type ProjectAccess =
  /** Open to anyone with the link. */
  | { kind: 'open' }
  /** Needs an account. The portfolio says so rather than pretending. */
  | { kind: 'sign-in-required'; note?: string }
  /** A shared account made for the demo. Only ever filled in by hand. */
  | { kind: 'public-demo'; username: string; password: string; note?: string }

/**
 * A screenshot of the project actually running.
 *
 * Real captures from the deployed or locally-run application — never a mockup
 * and never an illustration, because a drawing presented as a screenshot
 * misrepresents what the thing looks like.
 *
 * `alt` and `caption` describe only what is visible in the frame. Neither is
 * allowed to claim behaviour the image does not show; the case study is where
 * claims belong, and they are backed by the repository rather than by a
 * picture.
 *
 * The intrinsic size is recorded so the panel can reserve the right box before
 * the file arrives and the text below it never jumps.
 */
export interface ProjectShot {
  /** Served from public/, so root-relative. */
  src: string
  alt: string
  /** One line naming what the visitor is looking at. */
  caption: string
  width: number
  height: number
}

export type ProjectActionEmphasis = 'primary' | 'secondary'

export interface ProjectAction {
  id: 'interactiveDemo' | 'demo' | 'github' | 'caseStudy'
  label: string
  href: string
  emphasis: ProjectActionEmphasis
  /**
   * False for a case study this portfolio hosts itself. It still opens in a
   * new tab — leaving the 3D route mid-visit would drop the visitor's place in
   * the journey — but being same-origin it carries no referrer policy.
   */
  external: boolean
  /** Spoken name, since the visible label is only two words. */
  accessibleName: string
}

/**
 * The long-form case study behind a project.
 *
 * Every field is optional and, right now, every one is absent: none of this
 * is written down anywhere in this repository. The panel renders a section
 * only when it has content, so filling any of these in makes it appear and
 * nothing has to be invented in the meantime.
 */
export interface ProjectCaseStudy {
  /** What was actually wrong before the system existed. */
  problem?: string
  /** How it was tackled. */
  approach?: string
  /** The moving parts, one per line. */
  architecture?: readonly string[]
  /** Engineering decisions worth defending. */
  engineering?: readonly string[]
  /** What changed once it shipped. Only with something real to say. */
  result?: string
}

export interface Project {
  id: ProjectId
  /** Ordinal used for stable ordering and 3D placement in later phases. */
  order: number
  title: string
  /** A few words placing the project, shown above the title. */
  category: string
  shortDescription: string
  status: ProjectStatus
  /**
   * The stack, once it is written down somewhere verifiable. Empty until
   * then — the panel simply omits the section rather than guessing.
   */
  technologies: readonly string[]
  proof: ProjectProof
  /** Evidence that it runs. Empty until a real capture exists. */
  screenshots: readonly ProjectShot[]
  links: ProjectLinks
  /** Absent until written. See `ProjectCaseStudy`. */
  caseStudy?: ProjectCaseStudy
  /** How the demo is reached. Absent while unknown. */
  access?: ProjectAccess
  /**
   * Whether this portfolio hosts an interactive demo of the project.
   *
   * A capability rather than a URL, which is why it is not in `ProjectLinks`:
   * the address is derived from the project's own id, so there is nothing to
   * store and nothing that can point at the wrong place. `links.demo` means
   * something different and must not be confused with it — that is a deployed
   * instance of the real system, reached over the network, and it is what the
   * "Live deployment" action opens.
   *
   * Absent means no demo, which is the state of every project that has not had
   * one built.
   */
  interactiveDemo?: boolean
}

/**
 * What this file authors on its own: the category label, the technology list,
 * the verified properties, the screenshot captions and the access note. None
 * of these appear anywhere else in the site.
 *
 * The values below that DO appear elsewhere — title, status, the live URLs,
 * the test count, the evaluation — are overridden by `PROJECTS` beneath this
 * array, which reads them from the portfolio's canonical project data. They
 * are left in place only so this array still satisfies `Project`; nothing
 * renders them.
 */
const AUTHORED_PROJECTS: readonly Project[] = [
  {
    id: 'p1',
    order: 1,
    title: 'AI Customer Support & Sales Recovery',
    category: 'AI automation',
    technologies: [
      'Node.js',
      'Express',
      'Google Gemini',
      'Anthropic Claude',
      'Chroma',
      'Hugging Face Transformers',
      'SQLite',
      'Render',
    ],
    shortDescription:
      'An AI system that handles customer support conversations and recovers sales that would otherwise be lost.',
    status: 'live',
    proof: {
      tests: 206,
      evaluation: '16/16',
      properties: [
        'Eight guardrail policies enforced in code, not prompt text',
        'Evaluated against the live model, not only mocked responses',
      ],
    },
    screenshots: [
      {
        src: '/images/p1-grounded-answer.png',
        alt: 'The support assistant answering “Is the Ceramic Mug in stock?” with “Yes, the Ceramic Mug is currently in stock with 42 units available.”, tagged “Checked product availability”.',
        caption: 'Every answer names the tool it checked first.',
        width: 942,
        height: 872,
      },
      {
        src: '/images/p1-buying-signal-recovery.png',
        alt: 'A customer writes “I like this but I’m still deciding if I need it.” The assistant declines to answer and offers to connect them with the support team, tagged “Checked store information” and “Noticed: hesitation”.',
        caption: 'Hesitation is noticed — and an answer it cannot back is refused rather than guessed.',
        width: 912,
        height: 608,
      },
    ],
    links: {
      demo: 'https://sales-recovery-agent-j0mc.onrender.com',
      github:
        'https://github.com/S-MOHAMMAD-SYED-SAMEER/ai-business-automation/tree/main/sales-recovery-agent',
      caseStudy:
        'https://github.com/S-MOHAMMAD-SYED-SAMEER/ai-business-automation/blob/main/sales-recovery-agent/PROJECT-1.md',
    },
    access: { kind: 'open' },
  },
  {
    id: 'p2',
    order: 2,
    title: 'AI Inbox & Lead Management',
    category: 'AI automation',
    technologies: [
      'Node.js',
      'TypeScript',
      'Express',
      'Anthropic Claude',
      'SQLite',
      'PostgreSQL',
      'React',
      'Vite',
      'Tailwind CSS',
      'Render',
    ],
    shortDescription:
      'An inbox-to-CRM system that triages incoming mail and moves qualified leads into the CRM.',
    status: 'live',
    proof: {
      tests: 827,
      evaluation: '10/10',
      properties: [
        'No value reaches the database without text quoted from the email',
        'Nothing is ever sent: an approved reply stops at the outbox',
      ],
    },
    screenshots: [
      {
        src: '/images/p2-inbox-full-workflow.png',
        alt: 'An inbound email whose body contains a “SYSTEM: Ignore all previous instructions” block asking the agent to auto-approve the sender. The agent’s reading of it records only a large order and a request to confirm pricing, with most extracted fields marked “Not provided”.',
        caption: 'An instruction injected into the email body is read as text, not obeyed.',
        width: 1415,
        height: 868,
      },
      {
        src: '/images/p2-human-approval.png',
        alt: 'The Approvals screen listing five decisions waiting on a person, each labelled “Consequential” with a confidence score and the rules that fired.',
        caption: 'Anything consequential waits for a person, with the rules that produced it shown.',
        width: 1762,
        height: 752,
      },
    ],
    links: {
      demo: 'https://inbox-crm-agent.onrender.com',
      github:
        'https://github.com/S-MOHAMMAD-SYED-SAMEER/ai-business-automation/tree/main/inbox-crm-agent',
      caseStudy: null,
    },
    access: {
      kind: 'sign-in-required',
      note: 'The dashboard is behind sign-in, so the demo needs an account. Free-tier hosting sleeps when idle — the first request after a quiet spell is slow.',
    },
  },
  {
    id: 'p3',
    order: 3,
    title: 'Explainable ATS',
    category: 'Explainable systems',
    technologies: [
      'Node.js',
      'TypeScript',
      'Express',
      'SQLite',
      'PostgreSQL',
      'React',
      'Vite',
      'Tailwind CSS',
    ],
    shortDescription:
      'An applicant tracking system that scores candidates with logic you can read back and audit.',
    status: 'live',
    proof: {
      tests: 326,
      evaluation: null,
      properties: [
        'Deterministic integer scoring — no floating point in the scoring path',
        'Every citation verified character-for-character against the submitted CV',
        'Protected attributes redacted before the model sees the text',
      ],
    },
    screenshots: [
      {
        src: '/images/p3-decision-audit-trail.png',
        alt: 'A ranked candidate list for a Senior Backend Engineer role. A candidate scoring 71 per cent is placed below one scoring 57 per cent, annotated “Does not meet: PostgreSQL”, and a candidate whose assessment has not finished is listed as “Not assessed yet” rather than hidden.',
        caption: 'Missing an essential outranks a higher score, and the reason sits next to it.',
        width: 1900,
        height: 1690,
      },
    ],
    links: {
      demo: 'https://explainable-ats.onrender.com',
      github:
        'https://github.com/S-MOHAMMAD-SYED-SAMEER/ai-business-automation/tree/main/explainable-ats',
      caseStudy: null,
    },
    // The pipeline also runs in the browser from the project's own source,
    // so the workflow can be stepped through here without leaving the
    // portfolio. The deployment above is the application itself.
    interactiveDemo: true,
  },
] as const

/**
 * The projects the 3D experience renders.
 *
 * Every fact the rest of the site also states is taken from the portfolio's
 * `src/data/projects.ts` and overrides whatever the array above says, so the
 * scene cannot drift from the homepage: one edit to the canonical file moves
 * both. Only the 3D-specific fields survive from the authored entries.
 */
export const PROJECTS: readonly Project[] = AUTHORED_PROJECTS.map((project) => ({
  ...project,
  ...canonical(project.id),
  proof: { ...project.proof, ...canonicalProof(project.id) },
}))

/** Human-readable labels for each status, for use in UI. */
export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Live',
  'demo-pending': 'Demo pending',
}

export function getProject(id: ProjectId): Project | undefined {
  return PROJECTS.find((project) => project.id === id)
}

export function isProjectId(value: string): value is ProjectId {
  return PROJECTS.some((project) => project.id === value)
}

/**
 * The verifiable facts about a project, phrased for display.
 *
 * Built from `proof` rather than written by hand, so nothing can appear here
 * that is not already recorded above.
 */
export function projectHighlights(project: Project): string[] {
  const highlights = [`${project.proof.tests.toLocaleString()} automated tests`]

  if (project.proof.evaluation !== null) {
    highlights.push(`${project.proof.evaluation} on its evaluation suite`)
  }

  return [...highlights, ...project.proof.properties]
}

/**
 * The actions a project can actually offer.
 *
 * Built from the links that exist, so a missing URL produces no button at
 * all rather than one that goes nowhere. The demo leads because it is the
 * thing a visitor most wants; source and write-up follow.
 */
export function projectActions(project: Project): ProjectAction[] {
  const candidates: (ProjectAction | null)[] = [
    project.interactiveDemo !== true
      ? null
      : {
          id: 'interactiveDemo',
          label: 'Try interactive demo',
          // The portfolio's own interactive demo page for this project.
          href: canonicalProject(project.id).interactiveDemoHref ?? '/',
          emphasis: 'primary',
          external: false,
          accessibleName: `Open the interactive demo of ${project.title}`,
        },
    project.links.demo === null
      ? null
      : {
          id: 'demo',
          label: 'Live demo',
          href: project.links.demo,
          emphasis: 'primary',
          external: true,
          accessibleName: `Open the live demo for ${project.title} in a new tab`,
        },
    project.links.github === null
      ? null
      : {
          id: 'github',
          label: 'GitHub',
          href: project.links.github,
          emphasis: 'secondary',
          external: true,
          accessibleName: `Open the source for ${project.title} on GitHub in a new tab`,
        },
    caseStudyAction(project),
  ]

  return candidates.filter((action): action is ProjectAction => action !== null)
}

/**
 * Where "Case study" points.
 *
 * A published write-up wins when one exists — P1 has one, and a document the
 * author wrote about his own project beats anything assembled here. Where none
 * exists the portfolio hosts the case study itself on a shareable per-project
 * URL, rather than pointing at a README and calling that a write-up.
 *
 * A project with neither gets no action, which is why this returns null.
 */
function caseStudyAction(project: Project): ProjectAction | null {
  const href = project.links.caseStudy
  if (href === null) return null

  return {
    id: 'caseStudy',
    label: 'Case study',
    href,
    emphasis: 'secondary',
    // The case study is a page this portfolio serves itself, so it is not an
    // external destination. It still opens in a new tab — leaving the 3D page
    // tears down the scene — which is why the spoken name still says so.
    external: !href.startsWith('/'),
    accessibleName: `Read the case study for ${project.title} in a new tab`,
  }
}

export interface CaseStudySection {
  id: string
  title: string
  body: string | readonly string[]
}

/**
 * The case-study sections that actually have content.
 *
 * Returning only populated sections is what keeps the detail view free of
 * empty headings — there is no "coming soon" state, a section either says
 * something or is not there.
 */
export function caseStudySections(project: Project): CaseStudySection[] {
  const study = project.caseStudy
  if (study === undefined) return []

  const candidates: CaseStudySection[] = [
    { id: 'problem', title: 'The problem', body: study.problem ?? '' },
    { id: 'approach', title: 'The approach', body: study.approach ?? '' },
    { id: 'architecture', title: 'System', body: study.architecture ?? [] },
    { id: 'engineering', title: 'Engineering', body: study.engineering ?? [] },
    { id: 'result', title: 'Result', body: study.result ?? '' },
  ]

  return candidates.filter((section) =>
    typeof section.body === 'string' ? section.body.length > 0 : section.body.length > 0,
  )
}

export function projectById(id: ProjectId): Project | undefined {
  return PROJECTS.find((project) => project.id === id)
}
