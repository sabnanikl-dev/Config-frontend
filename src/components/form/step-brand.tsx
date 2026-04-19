"use client"

import Image from "next/image"
import React from "react"
import type { FieldErrors, UseFormReturn } from "react-hook-form"
import type { ProjectConfig } from "@/lib/config/schema"
import { cn } from "@/lib/utils/cn"

interface Props {
  form: UseFormReturn<ProjectConfig>
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

function normalizeAssetFilename(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".")
  const baseName = dotIndex >= 0 ? fileName.slice(0, dotIndex) : fileName
  const extension = dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : ""

  const normalizedBase = baseName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return `${normalizedBase || "asset"}${extension}`
}

export function StepBrand({ form, errors }: Props) {
  const { register, setValue, watch } = form
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [dragActive, setDragActive] = React.useState(false)
  const previewsRef = React.useRef<Record<number, string>>({})
  const [previews, setPreviews] = React.useState<Record<number, string>>({})
  const [uploadNotice, setUploadNotice] = React.useState<string | null>(null)
  const assets = watch("content.assets") || []
  const assetsRef = React.useRef(assets)
  assetsRef.current = assets

  const updateAssets = React.useCallback((nextAssets: string[]) => {
    setValue("content.assets", nextAssets, { shouldDirty: true, shouldValidate: true })
  }, [setValue])

  const addFiles = React.useCallback((fileList: FileList | null) => {
    if (!fileList?.length) return

    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"))
    if (!files.length) {
      setUploadNotice("Only image files are supported here.")
      return
    }

    setUploadNotice(
      "Suggested paths were added to the config. Copy the real files into public/assets before shipping the scaffold."
    )

    const currentAssets = assetsRef.current
    const nextAssets = [...currentAssets]

    const startIndex = nextAssets.length - files.length

    setPreviews((current) => {
      const next = { ...current }

      files.forEach((file, i) => {
        const assetPath = `/assets/${normalizeAssetFilename(file.name)}`
        if (!nextAssets.includes(assetPath)) {
          nextAssets.push(assetPath)
        }

        const idx = startIndex + i
        if (previewsRef.current[idx]) {
          URL.revokeObjectURL(previewsRef.current[idx])
        }
        const blobUrl = URL.createObjectURL(file)
        previewsRef.current[idx] = blobUrl
        next[idx] = blobUrl
      })

      return next
    })

    updateAssets(nextAssets)
  }, [updateAssets])

  // No explicit cleanup effect needed. Blob URLs are freed on page unload,
  // and explicit revocations happen in addFiles (replace) and removeAsset (delete).

  function updateAsset(index: number, value: string) {
    const nextAssets = [...assets]
    nextAssets[index] = value
    updateAssets(nextAssets)
  }

  function removeAsset(index: number) {
    if (previewsRef.current[index]) {
      URL.revokeObjectURL(previewsRef.current[index])
      delete previewsRef.current[index]
    }
    setPreviews((current) => {
      const next = { ...current }
      if (!next[index]) return current
      delete next[index]
      return next
    })
    updateAssets(assets.filter((_, assetIndex) => assetIndex !== index))
  }

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

      <div className="border-t pt-6 space-y-4">
        <div>
          <h3 className="text-lg font-medium">Project Assets</h3>
          <p className="mt-1 text-sm text-muted">
            Drag images here to generate scaffold-ready asset paths under <code>/assets</code>.
          </p>
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            setDragActive(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragActive(false)
            addFiles(event.dataTransfer.files)
          }}
          className={cn(
            "rounded-xl border-2 border-dashed p-6 transition-colors",
            dragActive ? "border-primary bg-accent/40" : "border-border bg-background"
          )}
        >
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Drop logo, hero, or background images</p>
              <p className="text-sm text-muted">
                We will preview the image and add a suggested relative path to your config.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent/50"
            >
              Choose files
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              addFiles(event.target.files)
              event.target.value = ""
            }}
          />
        </div>

        {uploadNotice && (
          <p className="text-sm text-muted">{uploadNotice}</p>
        )}

        {assets.length > 0 && (
          <div className="space-y-3">
            {assets.map((assetPath, index) => (
              <div key={`${assetPath}-${index}`} className="rounded-lg border border-border p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="h-20 w-20 overflow-hidden rounded-md border border-border bg-accent/40">
                    {previews[index] ? (
                      <Image
                        src={previews[index]}
                        alt={assetPath}
                        width={80}
                        height={80}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-center text-xs text-muted">
                        No preview
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-sm font-medium">
                      Asset path
                      <input
                        type="text"
                        value={assetPath}
                        onChange={(event) => updateAsset(index, event.target.value)}
                        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
                      />
                    </label>
                    <p className="text-xs text-muted">
                      Suggested location: <code>public{assetPath}</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAsset(index)}
                    className="rounded-md border border-border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {errors.brand?.colors && (
        <p className="text-sm text-red-600">(Some colors have validation errors)</p>
      )}
    </div>
  )
}
