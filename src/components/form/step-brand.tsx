"use client"

import { cn } from "@/lib/utils/cn"
import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { ProjectConfig } from "@/lib/config/schema"

interface Props {
  register: UseFormRegister<ProjectConfig>
  errors: FieldErrors<ProjectConfig>
}

const colorFields = [
  { field: "brand.colors.primary" as const, label: "Primary" },
  { field: "brand.colors.secondary" as const, label: "Secondary" },
  { field: "brand.colors.accent" as const, label: "Accent" },
  { field: "brand.colors.background" as const, label: "Background" },
  { field: "brand.colors.foreground" as const, label: "Foreground / Text" },
  { field: "brand.colors.muted" as const, label: "Muted" },
  { field: "brand.colors.border" as const, label: "Border" },
]

export function StepBrand({ register, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Brand Colors</h2>
        <p className="mt-2 text-muted">
          Define your brand palette. These become Tailwind CSS tokens in the scaffold.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {colorFields.map((f) => (
          <div key={f.field} className="space-y-2">
            <label className="block text-sm font-medium">{f.label}</label>
            <div className="flex gap-2">
              <input
                type="color"
                {...register(f.field)}
                className="h-10 w-10 shrink-0 rounded-md border border-border p-0"
              />
              <input
                type="text"
                {...register(f.field)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-medium">Typography</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Heading Font</label>
          <input
            type="text"
            {...register("brand.typography.heading")}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
            placeholder="system-ui, -apple-system, sans-serif"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Body Font</label>
          <input
            type="text"
            {...register("brand.typography.body")}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
            placeholder="system-ui, -apple-system, sans-serif"
          />
        </div>
      </div>

      {errors.brand?.colors && (
        <p className="text-sm text-red-600">(Some colors have validation errors)</p>
      )}
    </div>
  )
}
