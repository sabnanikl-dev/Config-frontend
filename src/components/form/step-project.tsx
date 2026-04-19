'use client';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { cn } from '@/lib/utils/cn';
import type { WizardFormValues } from '@/lib/config/schema';

export interface StepProjectProps {
  errors: FieldErrors<WizardFormValues>;
  register: UseFormRegister<WizardFormValues>;
}

function getFieldClass(hasError: boolean) {
  return cn(
    'bg-background mt-1 w-full rounded-md border px-3 py-2 text-sm transition-colors outline-none',
    hasError ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-foreground/40',
  );
}

export function StepProject({ errors, register }: StepProjectProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight">Project Info</h2>
        <p className="text-muted max-w-2xl text-sm">
          Capture the repo metadata Hermes needs to scaffold the project correctly.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Project name
          <input
            type="text"
            {...register('project.name')}
            className={getFieldClass(Boolean(errors.project?.name))}
            placeholder="JMD Menswear"
          />
          {errors.project?.name ? (
            <span className="mt-1 block text-sm text-red-600">{errors.project.name.message}</span>
          ) : null}
        </label>

        <label className="block text-sm font-medium">
          Repo name
          <input
            type="text"
            {...register('project.repo')}
            className={getFieldClass(Boolean(errors.project?.repo))}
            placeholder="jmd-menswear"
          />
          {errors.project?.repo ? (
            <span className="mt-1 block text-sm text-red-600">{errors.project.repo.message}</span>
          ) : (
            <span className="text-muted mt-1 block text-xs">
              Auto-slugifies from the project name until you edit it manually.
            </span>
          )}
        </label>
      </div>

      <label className="block text-sm font-medium">
        Description
        <textarea
          rows={4}
          {...register('project.description')}
          className={getFieldClass(Boolean(errors.project?.description))}
          placeholder="Digital storefront for a menswear retailer in metro Atlanta."
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Domain
          <input
            type="text"
            {...register('project.domain')}
            className={getFieldClass(Boolean(errors.project?.domain))}
            placeholder="jmdmenswear.com"
          />
        </label>

        <label className="block text-sm font-medium">
          GitHub owner
          <input
            type="text"
            {...register('project.owner')}
            className={getFieldClass(Boolean(errors.project?.owner))}
            placeholder="sabnanikl-dev"
          />
          {errors.project?.owner ? (
            <span className="mt-1 block text-sm text-red-600">{errors.project.owner.message}</span>
          ) : null}
        </label>
      </div>
    </section>
  );
}
