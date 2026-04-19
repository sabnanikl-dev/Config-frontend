'use client';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { cn } from '@/lib/utils/cn';
import type { WizardFormValues } from '@/lib/config/schema';

const frameworkOptions = [
  ['next', 'Next.js'],
  ['astro', 'Astro'],
  ['vite', 'Vite'],
] as const;

const deploymentOptions = [
  ['static', 'Static export'],
  ['vercel', 'Vercel'],
  ['netlify', 'Netlify'],
  ['cloudflare', 'Cloudflare Pages'],
  ['docker', 'Docker'],
] as const;

const cmsOptions = [
  ['none', 'None'],
  ['sanity', 'Sanity'],
  ['contentful', 'Contentful'],
  ['markdown', 'Markdown'],
] as const;

const leadOptions = [
  ['claude-code', 'Claude Code'],
  ['codex', 'Codex'],
] as const;

const reviewerOptions = [
  ['codex', 'Codex'],
  ['claude-code', 'Claude Code'],
] as const;

export interface StepTechProps {
  errors: FieldErrors<WizardFormValues>;
  register: UseFormRegister<WizardFormValues>;
}

function getChoiceClass() {
  return 'flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm';
}

function getFieldClass(hasError: boolean) {
  return cn(
    'bg-background w-full rounded-md border px-3 py-2 font-mono text-sm transition-colors outline-none',
    hasError ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-foreground/40',
  );
}

export function StepTech({ errors, register }: StepTechProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight">Tech Stack</h2>
        <p className="text-muted max-w-2xl text-sm">
          Choose the runtime, deployment target, and agent pairing for the generated project.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border-border space-y-6 rounded-xl border p-5">
          <div className="space-y-3">
            <h3 className="text-base font-medium">Application setup</h3>
            <div className="grid gap-2">
              {frameworkOptions.map(([value, label]) => (
                <label key={value} className={getChoiceClass()}>
                  <input type="radio" value={value} {...register('tech.framework')} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-medium">Deployment</h3>
            <div className="grid gap-2">
              {deploymentOptions.map(([value, label]) => (
                <label key={value} className={getChoiceClass()}>
                  <input type="radio" value={value} {...register('tech.deploy')} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-medium">CMS</h3>
            <div className="grid gap-2">
              {cmsOptions.map(([value, label]) => (
                <label key={value} className={getChoiceClass()}>
                  <input type="radio" value={value} {...register('tech.cms')} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <label className={getChoiceClass()}>
            <input type="checkbox" {...register('tech.ssr')} />
            <span>Enable server-side rendering</span>
          </label>
        </section>

        <section className="border-border space-y-6 rounded-xl border p-5">
          <div className="space-y-3">
            <h3 className="text-base font-medium">Agent assignment</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Lead developer</p>
                {leadOptions.map(([value, label]) => (
                  <label key={value} className={getChoiceClass()}>
                    <input type="radio" value={value} {...register('agents.lead')} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Reviewer</p>
                {reviewerOptions.map(([value, label]) => (
                  <label key={value} className={getChoiceClass()}>
                    <input type="radio" value={value} {...register('agents.reviewer')} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <label className="block text-sm font-medium">
            Custom plugins
            <textarea
              rows={6}
              {...register('tech.pluginsText')}
              className={getFieldClass(Boolean(errors.tech?.pluginsText))}
              placeholder="@vercel/analytics"
            />
            <span className="text-muted mt-1 block text-xs">Use one package per line.</span>
          </label>
        </section>
      </div>
    </section>
  );
}
