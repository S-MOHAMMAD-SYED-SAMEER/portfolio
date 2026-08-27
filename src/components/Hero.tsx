import { projects } from "../data/projects";

// Points at the case study rather than straight at the deployed demo: a
// first-time visitor gets the context — problem, capabilities, validation —
// before meeting a free-tier cold start. The case study's own hero carries
// the direct "Try the Live Demo" CTA, as does the project card below.
//
// It selects the first project that has BOTH a case study to read and a live
// demo to try, which is what keeps the "Live demo" label above it true. A
// project with a case study but nothing deployed would make that label a lie,
// and picking merely the first case study would do exactly that as soon as a
// second one is written.
const featuredCaseStudy = projects.find(
  (project) => project.caseStudyHref && project.demoHref,
);

// Engineering validation, deliberately framed as such. These describe this
// project's own test and evaluation suites — they are not customer results,
// and the labels say so rather than leaving a visitor to assume otherwise.
// `compact` is the same fact phrased for the single secondary line these
// collapse into on mobile; `figure`/`label` are the two-line desktop form.
const validation = [
  {
    figure: "206 tests",
    label: "Automated engineering validation",
    compact: "206 automated tests",
  },
  {
    figure: "16/16 eval",
    label: "Fixed scenario evaluation",
    compact: "16/16 evaluation cases",
  },
];

export default function Hero() {
  return (
    <section id="top" className="bg-canvas">
      {/* Mobile padding and internal gaps are tightened; every sm: value is
          unchanged, so the desktop hero is exactly as reviewed. */}
      <div className="mx-auto max-w-5xl px-6 pb-14 pt-14 sm:pb-24 sm:pt-28">
        <p className="text-eyebrow uppercase text-brand">
          AI Automation Engineer
        </p>
        <h1 className="mt-4 max-w-3xl text-display-sm text-balance text-ink sm:mt-5 sm:text-display">
          Recover lost leads and cut manual work with AI systems built for
          e-commerce.
        </h1>
        <p className="mt-5 max-w-2xl text-body text-ink-muted sm:mt-6">
          I build AI customer support, sales-recovery, and workflow automation
          for small international e-commerce and D2C stores — outcomes, not AI
          features.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
          <a
            href="#contact"
            className="inline-flex h-control-lg items-center rounded-control bg-brand px-6 text-small font-semibold text-white shadow-resting hover:bg-brand/90 hover:shadow-hover"
          >
            Let's Work Together
          </a>
          <a
            href="#projects"
            className="inline-flex h-control-lg items-center rounded-control border border-line-strong px-6 text-small font-semibold text-ink hover:border-ink-muted"
          >
            View Projects
          </a>
        </div>

        {/* Proof row. The featured project carries the emphasis — it is the
            only item a visitor can act on, and the only one that means anything
            to a non-technical store owner. The two figures beside it are
            quieter by design.

            The card names the project and offers both destinations rather than
            being one big link: its label used to read "Live demo" while the
            click opened the case study, which is a small promise the card did
            not keep. Two links means the container cannot be an anchor itself —
            nested anchors are invalid — so it is a plain div, and the hover
            lift came off with it rather than suggesting a click that does
            nothing. */}
        <div className="mt-10 grid gap-4 border-t border-line pt-6 sm:mt-14 sm:grid-cols-3 sm:pt-8">
          <div className="rounded-card border border-line bg-surface p-5 shadow-resting sm:col-span-1">
            <p className="text-eyebrow uppercase text-brand">Featured project</p>
            <p className="mt-2 text-subhead text-ink">
              {featuredCaseStudy?.title}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
              <a
                href={featuredCaseStudy?.caseStudyHref}
                className="group text-small font-semibold text-ink underline-offset-4 hover:underline"
              >
                View case study{" "}
                <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href={featuredCaseStudy?.demoHref}
                target="_blank"
                rel="noreferrer"
                className="group text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Live demo{" "}
                <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* On mobile these collapse into one quiet secondary line beneath the
              demo card; `sm:contents` hands the two items straight back to the
              grid at wider widths, so the desktop layout needs no duplicate
              markup. */}
          <div className="flex flex-wrap items-baseline gap-x-2 px-1 sm:contents">
            {validation.map((item, index) => (
              <div
                key={item.figure}
                className="flex items-baseline gap-2 sm:block sm:p-5"
              >
                {index > 0 && (
                  <span aria-hidden="true" className="text-ink-muted sm:hidden">
                    ·
                  </span>
                )}
                <p className="text-small text-ink-muted sm:text-eyebrow sm:uppercase">
                  <span className="sm:hidden">{item.compact}</span>
                  <span className="hidden sm:inline">{item.figure}</span>
                </p>
                <p className="hidden text-small text-ink-muted sm:mt-2 sm:block">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
