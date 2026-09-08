import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { projectById, requiredLink } from "../data/projects";
import Screenshot from "../components/Screenshot";
import InboxToCrmFlow from "../components/caseStudy/InboxToCrmFlow";
import ResultsPanel, { type Result } from "../components/caseStudy/ResultsPanel";


/**
 * This page's project, from the canonical data.
 *
 * Everything below that identifies the project — its service name in the
 * heading and all four links — is read from here rather than restated, so this
 * page cannot drift from what the homepage and the interactive demo claim about
 * the same project. `projectById` throws on a bad id, so a typo fails loudly at
 * startup instead of rendering a page with dead buttons.
 */
const PROJECT = projectById("p2");
const DEMO_URL = requiredLink(PROJECT, "demoHref");
const REPO_URL = requiredLink(PROJECT, "repoHref");
const INTERACTIVE_DEMO_HREF = requiredLink(PROJECT, "interactiveDemoHref");

const CAPABILITIES = [
  {
    title: "Reads what was actually asked",
    detail:
      "Pulls the request, the company, the people and the specifics out of an email — and can point at the sentence each one came from. Anything it cannot point at is dropped rather than invented.",
  },
  {
    title: "Matches it to your existing records",
    detail:
      "Works out who the sender is in your CRM by email address, company domain and name. When two records are too close to call, it says so instead of choosing.",
  },
  {
    title: "Proposes the work, visibly",
    detail:
      "Which record to create or update, which task to open, whether a reply is warranted — shown as a plan you read before anything happens.",
  },
  {
    title: "Drafts the reply for you",
    detail:
      "Writes the covering message where one is warranted. You can approve it as written, edit the wording first, or reject it with a reason that stays on the record.",
  },
  {
    title: "Escalates instead of guessing",
    detail:
      "Low confidence, missing information, an ambiguous match or a suspicious email each route to a person, with a stated reason rather than a silent stall.",
  },
  {
    title: "Keeps a record of everything",
    detail:
      "Who approved what, when, what the records looked like before and after, and why each rule fired. Months later, a decision can still be explained.",
  },
];

const STACK = [
  { name: "Node.js + TypeScript", role: "Application server" },
  { name: "React + Tailwind", role: "This portfolio and the dashboard" },
  { name: "Claude", role: "Reads the email and drafts the reply" },
  { name: "SQLite / PostgreSQL", role: "Records, plans, approvals and audit trail" },
  { name: "Render", role: "Hosting for the running demo" },
];

const RESULTS: Result[] = [
  {
    figure: "827",
    label: "Automated tests passing",
    detail: "694 covering the server and its safety layers, 133 covering the dashboard.",
  },
  {
    figure: "10 / 10",
    label: "Evaluation cases passing",
    detail: "A fixed set of inbound emails the whole pipeline is graded against, end to end.",
  },
  {
    figure: "0",
    label: "Invented details",
    detail:
      "No field in the evaluation was filled with a value the email did not actually contain.",
  },
  {
    figure: "100%",
    label: "Suspicious emails contained",
    detail:
      "Every email in the evaluation carrying hidden instructions was caught and routed to a person.",
  },
];

const RESULTS_CAPTION =
  "These are engineering results from this project's own test and evaluation suites, measured on a fixed set of example emails and a fictional CRM. They are not customer results — the agent has not yet been run against a real mailbox — and a fixed scenario set is a rigorous smoke test, not proof of accuracy across everything a real inbox might contain.";

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-6 py-14 sm:py-16">
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function InboxToCrmCaseStudy() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        {/* This is the longest page on the site; skipping the header matters
            more here than anywhere else. */}
        <SkipLink />
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <a href="/#projects" className="text-sm font-semibold text-slate-900">
            ← AI Business Automation
          </a>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              GitHub
            </a>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Live Demo
            </a>
          </div>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        {/* 1. HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-4 pt-16 sm:pt-20">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
            Case Study — Live Project
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold text-slate-900 sm:text-5xl">
            {PROJECT.service}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            Turns the enquiries sitting in your inbox into tracked records with
            drafted replies — so nothing falls through the cracks, and nothing
            goes out in your name without your approval.
          </p>
          <div className="flex flex-wrap gap-4 pt-8">
            {/* Leads, because the deployed dashboard below is behind a sign-in
                and this is not: it runs in this tab on synthetic data, with no
                account and no cold start. */}
            <a
              href={INTERACTIVE_DEMO_HREF}
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Try interactive demo
            </a>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Try the Live Demo
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              View on GitHub
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            The demo runs on free hosting and sleeps when idle — the first page
            can take up to a minute while it wakes up.
          </p>
          <div className="mt-10">
            <Screenshot
              src="/images/p2-inbox-full-workflow.png"
              width={1415}
              height={868}
              alt="An inbound email opened in the dashboard, with the original message beside the details the agent extracted from it and the validation applied to that answer."
              caption="An email opened up: the original message, what the agent took from it, and the checks run on that answer before any of it was stored."
            />
          </div>
        </section>

        {/* 2. BUSINESS PROBLEM */}
        <Section eyebrow="The problem" title="The enquiry nobody got back to">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4 text-slate-600">
              <p>
                A serious enquiry arrives on a Friday afternoon. It gets read,
                half-answered in someone's head, and left in the inbox to deal
                with properly on Monday. By Monday there are forty more.
              </p>
              <p>
                The work that should have followed — logging the company,
                recording what they asked for, opening a task so somebody
                actually chases it — is the work that gets skipped first. It is
                nobody's job specifically, and it is invisible when it does not
                happen.
              </p>
              <p>
                The cost is not the admin. It is the enquiry that was real, was
                winnable, and simply never got a reply. Nobody records that as a
                lost deal, because from the inside it looks like nothing
                happened at all.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                "Enquiries read once and never actioned",
                "CRM records that only get written when someone remembers",
                "Follow-ups that depend on one person's memory",
                "No reliable answer to “what happened with that lead?”",
              ].map((point) => (
                <li
                  key={point}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* 3. SOLUTION */}
        <Section
          eyebrow="The solution"
          title="It does the reading and the paperwork. You keep the decisions."
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4 text-slate-600">
              <p>
                This reads every inbound enquiry, works out what is being asked
                and who it is from, matches it against the records you already
                have, and proposes exactly what should happen next — the record
                to update, the task to open, the reply to send.
              </p>
              <p>
                Then it stops and shows you. Anything consequential waits for a
                person to say yes, and until someone does, nothing has been
                changed and nothing has been sent.
              </p>
              <p>
                That pause is the product. An assistant that quietly emailed your
                customers on your behalf would be a liability no matter how good
                its writing was.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">
                What that means in practice
              </p>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                <li>Every enquiry is logged the moment it arrives.</li>
                <li>
                  The proposed changes are shown next to what your records say
                  now, before anything is applied.
                </li>
                <li>
                  You approve, edit the wording, or reject with a reason — and
                  the reason stays on the record.
                </li>
                <li>
                  When the assistant is unsure, it hands the email to a person
                  rather than picking an answer.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 4. WHY THE APPROVAL GATE MATTERS */}
        <Section
          eyebrow="The safety model"
          title="Nothing goes out in your name without your approval"
        >
          <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6 sm:p-8">
            <p className="max-w-3xl text-base text-indigo-900">
              Most of the risk in automating an inbox is not that the assistant
              writes something clumsy. It is that it writes something clumsy{" "}
              <em>and sends it</em>, to a customer, signed as you — and you find
              out afterwards.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "It waits by default",
                  detail:
                    "A new setup is configured so every plan needs a person. Nothing runs on its own unless you deliberately allow it to.",
                },
                {
                  title: "You see the plan first",
                  detail:
                    "The proposed changes are shown against your current records, and the drafted reply in full, before any of it is applied.",
                },
                {
                  title: "The check is re-run at execution",
                  detail:
                    "Approval is verified again from the stored record at the moment work runs — not from the screen that was clicked.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-md border border-indigo-200 bg-white p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-sm text-indigo-800">
              In this demo, outbound sending is switched off entirely. An
              approved reply is written, recorded, and held — the outbox shows it
              as <strong>suppressed</strong>. You can watch the whole process run
              end to end knowing that no message can reach anyone.
            </p>
          </div>
        </Section>

        {/* 5. HOW THE WORKFLOW WORKS */}
        <Section
          eyebrow="How it works"
          title="One email, from arrival to done"
        >
          <InboxToCrmFlow />
        </Section>

        {/* 6. KEY CAPABILITIES */}
        <Section eyebrow="Capabilities" title="What it actually does">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((capability) => (
              <div
                key={capability.title}
                className="rounded-lg border border-slate-200 p-5"
              >
                <h3 className="text-sm font-semibold text-slate-900">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {capability.detail}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 7. SAFETY / RELIABILITY */}
        <Section
          eyebrow="Reliability"
          title="What happens when something goes wrong"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "An email tries to give the assistant orders",
                detail:
                  "Some senders hide instructions in an email aimed at the AI reading it — telling it to ignore its rules or approve itself. A dedicated check runs on every email before the AI is asked anything, so catching it does not depend on the AI noticing. Anything flagged goes to a person, and each finding quotes the text it found.",
              },
              {
                title: "The assistant is not sure who the sender is",
                detail:
                  "Two records that are too close to call do not get a coin toss. The email is routed to a person with the candidates and their scores shown, so the choice is made by someone who knows the account.",
              },
              {
                title: "Something fails halfway through",
                detail:
                  "Approved work is applied in one transaction: it either all lands or none of it does. There is no state where the task was created but the record was never updated.",
              },
              {
                title: "The same approval is submitted twice",
                detail:
                  "Each action carries an identity key, so running it again does not duplicate the record, the task, or the reply.",
              },
              {
                title: "An approval sits too long",
                detail:
                  "Approvals carry a deadline. One that outlives its window is swept back to human review rather than remaining quietly executable days later.",
              },
              {
                title: "The AI writes something it should not",
                detail:
                  "Drafted replies pass deterministic checks before they can be approved at all. The AI is also asked to write the message only after the plan is already final — it cannot add an action, raise its own permissions, or remove the need for approval.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 8. PRODUCT SCREENSHOTS */}
        <Section eyebrow="The product" title="Seeing it work">
          <div className="columns-1 gap-8 sm:columns-2">
            <Screenshot
              src="/images/p2-human-approval.png"
              width={1762}
              height={752}
              alt="The human approval step in the Inbox-to-CRM agent, where a proposed plan waits for a person."
              caption="The approval step. Anything consequential stops here and waits for a person to say yes."
            />
            <Screenshot
              src="/images/p2-approved-actions.png"
              width={1852}
              height={767}
              alt="The actions that were applied after a person approved the proposed plan."
              caption="What was carried out once approval was given — applied together, with a record of every change."
            />
            <Screenshot
              src="/images/p2-crm-deals-pipeline.png"
              width={1822}
              height={870}
              alt="The CRM deals pipeline in the Inbox-to-CRM dashboard."
              caption="The CRM the agent writes into — the records an enquiry becomes, rather than a note in someone's inbox."
            />
            <Screenshot
              src="/images/p2-email-to-crm-workflow.png"
              width={1900}
              height={4319}
              alt="The full path an email takes through the agent, from the message arriving to the records it becomes."
              caption="The whole path end to end, from the email arriving to the records it becomes. Top of a much longer page."
            />
            <div className="mb-8 break-inside-avoid rounded-lg border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">
                Try it yourself
              </p>
              <p className="mt-2 text-sm text-slate-600">
                The demo runs on a fixed set of example emails and a fictional
                CRM, so everything is safe to poke at. Run the emails through,
                open one that is waiting on approval, read what it proposes — and
                approve or reject it and watch what changes.
              </p>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Open the demo
              </a>
            </div>
          </div>
        </Section>

        {/* 9. TECH STACK */}
        <Section eyebrow="Built with" title="Technology">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STACK.map((item) => (
              <div
                key={item.name}
                className="rounded-lg border border-slate-200 px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">{item.role}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 10. VALIDATION / RESULTS */}
        <Section eyebrow="Validation" title="Measured, not just demoed">
          <ResultsPanel results={RESULTS} caption={RESULTS_CAPTION} />
        </Section>

        {/* 11. CLOSING — DEMO, GITHUB, CONTACT */}
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-slate-900">
              See it run on a real inbox&apos;s worth of work
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              The demo is live and open — no sign-up, nothing to install. Send
              the emails through, read what it proposes, and approve or reject it
              yourself.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Launch the Live Demo
              </a>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
              >
                Read the Source on GitHub
              </a>
              <a
                href="/#contact"
                className="rounded-md px-4 py-3 text-sm font-semibold text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
              >
                Talk about your inbox
              </a>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              The demo works from a fixed set of example emails and a fictional
              CRM — it is not connected to a live mailbox, and outbound sending
              is switched off, so no message can reach anyone. First load may
              take up to a minute while the free-tier hosting wakes up.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
