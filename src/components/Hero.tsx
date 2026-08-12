export default function Hero() {
  return (
    <section
      id="top"
      className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-24"
    >
      <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
        AI Business Automation Agency
      </p>
      <h1 className="max-w-3xl text-4xl font-bold text-slate-900 sm:text-5xl">
        Recover lost leads and cut manual work with AI systems built for
        e-commerce.
      </h1>
      <p className="max-w-2xl text-lg text-slate-600">
        We build AI customer support, sales-recovery, and workflow automation
        for small international e-commerce and D2C stores — outcomes, not AI
        features.
      </p>
      <div className="flex flex-wrap gap-4 pt-2">
        <a
          href="#contact"
          className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Let's Work Together
        </a>
        <a
          href="#projects"
          className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
        >
          View Projects
        </a>
      </div>
    </section>
  );
}
