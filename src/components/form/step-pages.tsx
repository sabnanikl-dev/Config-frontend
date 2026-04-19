"use client"

import React from "react"
import { type UseFormReturn, type FieldErrors } from "react-hook-form"
import type { ProjectConfig } from "@/lib/config/schema"
import { cn } from "@/lib/utils/cn"

interface Props {
  form: UseFormReturn<ProjectConfig>
  errors: FieldErrors<ProjectConfig>
}

const SECTION_OPTIONS = [
  "hero", "about", "services", "team", "testimonials",
  "portfolio", "gallery", "features", "pricing", "faq",
  "contact", "form", "cta", "newsletter", "blog-preview",
  "map", "info", "footer", "navbar", "about-preview",
  "featured-products", "image-grid", "video",
]

export function StepPages({ form, errors }: Props) {
  const pages = form.watch("content.pages") || []

  function addPage() {
    form.setValue("content.pages", [
      ...pages,
      { slug: "", sections: [], description: "" },
    ], { shouldDirty: true, shouldValidate: true })
  }

  function removePage(index: number) {
    if (pages.length <= 1) return
    form.setValue("content.pages", pages.filter((_, i) => i !== index), { shouldDirty: true })
  }

  function movePage(from: number, delta: number) {
    const to = from + delta
    if (to < 0 || to >= pages.length) return
    const copy = [...pages]
    const [item] = copy.splice(from, 1)
    copy.splice(to, 0, item)
    form.setValue("content.pages", copy, { shouldDirty: true })
  }

  function updateField(index: number, field: string, value: string) {
    form.setValue(`content.pages.${index}.${field}` as any, value, { shouldDirty: true })
  }

  function toggleSection(index: number, section: string) {
    const current = pages[index]?.sections || []
    const sections = current.includes(section)
      ? current.filter((s: string) => s !== section)
      : [...current, section]
    form.setValue(`content.pages.${index}.sections` as any, sections, { shouldDirty: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Pages</h2>
          <p className="mt-2 text-muted-foreground">
            Define pages and sections. Each page generates a route and a GitHub Issue.
          </p>
        </div>
        <button
          type="button"
          onClick={addPage}
          className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
        >
          Add Page
        </button>
      </div>

      {errors.content?.pages && (
        <p className="text-sm text-red-600">{errors.content.pages.message}</p>
      )}

      <div className="space-y-4">
        {pages.map((page, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">#{i + 1}</span>
              <input
                type="text"
                value={page.slug || ""}
                onChange={(e) => updateField(i, "slug", e.target.value)}
                className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                placeholder="page-slug"
              />
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => movePage(i, -1)}
                  disabled={i === 0}
                  className="rounded border px-2 py-1 text-xs disabled:opacity-30"
                >↑</button>
                <button
                  type="button"
                  onClick={() => movePage(i, 1)}
                  disabled={i === pages.length - 1}
                  className="rounded border px-2 py-1 text-xs disabled:opacity-30"
                >↓</button>
                <button
                  type="button"
                  onClick={() => removePage(i)}
                  className="rounded border px-2 py-1 text-xs text-red-500"
                >✕</button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Sections</p>
              <div className="flex flex-wrap gap-2">
                {SECTION_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSection(i, s)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs transition-colors",
                      (page.sections || []).includes(s)
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background hover:bg-accent/50"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={page.description || ""}
              onChange={(e) => updateField(i, "description", e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              placeholder="Description (optional)"
            />

            {page.sections.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Route: /{page.slug} Sections: {page.sections.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
