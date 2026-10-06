import { useMemo, useState } from "react";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { projects, type Project } from "../data/projects";

type Filter = "All" | "Agents" | "RAG" | "Document AI" | "Voice";

const FILTERS: Filter[] = ["All", "Agents", "RAG", "Document AI", "Voice"];

/**
 * Which filter chips a project answers to, derived from the `service` field
 * `projects.ts` already carries rather than a new category field invented for
 * this page.
 */
function matches(project: Project, filter: Filter): boolean {
  if (filter === "All") return true;
  if (filter === "RAG") return project.service.includes("RAG");
  if (filter === "Document AI") return project.service.includes("Document Intelligence");
  if (filter === "Voice") return project.service.includes("Voice");
  // "Agents": the three customer-facing, tool-calling systems — everything
  // that is not one of the three specialised categories above.
  return (
    !project.service.includes("RAG") &&
    !project.service.includes("Document Intelligence") &&
    !project.service.includes("Voice")
  );
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = useMemo(() => projects.filter((project) => matches(project, filter)), [filter]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur">
        <SkipLink />
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <a href="/home.html" className="text-small font-semibold text-ink">
            ← Home
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/services.html"
              className="text-small font-semibold text-ink-muted hover:text-ink"
            >
              Services
            </a>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="mx-auto max-w-5xl px-6 pb-4 pt-16 sm:pt-20">
          <p className="text-eyebrow uppercase text-brand">Projects</p>
          <h1 className="mt-4 max-w-3xl text-display-sm text-balance text-ink sm:text-display">
            All six systems
          </h1>
          <p className="mt-6 max-w-2xl text-body text-ink-muted">
            Every system built, in one place. All six are complete,
            source-available and documented; three of them also have an
            interactive demo you can try in the browser.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div
            role="group"
            aria-label="Filter projects"
            className="flex flex-wrap gap-2 border-b border-line pb-8"
          >
            {FILTERS.map((option) => {
              const active = option === filter;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={active}
                  className={
                    active
                      ? "rounded-pill bg-brand px-4 py-2 text-small font-semibold text-white"
                      : "rounded-pill border border-line-strong px-4 py-2 text-small font-semibold text-ink-muted hover:border-ink-muted hover:text-ink"
                  }
                >
                  {option}
                </button>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <p className="mt-10 text-body text-ink-muted">
              No projects match this filter.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {visible.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
