/**
 * The first thing in the tab order, and invisible until it is reached.
 *
 * WHY THIS IS A COMPONENT RATHER THAN FOUR COPIES
 *
 * Four shells need it — the homepage nav, the demo shell, and the three
 * case studies — and each has its own header written in its own utilities.
 * Pasting the class string into all four would be four things to keep in step,
 * and the failure mode is silent: a copy that drifts still looks fine, because
 * nothing about it is visible until somebody presses Tab.
 *
 * WHY THE COLOURS ARE UNPREFIXED
 *
 * `index.css` darkens the filled-action colour with `[data-theme="dark"]
 * .bg-brand`, and that selector matches the literal `bg-brand` class. A
 * `focus:bg-brand` compiles to a different class name, so the override would
 * not apply and the white label would sit on #8b8bf5 at 2.95:1 — under AA, in
 * the theme that is the first-visit default. Unprefixed, the override lands and
 * it is 5.4:1. Nothing shows at rest regardless: `sr-only` clips the element to
 * a single pixel.
 *
 * WHAT THE TARGET HAS TO DO
 *
 * `href` points at a `<main>` that carries `id` and `tabIndex={-1}`. The
 * tabindex is what makes the jump move FOCUS rather than only the scroll
 * position: a `<main>` is not focusable by default, so without it the browser
 * leaves focus on the link and the next Tab returns the visitor to the nav they
 * just skipped. `-1` keeps it out of the normal tab order.
 */
export default function SkipLink({ href = "#main" }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only bg-brand text-white focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:z-50 focus:inline-flex focus:h-control focus:items-center focus:rounded-control focus:px-4 focus:text-small focus:font-semibold focus:shadow-resting"
    >
      Skip to content
    </a>
  );
}
