import Section from "./Section";

const EMAIL = "mohammadsyedsameer20@gmail.com";
const COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

export default function Contact() {
  return (
    <Section id="contact" ground="canvas" size="large">
      <div className="rounded-card border border-line bg-surface p-8 shadow-resting sm:p-12">
        <p className="text-eyebrow uppercase text-brand">Contact</p>
        <h2 className="mt-3 max-w-2xl text-section text-balance text-ink">
          Tell me where leads are slipping through
        </h2>
        <p className="mt-4 max-w-xl text-body text-ink-muted">
          Describe your store and what customers keep asking about. I'll tell
          you honestly whether this is worth automating — and what it would take.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={COMPOSE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-control-lg items-center rounded-control bg-brand px-6 text-small font-semibold text-white shadow-resting hover:bg-brand/90 hover:shadow-hover"
          >
            Let's Work Together
          </a>
          <p className="text-small text-ink-muted">
            Or email{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="text-ink underline underline-offset-4 hover:text-brand"
            >
              {EMAIL}
            </a>
          </p>
        </div>
      </div>
    </Section>
  );
}
