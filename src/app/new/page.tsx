'use client';

import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { StepBrand } from '@/components/form/step-brand';
import { StepPages } from '@/components/form/step-pages';
import { StepProject } from '@/components/form/step-project';
import { StepReview } from '@/components/form/step-review';
import { StepTech } from '@/components/form/step-tech';
import { cn } from '@/lib/utils/cn';
import { defaultWizardValues, type WizardFormValues, wizardFormSchema } from '@/lib/config/schema';

const steps = [
  { id: 'project', label: 'Project', icon: '01' },
  { id: 'brand', label: 'Brand', icon: '02' },
  { id: 'pages', label: 'Pages', icon: '03' },
  { id: 'tech', label: 'Tech', icon: '04' },
  { id: 'review', label: 'Review', icon: '05' },
] as const;

type StepId = (typeof steps)[number]['id'];

const stepValidationFields: Record<
  Exclude<StepId, 'review'>,
  Parameters<ReturnType<typeof useForm<WizardFormValues>>['trigger']>[0]
> = {
  project: ['project.name', 'project.repo', 'project.owner'],
  brand: [
    'brand.colors.primary',
    'brand.colors.secondary',
    'brand.colors.accent',
    'brand.colors.background',
    'brand.colors.foreground',
    'brand.colors.muted',
    'brand.colors.border',
    'brand.typography.heading',
    'brand.typography.body',
  ],
  pages: undefined,
  tech: [
    'tech.framework',
    'tech.deploy',
    'tech.cms',
    'tech.pluginsText',
    'agents.lead',
    'agents.reviewer',
  ],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewConfigPage() {
  const [currentStep, setCurrentStep] = useState<StepId>('project');
  const form = useForm<WizardFormValues>({
    defaultValues: defaultWizardValues,
    mode: 'onBlur',
    resolver: zodResolver(wizardFormSchema),
  });

  const projectName = form.watch('project.name');
  const currentValues = form.watch();
  const currentIndex = steps.findIndex((step) => step.id === currentStep);
  const isReviewStep = currentStep === 'review';

  useEffect(() => {
    if (!form.formState.dirtyFields.project?.repo) {
      form.setValue('project.repo', slugify(projectName), {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [form, projectName]);

  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 'project':
        return <StepProject errors={form.formState.errors} register={form.register} />;
      case 'brand':
        return <StepBrand errors={form.formState.errors} form={form} />;
      case 'pages':
        return <StepPages form={form} />;
      case 'tech':
        return <StepTech errors={form.formState.errors} register={form.register} />;
      case 'review':
        return <StepReview values={currentValues} />;
      default:
        return null;
    }
  }, [currentStep, currentValues, form]);

  async function canMoveToStep(nextStep: StepId) {
    if (nextStep !== 'review') {
      return true;
    }

    return form.trigger();
  }

  async function handleNext() {
    if (currentStep === 'review') {
      return;
    }

    const valid = await form.trigger(stepValidationFields[currentStep]);
    if (!valid) {
      return;
    }

    const nextStep = steps[currentIndex + 1]?.id;
    if (!nextStep) {
      return;
    }

    if (await canMoveToStep(nextStep)) {
      setCurrentStep(nextStep);
    }
  }

  async function handleStepChange(stepId: StepId) {
    if (stepId === currentStep) {
      return;
    }

    const targetIndex = steps.findIndex((step) => step.id === stepId);
    if (targetIndex <= currentIndex) {
      setCurrentStep(stepId);
      return;
    }

    if (currentStep !== 'review') {
      const valid = await form.trigger(stepValidationFields[currentStep]);
      if (!valid) {
        return;
      }
    }

    if (await canMoveToStep(stepId)) {
      setCurrentStep(stepId);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-muted text-sm tracking-[0.2em] uppercase">Project Config Wizard</p>
            <h1 className="text-4xl font-semibold tracking-tight">New Configuration</h1>
          </div>
          <div className="border-border text-muted rounded-full border px-3 py-1 text-sm">
            {form.formState.isDirty ? 'Unsaved changes' : 'All changes saved locally'}
          </div>
        </div>
        <p className="text-muted max-w-3xl text-sm">
          Build the baseline project config for Hermes. The wizard keeps one form instance across
          every step and validates before you reach export.
        </p>
      </header>

      <nav className="grid gap-3 sm:grid-cols-5">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isComplete = index < currentIndex;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => void handleStepChange(step.id)}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                isActive
                  ? 'border-foreground bg-foreground text-background'
                  : isComplete
                    ? 'border-border bg-accent/60 text-foreground'
                    : 'border-border bg-background text-muted',
              )}
            >
              <span className="text-xs font-medium tracking-wide">{step.icon}</span>
              <span className="text-sm font-medium">{step.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-border bg-background rounded-2xl border p-6 shadow-sm sm:p-8">
        <form onSubmit={(event) => event.preventDefault()}>{stepContent}</form>
      </div>

      <div className="border-border flex items-center justify-between gap-4 border-t pt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(steps[currentIndex - 1]?.id ?? currentStep)}
          disabled={currentIndex === 0}
          className="border-border rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-40"
        >
          Back
        </button>

        {isReviewStep ? (
          <p className="text-muted text-sm">
            Downloads are generated directly from the current form state.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => void handleNext()}
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
