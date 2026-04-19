import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Project Config</h1>
        <p className="text-lg text-muted">
          Generate project configurations for multi-agent development.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/new"
          className="flex flex-col rounded-lg border p-6 transition-colors hover:bg-accent/50"
        >
          <span className="mb-2 text-2xl">🚀</span>
          <h2 className="text-lg font-semibold">New Configuration</h2>
          <p className="mt-1 text-sm text-muted">
            Create a new project config with brand, pages, tech stack, and agent assignment.
          </p>
        </Link>

        <div className="flex flex-col rounded-lg border p-6 opacity-75">
          <span className="mb-2 text-2xl">📂</span>
          <h2 className="text-lg font-semibold">Recent Configs</h2>
          <p className="mt-1 text-sm text-muted">
            View and manage previously generated configurations. Coming soon.
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl rounded-lg border p-6">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="mt-4 space-y-3 text-sm text-muted list-decimal list-inside">
          <li>Fill out the config form — project info, brand, pages, tech stack</li>
          <li>Export as YAML frontmatter, JSON, or Markdown</li>
          <li>Send the config file to Hermes</li>
          <li>Hermes auto-populates the scaffold and creates the repo</li>
          <li>Review Issues, greenlight agents, build the project</li>
        </ol>
      </div>
    </div>
  )
}
