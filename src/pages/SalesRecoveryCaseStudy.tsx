import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { projectById, requiredLink } from "../data/projects";
import Screenshot from "../components/Screenshot";
import ArchitectureDiagram from "../components/caseStudy/ArchitectureDiagram";
import ResultsPanel from "../components/caseStudy/ResultsPanel";


/**
 * This page's project, from the canonical data.
 *
 * Everything below that identifies the project — its service name in the
 * heading and all four links — is read from here rather than restated, so this
 * page cannot drift from what the homepage and the interactive demo claim about
 * the same project. `projectById` throws on a bad id, so a typo fails loudly at
 * startup instead of rendering a page with dead buttons.
 */
const PROJECT = projectById("p1");
const DEMO_URL = requiredLink(PROJECT, "demoHref");
const REPO_URL = requiredLink(PROJECT, "repoHref");
const INTERACTIVE_DEMO_HREF = requiredLink(PROJECT, "interactiveDemoHref");

const CAPABILITIES = [
  {
    title: "Knowledge-grounded answers",
    detail:
      "Answers about shipping, returns and products come from the store's own written policies, retrieved per question. Change the policy document and the answers change — no rewriting the assistant.",
  },
  {
    title: "Order status lookup",
    detail:
      "The customer asks where their order is; the agent looks it up and answers with the real status, courier and tracking number rather than a generic reassurance.",
  },
  {
    title: "Product availability lookup",
    detail:
      "Stock questions are answered from live stock data, so the assistant can say what is actually available instead of deflecting to a contact form.",
  },
  {
    title: "Promotion lookup",
    detail:
      "Discount codes are verified before the assistant says anything about them. It cannot invent a code or promise a discount that does not exist.",
  },
  {
    title: "Conversation memory",
    detail:
      "Follow-up questions work. A customer can ask “and which courier was that?” without repeating the order number.",
  },
  {
    title: "Hesitation and buying signals",
    detail:
      "When a customer sounds unsure or worried about price or delivery, the assistant recognises it and responds to that concern — without inventing an incentive to close the sale.",
  },
  {
    title: "Safe handling of unsupported requests",
    detail:
      "Asked something the store has no answer for, it says so honestly instead of improvising a policy. Attempts to talk it out of its instructions are declined.",
  },
];

const STACK = [
  { name: "Node.js + Express", role: "Application server" },
  { name: "React + Tailwind", role: "This portfolio and the demo interface" },
  { name: "Chroma", role: "Vector store for the store's knowledge base" },
  { name: "SQLite", role: "Conversation memory" },
  { name: "Google Gemini", role: "Language model behind the assistant" },
  { name: "Render", role: "Hosting for the running demo" },
];

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

export default function SalesRecoveryCaseStudy() {
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
            An AI support agent that helps online stores answer customer
            questions instantly, recover hesitant buyers, and cut the hours a
            small team spends retyping the same replies.
          </p>
          <div className="flex flex-wrap gap-4 pt-8">
            {/* Leads, because it is the action a reader can take right now: it
                runs in this tab on synthetic data, with no account and no cold
                start. The deployed application is still linked beside it and
                still described as the real thing. */}
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
            The demo runs on free hosting and sleeps when idle — the first
            message can take up to a minute while it wakes up.
          </p>
          <div className="mt-10">
            <Screenshot
              src="/images/p1-grounded-answer.png"
              width={942}
              height={872}
              alt="The support agent answering a stock question with a real availability figure, tagged with a badge showing it checked product availability before replying."
              caption="The running demo. Every reply carries a badge naming the check it ran before answering."
            />
          </div>
        </section>

        {/* 2. BUSINESS PROBLEM */}
        <Section eyebrow="The problem" title="Small stores lose sales in the gaps">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4 text-slate-600">
              <p>
                A small online store gets the same handful of questions every
                day. Where is my order. Is this back in stock. How long does
                delivery take to my country. Can I return it if it does not fit.
              </p>
              <p>
                Individually none of it is dramatic. Together it is two things
                at once: hours of someone's week spent retyping answers that
                already exist in writing, and a queue of customers waiting long
                enough to lose interest.
              </p>
              <p>
                The expensive part is quieter still. A customer who is nearly
                ready to buy, hesitating over price or delivery, gets a slow or
                generic reply — and simply leaves. Nobody logs that as a lost
                sale, because nothing ever happened.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                "The same questions answered by hand, every day",
                "Order, stock and policy questions arriving around the clock",
                "Support time spent on requests that need no judgement",
                "Hesitant buyers going quiet instead of asking again",
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
        <Section eyebrow="The solution" title="An assistant that checks before it answers">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4 text-slate-600">
              <p>
                This is a support assistant that sits on a store's site and
                handles the routine questions end to end — but the point of it
                is what it refuses to do.
              </p>
              <p>
                It does not answer from memory or general knowledge. Before it
                says anything about an order, a product, a promotion or a
                policy, it looks the answer up. If the lookup finds nothing, it
                says it does not know rather than producing something
                convincing.
              </p>
              <p>
                That constraint is the product. A support bot that is confidently
                wrong about a refund window or a delivery date costs a store more
                than having no bot at all.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">
                What that means in practice
              </p>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                <li>Policy answers come from the store's own documents.</li>
                <li>Order and stock answers come from the store's own data.</li>
                <li>
                  Anything it could not verify is not stated — the customer is
                  told honestly.
                </li>
                <li>
                  Every reply shows which checks it ran, so answers can be
                  audited.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 4. KEY CAPABILITIES */}
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

        {/* 5. HOW IT WORKS */}
        <Section eyebrow="How it works" title="One reply, start to finish">
          <ArchitectureDiagram />
        </Section>

        {/* 6. PRODUCT SCREENSHOTS */}
        <Section eyebrow="The product" title="Seeing it work">
          <div className="columns-1 gap-8 sm:columns-2">
            <Screenshot
              src="/images/p1-policy-grounding.png"
              width={936}
              height={867}
              alt="The support agent answering a policy question using the store's own written policy."
              caption="A policy question answered from the store's own documents rather than from the model's general knowledge."
            />
            <Screenshot
              src="/images/p1-order-or-stock-lookup.png"
              width={938}
              height={802}
              alt="The support agent answering a question about an order or product by looking the answer up."
              caption="An order or stock question answered from live data, looked up on the spot rather than guessed."
            />
            <Screenshot
              src="/images/p1-buying-signal-recovery.png"
              width={912}
              height={608}
              alt="The support agent recognising a hesitant buyer and responding to the concern they raised."
              caption="A hesitant buyer. The assistant recognises the hesitation and answers it without inventing a discount."
            />
            <div className="mb-8 break-inside-avoid rounded-lg border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">
                Try these yourself
              </p>
              <p className="mt-2 text-sm text-slate-600">
                The demo runs on fictional store data, so everything is safe to
                poke at. Ask about order 1001, whether the Ceramic Mug is in
                stock, whether code WELCOME10 is valid, how long international
                delivery takes — then try telling it you are still deciding.
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

        {/* 7. TECH STACK */}
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

        {/* 8. VALIDATION / RESULTS */}
        <Section eyebrow="Validation" title="Measured, not just demoed">
          <ResultsPanel />
        </Section>

        {/* 9 + 10. LIVE DEMO AND GITHUB */}
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Try it on your own questions
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              The demo is live and open — no sign-up, nothing to install. Ask it
              something a real customer of yours would ask, and watch which
              checks it runs before it answers.
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
                Talk about your store
              </a>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              Demo data is fictional — the orders, products and discount codes
              are examples, not a real store. First load may take up to a minute
              while the free-tier hosting wakes up.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
