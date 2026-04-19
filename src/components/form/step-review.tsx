'use client';

import yaml from 'js-yaml';

import type { ProjectConfig, WizardFormValues } from '@/lib/config/schema';
import { toProjectConfig } from '@/lib/config/schema';

export interface StepReviewProps {
  values: WizardFormValues;
}

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildMarkdown(config: ProjectConfig) {
  return `---\n${yaml.dump(config)}---\n`;
}

export function StepReview({ values }: StepReviewProps) {
  const config = toProjectConfig(values);
  const baseFilename = config.project.repo || 'project';
  const plugins = config.tech.plugins;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight">Review &amp; Export</h2>
        <p className="text-muted max-w-2xl text-sm">
          Sanity-check the collected config and download it in the format Hermes needs.
        </p>
      </header>

      <div className="border-border grid gap-4 rounded-xl border p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-muted text-xs tracking-wide uppercase">Project</p>
          <p className="text-sm">{config.project.name || 'Untitled project'}</p>
          <p className="text-muted text-sm">
            {config.project.owner}/{config.project.repo}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-muted text-xs tracking-wide uppercase">Stack</p>
          <p className="text-sm">
            {config.tech.framework} on {config.tech.deploy}
          </p>
          <p className="text-muted text-sm">
            CMS: {config.tech.cms} · SSR: {config.tech.ssr ? 'enabled' : 'disabled'}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-muted text-xs tracking-wide uppercase">Agents</p>
          <p className="text-sm">
            Lead: {config.agents.lead} · Reviewer: {config.agents.reviewer}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-muted text-xs tracking-wide uppercase">Plugins</p>
          <p className="text-sm">{plugins.length ? plugins.join(', ') : 'No custom plugins'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() =>
            downloadTextFile(`${baseFilename}-config.yaml`, yaml.dump(config), 'text/yaml')
          }
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
        >
          Download YAML
        </button>
        <button
          type="button"
          onClick={() =>
            downloadTextFile(
              `${baseFilename}-config.json`,
              `${JSON.stringify(config, null, 2)}\n`,
              'application/json',
            )
          }
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
        >
          Download JSON
        </button>
        <button
          type="button"
          onClick={() =>
            downloadTextFile(`${baseFilename}-config.md`, buildMarkdown(config), 'text/markdown')
          }
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
        >
          Download Markdown
        </button>
      </div>

      <details className="border-border rounded-xl border">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium">Preview YAML</summary>
        <pre className="border-border bg-accent/40 overflow-x-auto border-t p-4 text-xs leading-6">
          {yaml.dump(config)}
        </pre>
      </details>
    </section>
  );
}
