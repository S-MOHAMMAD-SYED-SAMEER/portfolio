import { projects } from "../data/projects";

// SELECTED WORK — proof, not a promotion.
//
// This row used to be one card promoting Project 1 beside two loose figures.
// That repeated a project the Projects section shows in full a screen later,
// and it said nothing about the other two systems existing at all. The job of
// the row is to answer, in the first few seconds, "has this person actually
// built things?" — so it now names all three with the one number that is
// hardest to fake and easiest to check.
//
// Everything below is derived from the project data rather than restated here,
// so a figure cannot drift out of step with the card that shows it. The counts
// themselves come from `npm test` in each project's own folder.

const selected = projects.filter((project) => project.featured);

/** The first proof entry is the test count; the rest belong on the card. */
function testCount(proof: string[] | undefined): string {
  return proof?.[0] ?? "";
}

// Two independent facts, each counted from the field that establishes it.
//
// The previous version derived the second as `total − live`, which was only
// ever correct while some project lacked a deployment. All three are deployed
// now, so that subtraction reports "0 built" — true arithmetic about the wrong
// quantity. What is actually worth saying is that every one of them can also be
// tried here, in the browser, with no account and no cold start.
const liveCount = selected.filter((project) => project.demoHref).length;
const interactiveCount = selected.filter(
  (project) => project.interactiveDemoHref,
).length;

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
          {/* The 3D experience, which otherwise has no way in.
              It lives at its own page and was reachable only by typing the
              URL — a visitor had to already know it existed. Placed here
              rather than in the nav because the nav's link list is hidden
              below 640px, and this is the one thing on the page a client is
              unlikely to guess at.

              A plain same-origin link: the page is a separate document, so
              there is nothing to intercept, and it works with JavaScript off.
              The arrow marks it as leaving this page, unlike the two anchors
              beside it which scroll within it. */}
          <a
            href="/3d.html"
            className="group inline-flex h-control-lg items-center gap-2 rounded-control border border-line-strong px-6 text-small font-semibold text-ink hover:border-ink-muted"
          >
            Explore 3D Portfolio
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>

        {/* SELECTED WORK. Three systems, named, with the number behind each.
            A visitor who reads nothing else should leave knowing three
            different things were built and that each one is tested. */}
        <div className="mt-10 border-t border-line pt-6 sm:mt-14 sm:pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-eyebrow uppercase text-brand">Selected work</p>
            {/* Stated plainly rather than implied. All three are deployed, and
                all three also have an interactive demo on this site that needs
                no account — which is the one a visitor can act on immediately. */}
            <p className="text-meta text-ink-muted">
              {liveCount} live · {interactiveCount} interactive demos
            </p>
          </div>

          <p className="mt-3 text-body text-ink-muted">
            Three AI systems built, tested and documented.
          </p>

          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {selected.map((project) => (
              // The figure and the name it belongs to are tightened into one
              // block: the gap between them is smaller than the gap between
              // cards, and the name is a step larger so it reads as the other
              // half of a sentence rather than as a caption floating beneath a
              // number. Figure stays on top so the three counts line up across
              // the row whatever length the names are.
              <li
                key={project.title}
                className="rounded-card border border-line bg-surface p-4"
              >
                <p className="text-subhead leading-tight text-ink">
                  {testCount(project.proof)}
                </p>
                <p className="mt-0.5 text-small leading-snug text-balance text-ink-muted">
                  {project.title}
                </p>
              </li>
            ))}
          </ul>

          <a
            href="#projects"
            className="group mt-2 -my-3 inline-flex py-3 text-small font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            View projects{" "}
            <span
              aria-hidden="true"
              className="ml-1 inline-block transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
