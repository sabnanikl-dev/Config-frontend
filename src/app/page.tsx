import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-10 px-4 py-12 sm:px-6">
      <section className="space-y-5">
        <p className="text-muted text-sm tracking-[0.2em] uppercase">Internal Config Frontend</p>
        <div className="space-y-3">
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight">
            Generate project configs for multi-agent builds.
          </h1>
          <p className="text-muted max-w-2xl text-base">
            Capture project metadata, brand tokens, tech decisions, and export a clean config file
            that Hermes can use to scaffold new work.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/new"
          className="border-border bg-foreground text-background rounded-2xl border px-6 py-6 transition-transform hover:-translate-y-0.5"
        >
          <p className="text-background/70 text-sm tracking-[0.2em] uppercase">Start</p>
          <h2 className="mt-3 text-2xl font-semibold">New configuration</h2>
          <p className="text-background/75 mt-2 text-sm">
            Launch the wizard for project info, brand, pages, tech, and export.
          </p>
        </Link>

        <div className="border-border bg-accent/50 rounded-2xl border px-6 py-6">
          <p className="text-muted text-sm tracking-[0.2em] uppercase">Roadmap</p>
          <h2 className="mt-3 text-2xl font-semibold">Recent configs</h2>
          <p className="text-muted mt-2 text-sm">
            Saved config history is coming next. For now, exports are generated directly from the
            wizard.
          </p>
        </div>
      </section>
    </div>
  );
}
