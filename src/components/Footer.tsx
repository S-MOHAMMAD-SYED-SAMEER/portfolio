// The site footer points at the same repository the projects do, so the URL
// is imported rather than written a second time.
import { REPO_URL } from "../data/projects";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-small text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        {/* Year stays derived rather than hard-coded — it renders 2026 now and
            will not silently go stale. */}
        <p>© {new Date().getFullYear()} S Mohammad Syed Sameer</p>
        {/* Distinguished from the "GitHub" links on the project cards, which
            name their project, and from the one in Contact, which is the
            account. This is the repository on its own. */}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub repository"
          className="-my-3 inline-flex items-center py-3 hover:text-ink"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
