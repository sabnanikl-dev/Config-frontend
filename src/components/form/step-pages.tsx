'use client';

import type { UseFormReturn } from 'react-hook-form';

import type { WizardFormValues } from '@/lib/config/schema';

export interface StepPagesProps {
  form: UseFormReturn<WizardFormValues>;
}

export function StepPages({ form }: StepPagesProps) {
  const pages = form.watch('content.pages');

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight">Pages</h2>
        <p className="text-muted max-w-2xl text-sm">
          Issue #4 will add the full page builder. This step keeps the wizard flow complete and
          shows the default page data that will be exported right now.
        </p>
      </header>

      <div className="space-y-4">
        {pages.map((page, index) => (
          <article key={`${page.slug}-${index}`} className="border-border rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-medium">/{page.slug}</h3>
              <span className="text-muted text-xs tracking-wide uppercase">Default</span>
            </div>
            <p className="text-muted mt-2 text-sm">{page.description || 'No description yet.'}</p>
            <p className="mt-3 text-sm">
              <span className="font-medium">Sections:</span> {page.sections.join(', ')}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
