import { useCallback, useEffect, useState } from "react";

/**
 * The dark/light switch.
 *
 * WHY THE THEME IS ALREADY SET BEFORE THIS COMPONENT EXISTS
 *
 * A blocking script in each page's <head> reads the stored preference and
 * stamps `data-theme` on <html> before the first paint. If that job were left
 * to React, every visitor would see a flash of the wrong theme while the bundle
 * parsed — worst on the pages most likely to be opened cold from a link.
 *
 * So this component does not decide the theme at startup. It reads what the
 * document already says and offers a way to change it.
 *
 * WHAT IS STORED, AND WHAT IS NOT
 *
 * One key, `theme`, holding the string "dark" or "light". Nothing else is put
 * in localStorage anywhere in this site: no credentials, no tokens, no
 * application data. A theme preference is the whole of it, and it is why the
 * reads below can fail silently — a browser that blocks storage should get a
 * working site with the default theme, not an error.
 */

type Theme = "dark" | "light";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  // The head script runs before React mounts, so on the first render this
  // reconciles state with what the document was already stamped with.
  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // Private windows and blocked site data. The theme still applies for
      // this page; it simply will not be remembered, which is the right
      // failure for a preference.
    }
    setTheme(next);
  }, []);

  const goingTo = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${goingTo} mode`}
      title={`Switch to ${goingTo} mode`}
      className="inline-flex h-control items-center gap-2 rounded-control border border-line-strong px-3 text-small font-semibold text-ink transition-colors hover:border-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {/* One glyph, showing what pressing it will do rather than what the page
          currently is — a control labelled with its own state reads as a status
          light and gets pressed by accident. */}
      <span aria-hidden="true" className="text-base leading-none">
        {theme === "dark" ? "☀" : "☾"}
      </span>
      <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
