"use client"

import yaml from "js-yaml"
import type { ProjectConfig } from "@/lib/config/schema"

interface Props {
  data: ProjectConfig
}

export function StepReview({ data }: Props) {
  function downloadYaml() {
    const out = yaml.dump(data, { indent: 2 })
    const blob = new Blob([out], { type: "text/yaml" })
    triggerDownload(blob, `${data.project.repo}-config.yaml`)
  }

  function downloadJson() {
    const out = JSON.stringify(data, null, 2)
    const blob = new Blob([out], { type: "application/json" })
    triggerDownload(blob, `${data.project.repo}-config.json`)
  }

  function downloadMd() {
    const frontmatter = yaml.dump(data, { indent: 2 })
    const body = `# Project Config: ${data.project.name}\n\n` +
      `**Repo:** \`${data.project.owner}/${data.project.repo}\`\n\n` +
      `## Pages\n\n` +
      data.content.pages.map((p, i) =>
        `${i + 1}. **/${p.slug}** — ${p.description || "No description"}\n   Sections: ${p.sections.join(", ")}`
      ).join("\n\n")
    const md = `---\n${frontmatter}---\n\n${body}`
    const blob = new Blob([md], { type: "text/markdown" })
    triggerDownload(blob, `${data.project.repo}-config.md`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Review & Export</h2>
        <p className="mt-2 text-muted-foreground">
          Preview your config and download it in your preferred format.
        </p>
      </div>

      {/* Quick summary */}
      <div className="rounded-lg border p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Project</span>
          <span className="font-medium">{data.project.name || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Repo</span>
          <span className="font-medium">{data.project.owner}/{data.project.repo || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pages</span>
          <span className="font-medium">{data.content.pages.length} page(s)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Framework</span>
          <span className="font-medium capitalize">{data.tech.framework}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Deploy</span>
          <span className="font-medium capitalize">{data.tech.deploy}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Agents</span>
          <span className="font-medium">{data.agents.lead} / {data.agents.reviewer}</span>
        </div>
      </div>

      {/* Full YAML preview */}
      <details className="rounded-lg border">
        <summary className="cursor-pointer px-4 py-2 text-sm font-medium">View full YAML</summary>
        <pre className="p-4 text-xs font-mono overflow-x-auto bg-muted/30">
          {yaml.dump(data, { indent: 2 })}
        </pre>
      </details>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={downloadYaml}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          Download YAML
        </button>
        <button type="button" onClick={downloadJson}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          Download JSON
        </button>
        <button type="button" onClick={downloadMd}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          Download Markdown
        </button>
      </div>
    </div>
  )
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
