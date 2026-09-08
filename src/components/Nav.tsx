import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Capabilities" },
  { href: "#projects", label: "Projects" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        {/* Smaller at mobile widths so the wordmark and the Contact button
            both fit at 375px without wrapping or overflowing. */}
        <a
          href="#top"
          className="whitespace-nowrap text-small font-semibold text-ink sm:text-subhead"
        >
          S Mohammad Syed Sameer
        </a>

        <div className="flex items-center gap-6">
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
