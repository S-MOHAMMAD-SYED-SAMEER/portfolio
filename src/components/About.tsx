import Section from "./Section";

// Deliberately three short labels rather than a feature grid — they give the
// paragraph something to resolve into without turning the section into
// another set of cards.
const focus = [
  "Recover lost sales",
  "Automate support work",
  "Build reliable AI systems",
];

export default function About() {
  return (
    <Section id="about" eyebrow="About" title="What I work on" ground="surface">
      <div className="max-w-3xl">
        <p className="text-body text-ink-muted">
          I help small international e-commerce and D2C stores recover lost
          leads and abandoned carts, respond to customers faster, and automate
          the manual work that slows a small team down — using AI systems built
          with production-grade engineering, not demos.
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {focus.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-small text-ink">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 flex-none rounded-pill bg-brand"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
