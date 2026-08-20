const REPO = "https://github.com/S-MOHAMMAD-SYED-SAMEER/ai-business-automation";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-small text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        {/* Year stays derived rather than hard-coded — it renders 2026 now and
            will not silently go stale. */}
        <p>© {new Date().getFullYear()} S Mohammad Syed Sameer</p>
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className="hover:text-ink"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
