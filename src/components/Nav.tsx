import SkipLink from "./SkipLink";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Capabilities" },
  { href: "#projects", label: "Projects" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur">
      {/* Before the wordmark, so a keyboard visitor does not walk the three
          section links, the theme toggle and the Contact button on every visit
          before reaching the page. The sticky header is already a positioning
          context, so the focused link places itself against it. */}
      <SkipLink />
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 max-[389px]:px-4">
        {/* Smaller at mobile widths so the wordmark and the Contact button
            both fit at 375px without wrapping or overflowing.

            The row had a hard floor of 359px: 24px of left padding, a
            174px wordmark that `whitespace-nowrap` refused to compress, the
            16px gap and the 145px control group. Nothing could give, so any
            viewport under 359px pushed the document wider than the screen —
            39px of sideways scroll at 320px, and one pixel of headroom at the
            very common 360px.
            Everything below is scoped to `max-[389px]`, so 390px and up render
            exactly as they shipped. Under that width the row reclaims 8px of
            padding and 12px of gap, which is enough to seat the full name down
            to about 350px; below that the name is finally allowed to wrap,
            which is what a flex row should do when it genuinely runs out of
            room. Shrinking the type or abbreviating the name would have
            changed the design to fix a layout bug. */}
        {/* py/-my grow the touch target to 46px without moving anything: the
            padding enlarges the hit box, the equal negative margin gives the
            space straight back to the layout, so the header stays 73px tall at
            every width. Safe here because the bar is a single row — there is no
            control above or below for the taller box to overlap. */}
        <a
          href="#top"
          className="-my-3 whitespace-nowrap py-3 text-small font-semibold text-ink max-[389px]:whitespace-normal sm:text-subhead"
        >
          S Mohammad Syed Sameer
        </a>

        <div className="flex items-center gap-6 max-[389px]:gap-3">
          {/* The link list is hidden on narrow screens rather than collapsed
              into a menu: the links plus a wordmark do not fit at 375px, and a
              hamburger would add state and markup for a three-item nav. The
              primary action stays visible at every width, which is what a
              visitor on a phone actually needs.

              It appears at `md` (768px), not `sm` (640px), because `sm` is
              where three things grow at once: the wordmark steps up to 18px,
              the theme toggle gains its text label, and this list unhides. All
              three together need 651px of a row that has only 592px at 640px
              wide, so the bar overflowed by 59px across 640–698px. Revealing
              the list one breakpoint later is what makes the row fit; nothing
              is hidden that was previously usable, since the list was already
              hidden below its breakpoint by design. */}
          <ul className="hidden items-center gap-6 text-small text-ink-muted md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <a
            href="#contact"
            className="inline-flex h-control items-center rounded-control bg-brand px-4 text-small font-semibold text-white hover:bg-brand/90"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
