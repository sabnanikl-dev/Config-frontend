"use client"

import React from "react"
import { type UseFormReturn, type FieldErrors } from "react-hook-form"
import type { ProjectConfig } from "@/lib/config/schema"
import { cn } from "@/lib/utils/cn"

interface Props {
  form: UseFormReturn<ProjectConfig>
  errors: FieldErrors<ProjectConfig>
}

const CAPABILITY_OPTIONS = [
  "auth", "search", "filters", "drag-and-drop", "notifications",
  "automation", "integrations", "realtime", "offline", "file-upload",
  "comments", "permissions", "audit-log", "billing", "i18n",
]

type ListKey = "capabilities" | "dataModels" | "integrations"

export function StepApp({ form }: Props) {
  const app = form.watch("app") || { capabilities: [], dataModels: [], integrations: [] }
  const workflow = form.watch("agents.workflow") || { builder: "", updater: "", escalation: "" }

  const [openInputKey, setOpenInputKey] = React.useState<ListKey | null>(null)
  const [customValue, setCustomValue] = React.useState("")
  const [modelDraft, setModelDraft] = React.useState("")
  const [integrationDraft, setIntegrationDraft] = React.useState("")

  function setList(key: ListKey, values: string[]) {
    form.setValue(`app.${key}` as const, values, { shouldDirty: true })
  }

  function toggleCapability(name: string) {
    const current = app.capabilities || []
    const next = current.includes(name)
      ? current.filter((c) => c !== name)
      : [...current, name]
    setList("capabilities", next)
  }

  function addCustomCapability() {
    const name = customValue.trim()
    if (!name) return
    const current = app.capabilities || []
    if (current.includes(name)) return
    setList("capabilities", [...current, name])
    setCustomValue("")
    setOpenInputKey(null)
  }

  function addListItem(key: ListKey, value: string, clear: () => void) {
    const name = value.trim()
    if (!name) return
    const current = app[key] || []
    if (current.includes(name)) return
    setList(key, [...current, name])
    clear()
  }

  function removeListItem(key: ListKey, item: string) {
    const current = app[key] || []
    setList(key, current.filter((v) => v !== item))
  }

  function updateWorkflow(field: "builder" | "updater" | "escalation", value: string) {
    form.setValue(`agents.workflow.${field}` as const, value, { shouldDirty: true })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">App Shape</h2>
        <p className="mt-2 text-muted">
          Declare app capabilities, data models, integrations, and agent workflow hints.
        </p>
      </div>

      {/* Capabilities */}
      <div>
        <p className="text-sm font-medium mb-2">Capabilities</p>
        <div className="flex flex-wrap gap-2">
          {CAPABILITY_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCapability(c)}
              className={cn(
                "rounded-full px-3 py-1 text-xs transition-colors",
                (app.capabilities || []).includes(c)
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background hover:bg-accent/50"
              )}
            >
              {c}
            </button>
          ))}
          {(app.capabilities || [])
            .filter((c) => !CAPABILITY_OPTIONS.includes(c))
            .map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCapability(c)}
                className="rounded-full px-3 py-1 text-xs transition-colors bg-primary text-primary-foreground"
              >
                {c}
              </button>
            ))}
          {openInputKey === "capabilities" ? (
            <div className="flex gap-1">
              <input
                autoFocus
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addCustomCapability() }
                  if (e.key === "Escape") { setOpenInputKey(null); setCustomValue("") }
                }}
                placeholder="capability"
                className="rounded-md border border-border bg-background px-2 py-1 text-xs"
              />
              <button
                type="button"
                onClick={addCustomCapability}
                className="rounded-md bg-primary px-2 py-1 text-xs text-white"
              >Add</button>
              <button
                type="button"
                onClick={() => { setOpenInputKey(null); setCustomValue("") }}
                className="rounded-md border px-2 py-1 text-xs"
              >✕</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { setOpenInputKey("capabilities"); setCustomValue("") }}
              className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted hover:border-primary hover:text-primary"
            >
              + custom
            </button>
          )}
        </div>
      </div>

      {/* Data Models */}
      <div>
        <p className="text-sm font-medium mb-2">Data Models</p>
        <p className="text-xs text-muted mb-2">Hints for scaffold: e.g. tasks, projects, users, statuses.</p>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={modelDraft}
              onChange={(e) => setModelDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addListItem("dataModels", modelDraft, () => setModelDraft("")) }
              }}
              placeholder="model-name"
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() => addListItem("dataModels", modelDraft, () => setModelDraft(""))}
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary/90"
            >Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(app.dataModels || []).map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs"
              >
                {m}
                <button
                  type="button"
                  onClick={() => removeListItem("dataModels", m)}
                  className="text-muted hover:text-red-500"
                  aria-label={`Remove ${m}`}
                >✕</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div>
        <p className="text-sm font-medium mb-2">Integrations</p>
        <p className="text-xs text-muted mb-2">Third-party services: e.g. slack, github, stripe, linear.</p>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={integrationDraft}
              onChange={(e) => setIntegrationDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addListItem("integrations", integrationDraft, () => setIntegrationDraft("")) }
              }}
              placeholder="integration-name"
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() => addListItem("integrations", integrationDraft, () => setIntegrationDraft(""))}
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary/90"
            >Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(app.integrations || []).map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs"
              >
                {m}
                <button
                  type="button"
                  onClick={() => removeListItem("integrations", m)}
                  className="text-muted hover:text-red-500"
                  aria-label={`Remove ${m}`}
                >✕</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Workflow Hints */}
      <div>
        <p className="text-sm font-medium mb-2">Agent Workflow</p>
        <p className="text-xs text-muted mb-3">Optional hints for how agents collaborate on this project.</p>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="w-24 text-sm text-muted">Builder</label>
            <input
              type="text"
              value={workflow.builder || ""}
              onChange={(e) => updateWorkflow("builder", e.target.value)}
              placeholder="e.g. claude-code builds features"
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-24 text-sm text-muted">Updater</label>
            <input
              type="text"
              value={workflow.updater || ""}
              onChange={(e) => updateWorkflow("updater", e.target.value)}
              placeholder="e.g. hermes updates task state"
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            />
          </div>
          <div className="flex items-start gap-2">
            <label className="w-24 pt-2 text-sm text-muted">Escalation</label>
            <textarea
              value={workflow.escalation || ""}
              onChange={(e) => updateWorkflow("escalation", e.target.value)}
              placeholder="Blocker handling / escalation rules"
              rows={2}
              className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
