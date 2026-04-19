"use client"

import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { ProjectConfig } from "@/lib/config/schema"

interface Props {
  register: UseFormRegister<ProjectConfig>
  errors: FieldErrors<ProjectConfig>
}

export function StepTech({ register }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Tech Stack</h2>
        <p className="mt-2 text-muted-foreground">
          Choose framework, deployment provider, and agent assignments.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <span className="block text-sm font-medium mb-2">Framework</span>
          <div className="space-y-2">
            {(["next", "astro", "vite"] as const).map((f) => (
              <label key={f} className="flex items-center gap-2">
                <input type="radio" value={f} {...register("tech.framework")} className="accent-primary" />
                <span className="text-sm capitalize">{f}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium mb-2">Deployment</span>
          <div className="space-y-2">
            {([
              ["static", "Static Export (any host)"],
              ["vercel", "Vercel"],
              ["netlify", "Netlify"],
              ["cloudflare", "Cloudflare Pages"],
              ["docker", "Docker / Self-hosted"],
            ] as const).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2">
                <input type="radio" value={value} {...register("tech.deploy")} className="accent-primary" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t pt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("tech.ssr")} className="accent-primary" />
            <span className="text-sm font-medium">Enable server-side rendering</span>
          </label>
        </div>

        <div>
          <span className="block text-sm font-medium mb-2">CMS</span>
          <div className="space-y-2">
            {([
              ["none", "None"],
              ["sanity", "Sanity.io"],
              ["contentful", "Contentful"],
              ["markdown", "Markdown files"],
            ] as const).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2">
                <input type="radio" value={value} {...register("tech.cms")} className="accent-primary" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Agent Assignment</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <span className="block text-sm font-medium mb-2">Lead Developer</span>
            <div className="space-y-2">
              {(["claude-code", "codex"] as const).map((a) => (
                <label key={a} className="flex items-center gap-2">
                  <input type="radio" value={a} {...register("agents.lead")} className="accent-primary" />
                  <span className="text-sm">{a}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-sm font-medium mb-2">Reviewer</span>
            <div className="space-y-2">
              {(["codex", "claude-code"] as const).map((a) => (
                <label key={a} className="flex items-center gap-2">
                  <input type="radio" value={a} {...register("agents.reviewer")} className="accent-primary" />
                  <span className="text-sm">{a}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <label htmlFor="plugins" className="block text-sm font-medium mb-1">Custom Plugins</label>
        <p className="text-sm text-muted-foreground mb-2">One package per line.</p>
        <textarea
          id="plugins"
          {...register("tech.plugins")}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
          rows={4}
          placeholder="@vercel/analytics"
        />
      </div>
    </div>
  )
}
