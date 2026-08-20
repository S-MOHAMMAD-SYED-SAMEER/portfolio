import { skillGroups } from "../data/skills";
import Section from "./Section";

export default function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Capabilities"
      title="What I can build for you"
      ground="canvas"
    >
      <div className="grid gap-x-10 md:grid-cols-3">
        {skillGroups.map((group, index) => (
          <div
            key={group.outcome}
            /* Stacked on mobile, the three areas otherwise run together into
               one long block of documentation. A rule and real breathing room
               between them makes each a discrete, scannable unit; on md+ the
               columns already separate themselves, so both are removed. */
            className={
              index > 0
                ? "mt-10 border-t border-line pt-10 md:mt-0 md:border-t-0 md:pt-0"
                : ""
            }
          >
            <h3 className="text-subhead text-balance text-ink">
              {group.outcome}
            </h3>
            <p className="mt-3 text-small text-ink-muted">{group.detail}</p>
            {/* Technologies wrap inline on mobile — a stacked list of four
                items here is most of what made the section feel long — and
                return to a stacked list on md+ where the column is narrow. */}
            <ul className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-line pt-4 md:block md:space-y-1.5">
              {group.technologies.map((technology, technologyIndex) => (
                <li key={technology} className="text-meta text-ink-muted">
                  {technologyIndex > 0 && (
                    <span aria-hidden="true" className="mr-2 md:hidden">
                      ·
                    </span>
                  )}
                  {technology}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
