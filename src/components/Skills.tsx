import { skillGroups } from "../data/skills";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {skillGroups.map((group) => (
          <div key={group.category}>
            <h3 className="font-semibold text-slate-900">
              {group.category}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
