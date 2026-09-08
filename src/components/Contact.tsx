import {
  EMAIL,
  GITHUB_PROFILE_URL,
  LINKEDIN_URL,
  enquiryGmail,
  enquiryMailto,
} from "../data/contact";
import Section from "./Section";

/**
 * The last thing a prospective client reads.
 *
 * WHY THE COPY IS NO LONGER ABOUT STORES
 *
 * It used to open "Tell me where leads are slipping through" and ask the
 * reader to describe their store — Project 1's pitch, written when Project 1
 * was the offer. Four services now lead here, so a recruiter arriving from the
 * ATS demo, or an operations lead arriving from workflow automation, met a
 * heading addressed to somebody else. The case studies already get this right;
 * this section was the one place that forgot which door the visitor came in
 * through.
 *
 * WHY MAILTO LEADS AND GMAIL FOLLOWS
 *
 * The primary button used to open Gmail's web client, which shows a Google
 * sign-in page to anyone not already signed in there — an Outlook or work
 * address hit a wall on the action styled as the main one. `mailto:` hands off
 * to whatever client the reader actually uses. Gmail stays, clearly labelled,
 * for the people it genuinely suits.
 *
 * Both carry a prefilled subject and body, so a message arrives with the
 * context its sender never had to retype.
 */
export default function Contact() {
  return (
    <Section id="contact" ground="canvas" size="large">
      <div className="rounded-card border border-line bg-surface p-8 shadow-resting sm:p-12">
        <p className="text-eyebrow uppercase text-brand">Contact</p>
        <h2 className="mt-3 max-w-2xl text-section text-balance text-ink">
          Tell me what should be working better
        </h2>
        {/* The four services, named as situations rather than product labels —
            a client recognises their own problem faster than they recognise
            what I have decided to call it. */}
        <p className="mt-4 max-w-2xl text-body text-ink-muted">
          Customer questions that go unanswered too long, enquiries that never
          make it out of the inbox and into the CRM, a screening process that
          cannot explain its own decisions, or a workflow still being done by
          hand every week. Describe the situation and I'll tell you honestly
          whether it is worth automating — and what it would take.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* The hero carries a button with this same wording that only
              scrolls down to this section. This one opens a message. Same
              visible words, two different things to a screen reader hearing
              them in a list, so this one says which it is. */}
          <a
            href={enquiryMailto()}
            aria-label="Let's Work Together: start an email"
            className="inline-flex h-control-lg items-center rounded-control bg-brand px-6 text-small font-semibold text-white shadow-resting hover:bg-brand/90 hover:shadow-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Let's Work Together
          </a>
          <p className="text-small text-ink-muted">
            or{" "}
            <a
              href={enquiryGmail()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 text-ink underline underline-offset-4 hover:text-brand"
            >
              open in Gmail
            </a>
          </p>
        </div>

        {/* The address in full, for anyone who would rather copy it than be
            handed to an application, and the two profiles worth checking me
            against. LinkedIn existed only inside the 3D experience until now. */}
        {/* The three links take a real 44px height below md, where the row
            wraps and a finger needs the room; at md and above they keep the
            22px line they shipped with, so the section height is unchanged on
            desktop. A padded hit box with a negative margin would have been
            invisible in the layout but would have overlapped the line above it
            once the row wrapped. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-small text-ink-muted">
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center max-md:min-h-11 text-ink underline underline-offset-4 hover:text-brand"
          >
            {EMAIL}
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center max-md:min-h-11 underline underline-offset-4 hover:text-ink"
          >
            LinkedIn
          </a>
          {/* The project cards and the footer link to the repository under
              the same word. This one is the account itself. */}
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="inline-flex items-center max-md:min-h-11 underline underline-offset-4 hover:text-ink"
          >
            GitHub
          </a>
        </div>
      </div>
    </Section>
  );
}
