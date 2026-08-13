import { projects } from "../data/projects";
import ProjectThumbnail from "./ProjectThumbnail";

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.title}
            className="flex flex-col gap-3 rounded-lg border border-slate-200 p-6"
          >
            {project.thumbnail && <ProjectThumbnail />}
            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {project.status}
            </span>
            <h3 className="text-lg font-semibold text-slate-900">
              {project.title}
            </h3>
            {/* Project 1 is titled by its service, so the eyebrow would just
                repeat the heading — skip it rather than print it twice. */}
            {project.service !== project.title && (
              <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                {project.service}
              </p>
            )}
            <p className="text-sm text-slate-600">{project.description}</p>
            <ul className="flex flex-wrap gap-2 pt-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500"
                >
                  {tag}
                </li>
              ))}
            </ul>
            {/* mt-auto keeps the actions pinned to the bottom so cards of
                differing text length still line their buttons up. */}
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
              {project.caseStudyHref && (
                <a
                  href={project.caseStudyHref}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  View Case Study
                </a>
              )}
              {project.demoHref && (
                <a
                  href={project.demoHref}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400"
                >
                  Live Demo
                </a>
              )}
              {project.repoHref && (
                <a
                  href={project.repoHref}
                  target="_blank"
                  rel="noreferrer"
                  className="px-1 py-2 text-xs font-semibold text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
                >
                  GitHub
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
