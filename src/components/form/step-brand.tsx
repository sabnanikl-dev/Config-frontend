'use client';

import type { FieldErrors, UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils/cn';
import type { WizardFormValues } from '@/lib/config/schema';

const colorFields = [
  ['primary', 'Primary'],
  ['secondary', 'Secondary'],
  ['accent', 'Accent'],
  ['background', 'Background'],
  ['foreground', 'Foreground'],
  ['muted', 'Muted'],
  ['border', 'Border'],
] as const;

export interface StepBrandProps {
  errors: FieldErrors<WizardFormValues>;
  form: UseFormReturn<WizardFormValues>;
}

function getFieldClass(hasError: boolean) {
  return cn(
    'bg-background w-full rounded-md border px-3 py-2 font-mono text-sm transition-colors outline-none',
    hasError ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-foreground/40',
  );
}

export function StepBrand({ errors, form }: StepBrandProps) {
  const colors = form.watch('brand.colors');

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight">Brand</h2>
        <p className="text-muted max-w-2xl text-sm">
          Set the neutral palette and typography tokens that feed the exported scaffold.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {colorFields.map(([field, label]) => {
          const name = `brand.colors.${field}` as const;
          const error = errors.brand?.colors?.[field];
          const value = colors[field];

          return (
            <div key={field} className="border-border space-y-2 rounded-lg border p-4">
              <label className="block text-sm font-medium">{label}</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={value}
                  onChange={(event) => {
                    form.setValue(name, event.target.value.toUpperCase(), {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  className="border-border bg-background h-10 w-10 rounded-md border p-0"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(event) => {
                    form.setValue(name, event.target.value.toUpperCase(), {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  className={getFieldClass(Boolean(error))}
                  placeholder="#000000"
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error.message}</p> : null}
            </div>
          );
        })}
      </div>

      <div className="border-border grid gap-6 border-t pt-6 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Heading font
          <input
            type="text"
            {...form.register('brand.typography.heading')}
            className={getFieldClass(Boolean(errors.brand?.typography?.heading))}
          />
          {errors.brand?.typography?.heading ? (
            <span className="mt-1 block text-sm text-red-600">
              {errors.brand.typography.heading.message}
            </span>
          ) : null}
        </label>

        <label className="block text-sm font-medium">
          Body font
          <input
            type="text"
            {...form.register('brand.typography.body')}
            className={getFieldClass(Boolean(errors.brand?.typography?.body))}
          />
          {errors.brand?.typography?.body ? (
            <span className="mt-1 block text-sm text-red-600">
              {errors.brand.typography.body.message}
            </span>
          ) : null}
        </label>
      </div>
    </section>
  );
}
