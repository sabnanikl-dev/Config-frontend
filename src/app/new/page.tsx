"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProjectConfigSchema, defaultConfig, type ProjectConfig } from "@/lib/config/schema"
import { StepProject } from "@/components/form/step-project"
import { StepBrand } from "@/components/form/step-brand"
import { StepTech } from "@/components/form/step-tech"
// StepPages is not yet exported to keep the wizard minimal for now — Issue #4
// import { StepPages } from "@/components/form/step-pages"
import { StepReview } from "@/components/form/step-review"

const steps = [
  { id: "project" as const, label: "Project Info", icon: "📋" },
  { id: "brand" as const, label: "Brand", icon: "🎨" },
  // { id: "pages", label: "Pages", icon: "📄" },
  { id: "tech" as const, label: "Tech Stack", icon: "⚙️" },
  { id: "review" as const, label: "Review & Export", icon: "🚀" },
]

type StepId = (typeof steps)[number]["id"]

export default function NewPage() {
  const [currentStep, setCurrentStep] = useState<StepId>("project")

  const form = useForm<ProjectConfig>({
    resolver: zodResolver(ProjectConfigSchema),
    defaultValues: defaultConfig,
    mode: "onChange",
  })

  const current = form.watch()
  const stepIndex = steps.findIndex((s) => s.id === currentStep)

  function goNext() {
    const order = steps.map((s) => s.id)
    const idx = order.indexOf(currentStep)
    if (idx < order.length - 1) setCurrentStep(order[idx + 1])
  }

  function goPrev() {
    const order = steps.map((s) => s.id)
    const idx = order.indexOf(currentStep)
    if (idx > 0) setCurrentStep(order[idx - 1])
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      {/* Step indicator */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((step, i) => {
          const isActive = step.id === currentStep
          const isComplete = i < stepIndex
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id as StepId)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : isComplete
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{step.icon}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        {currentStep === "project" && (
          <StepProject register={form.register} errors={form.formState.errors} />
        )}
        {currentStep === "brand" && (
          <StepBrand register={form.register} errors={form.formState.errors} />
        )}
        {/* {currentStep === "pages" && (
          <StepPages form={form} errors={form.formState.errors} />
        )} */}
        {currentStep === "tech" && (
          <StepTech register={form.register} errors={form.formState.errors} />
        )}
        {currentStep === "review" && <StepReview data={current} />}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t pt-6">
          <button
            type="button"
            onClick={goPrev}
            disabled={stepIndex === 0}
            className="rounded-md border px-4 py-2 text-sm disabled:opacity-30"
          >
            Back
          </button>

          {currentStep !== "review" ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
            >
              Next
            </button>
          ) : (
            <span className="text-sm text-muted-foreground">
              Download your config file above.
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
