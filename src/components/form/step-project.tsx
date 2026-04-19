"use client"

import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { ProjectConfig } from "@/lib/config/schema"

interface Props {
  register: UseFormRegister<ProjectConfig>
  errors: FieldErrors<ProjectConfig>
}

export function StepProject({ register, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Project Info</h2>
        <p className="mt-2 text-muted">
          Basic info about the project — this sets up the repo name, description, and GitHub metadata.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="project.name" className="block text-sm font-medium">
            Project Name *
          </label>
          <input
            id="project.name"
            type="text"
            {...register("project.name", { required: "Project name is required" })}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="JMD Menswear"
          />
          {errors.project?.name && <p className="mt-1 text-sm text-red-600">{errors.project.name.message}</p>}
        </div>

        <div>
          <label htmlFor="project.repo" className="block text-sm font-medium">
            Repo Name *
          </label>
          <input
            id="project.repo"
            type="text"
            {...register("project.repo", { required: "Repo name is required" })}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="jmd-menswear-site"
          />
          {errors.project?.repo && <p className="mt-1 text-sm text-red-600">{errors.project.repo.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="project.description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="project.description"
          {...register("project.description")}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          rows={3}
          placeholder="Digital storefront for metro Atlanta menswear retailer"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="project.domain" className="block text-sm font-medium">Domain</label>
          <input
            id="project.domain"
            type="text"
            {...register("project.domain")}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="jmdmenswear.com"
          />
        </div>
        <div>
          <label htmlFor="project.owner" className="block text-sm font-medium">GitHub Owner</label>
          <input
            id="project.owner"
            type="text"
            {...register("project.owner")}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="sabnanikl-dev"
          />
        </div>
      </div>
    </div>
  )
}
