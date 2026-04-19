"use client"

import React from "react"
import { cn } from "@/lib/utils/cn"
import type { UseFormReturn, FieldErrors } from "react-hook-form"
import type { ProjectConfig } from "@/lib/config/schema"

interface Props {
  form: UseFormReturn<ProjectConfig>
  errors: FieldErrors<ProjectConfig>
}

const SectionOption = ({
  label,
  checked,
  onToggle,
}: {
  label: string
  checked: boolean
  onToggle: () => void
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={cn(
      "rounded-full px-3 py-1 text-xs transition-colors",
      checked
        ? "bg-primary text-primary-foreground"
        : "border border-border bg-background hover:bg-accent/50"
    )}
  >
    {label}
  </button>
)

const SECTION_OPTIONS = [
  "hero", "about", "services", "team", "testimonials",
  "portfolio", "gallery", "features", "pricing", "faq",
  "contact", "form", "cta", "newsletter", "blog-preview",
  "map", "info", "footer", "navbar", "about-preview",
  "featured-products", "image-grid", "video",
]

export function StepPages({ form, errors }: Props) {
  const { register, watch, setValue } = form
  const pages = watch("content.pages") ?? []

  function addPage() {
    setValue("content.pages", [
      ...pages,
      { slug: "", sections: [], description: "" },
    ])
  }

  function removePage(index: number) {
    if (pages.length <= 1) return
    setValue(
      "content.pages",
      pages.filter((_, i) => i !== index)
    )
  }

  function movePage(from: number, delta: number) {
    const to = from + delta
    if (to < 0 || to >= pages.length) return
    const copy = [...pages]
    const [item] = copy.splice(from, 1)
    copy.splice(to, 0, item)
    setValue("content.pages", copy)
  }

  function toggleSection(pageIndex: number, section: string) {
    const page = pages[pageIndex]
    const sections = page.sections.includes(section)
      ? page.sections.filter((s) => s !== section)
      : [...page.sections, section]
    const copy = [...pages]
    copy[pageIndex] = { ...page, sections }
    setValue("content.pages", copy)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Pages</h2>
          <p className="mt-2 text-muted">
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

      <div className="space-y-4">
        {pages.map((page, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">#{i + 1}</span>
              <input
                {...register(`content.pages.${i}.slug` as const)}
                className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                placeholder="page-slug"
              />
              <div className="flex gap-1">
                <button type="button" onClick={() => movePage(i, -1)} disabled={i === 0}
                  className="rounded border px-2 py-1 text-xs disabled:opacity-30">↑</button>
                <button type="button" onClick={() => movePage(i, 1)} disabled={i === pages.length - 1}
                  className="rounded border px-2 py-1 text-xs disabled:opacity-30">↓</button>
                <button type="button" onClick={() => removePage(i)}
                  className="rounded border px-2 py-1 text-xs text-red-500">✕</button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Sections</p>
              <div className="flex flex-wrap gap-2">
                {SECTION_OPTIONS.map((s) => (
                  <SectionOption
                    key={s}
                    label={s}
                    checked={page.sections.includes(s)}
                    onToggle={() => toggleSection(i, s)}
                  />
                ))}
              </div>
            </div>

            <input
              {...register(`content.pages.${i}.description` as const)}
              className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
              placeholder="Description (optional)"
            />

            {page.sections.length > 0 && (
              <p className="text-xs text-muted">
                Route: /{page.slug} · Sections: {page.sections.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
