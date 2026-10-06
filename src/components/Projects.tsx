import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";
import Section from "./Section";

/**
 * Marks the current history entry as the Projects section before a case-study
 * link is followed.
 *
 * A visitor scrolls to Projects, opens a case study, and presses Back — and
 * lands at the top of the homepage, because the entry they left was plain `/`.
 * The section they were reading is nowhere in the URL, so the browser has
 * nothing to return them to.
 *
 * `replaceState` edits the entry they are standing on rather than adding one.
 * It does not navigate, does not scroll, and does not fire `hashchange`, so
 * clicking the link behaves exactly as it did — but the entry Back returns to
 * is now `/#projects`, and the browser's own hash handling puts them back where
 * they were. No scroll positions are stored and no timers are involved.
 */
function markProjectsAsOrigin() {
  window.history.replaceState(null, "", "#projects");
}

export default function Projects() {
  const complete = projects.filter((project) => project.featured);
  const more = projects.filter((project) => !project.featured);

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Working systems, not concepts"
      intro="Six systems, each built end to end, tested and documented, with the source on GitHub. Four are shown in full below; three of the six also have an interactive demo you can try in the browser."
      ground="surface"
      size="large"
    >
      <div className="flex flex-col gap-8">
        {/* A true 2x2: four featured cards, two columns from md up, one
            column on phones. The rest live on the full catalog page below,
            so this grid never has to grow a third column to fit a fifth or
            sixth card. */}
        <div className="grid gap-6 md:grid-cols-2">
          {complete.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              onLinkClick={markProjectsAsOrigin}
            />
          ))}
        </div>

        {/* Named rather than hardcoded: the titles come from whichever
            projects are not in `complete` above, so this line cannot drift
            out of step with the data the way a written-out "DocIntel,
            VoiceDesk" string could. */}
        {more.length > 0 && (
          <p className="text-body text-ink-muted">
            +{more.length} more · {more.map((project) => project.title).join(", ")}{" "}
            ·{" "}
            <a
              href="/projects.html"
              className="font-semibold text-ink underline underline-offset-4 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              View all projects →
            </a>
          </p>
        )}
      </div>
    </Section>
  );
}
