export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-2xl font-bold text-slate-900">Contact</h2>
      <p className="mt-4 max-w-2xl text-slate-600">
        Tell us about your store and where leads are slipping through — we'll
        get back to you.
      </p>
      <a
        href="https://mail.google.com/mail/?view=cm&fs=1&to=mohammadsyedsameer20@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Let's Work Together
      </a>
      <p className="mt-3 text-sm text-slate-500">
        Or email directly:{" "}
        <a
          href="mailto:mohammadsyedsameer20@gmail.com"
          className="underline hover:text-slate-700"
        >
          mohammadsyedsameer20@gmail.com
        </a>
      </p>
    </section>
  );
}
