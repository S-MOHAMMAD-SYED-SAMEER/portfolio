/**
 * How to reach me, and how a message gets started.
 *
 * WHY THIS EXISTS SEPARATELY
 *
 * The email address was written into `components/Contact.tsx` and again into
 * `three/data/contact.ts` — two copies of the one fact a client needs most.
 * The LinkedIn and GitHub profiles existed only in the 3D scene, so a visitor
 * on the main site could not find either.
 *
 * This file holds only the destinations. Everything about how they are
 * presented — ordering, emphasis, spoken names — stays with the surface doing
 * the presenting, because the two surfaces genuinely differ.
 *
 * Every value here already existed in the repository. Nothing is invented, and
 * a channel with nowhere to point stays `null` rather than being filled in.
 */
export const EMAIL = "mohammadsyedsameer20@gmail.com";

export const LINKEDIN_URL =
  "https://www.linkedin.com/in/mohammad-syed-sameer-s-a879a235a";

/** The account the three projects are hosted under; see `projects.ts`. */
export const GITHUB_PROFILE_URL = "https://github.com/S-MOHAMMAD-SYED-SAMEER";

/**
 * A hosted URL or a file served from `public/` would both work. `null` until
 * one exists — a surface renders this channel only when it has somewhere to go.
 */
export const RESUME_URL: string | null = null;

/**
 * What a first message is invited to say.
 *
 * Three prompts, deliberately open. They ask what a prospective client wants
 * improved and which workflow it concerns — nothing about their customers,
 * their data, their finances or anything else a stranger should not be asked
 * for in a first email.
 */
const ENQUIRY_BODY = [
  "Hello Sameer,",
  "",
  "What I'd like to work better:",
  "",
  "Which service or workflow this relates to:",
  "",
  "Anything else that would help:",
  "",
  "Thanks,",
].join("\n");

/** The generic subject, used where no particular service is in view. */
const DEFAULT_TOPIC = "Let's Work Together";

function enquirySubject(topic?: string): string {
  return `Enquiry: ${topic ?? DEFAULT_TOPIC}`;
}

/**
 * A prefilled message, addressed and titled before the visitor starts typing.
 *
 * `mailto:` rather than a webmail link, because it hands off to whatever mail
 * client the reader actually uses — Outlook, Apple Mail, a work address — and
 * asks nobody to sign in to somebody else's product first.
 *
 * Pass a service name to say which door the visitor came through, so a reply
 * has context the sender never had to retype.
 */
export function enquiryMailto(topic?: string): string {
  const query = new URLSearchParams({ subject: enquirySubject(topic), body: ENQUIRY_BODY });
  // URLSearchParams encodes spaces as "+", which is right for a query string
  // and wrong for a mailto: — mail clients render the plus signs literally.
  return `mailto:${EMAIL}?${query.toString().replace(/\+/g, "%20")}`;
}

/**
 * The same message, opened in Gmail's web client.
 *
 * Kept as a secondary option: it is genuinely convenient for anyone already
 * signed in, and a dead end for everyone else, which is why it no longer leads.
 */
export function enquiryGmail(topic?: string): string {
  const query = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: EMAIL,
    su: enquirySubject(topic),
    body: ENQUIRY_BODY,
  });
  return `https://mail.google.com/mail/?${query.toString()}`;
}
