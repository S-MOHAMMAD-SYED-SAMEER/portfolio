import { projects } from "../data/projects";

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
            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {project.status}
            </span>
            <h3 className="text-lg font-semibold text-slate-900">
              {project.title}
            </h3>
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
              {project.service}
            </p>
            <p className="text-sm text-slate-600">{project.description}</p>
            <ul className="mt-auto flex flex-wrap gap-2 pt-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
