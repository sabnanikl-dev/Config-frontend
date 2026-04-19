import { z } from "zod"

export const ProjectConfigSchema = z.object({
  project: z.object({
    name: z.string().min(1, "Project name is required"),
    repo: z.string().min(1, "Repo name is required"),
    description: z.string(),
    domain: z.string(),
    owner: z.string(),
  }),
  brand: z.object({
    colors: z.object({
      primary: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
      secondary: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
      accent: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
      background: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
      foreground: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
      muted: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
      border: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
    }),
    typography: z.object({
      heading: z.string(),
      body: z.string(),
    }),
  }),
  content: z.object({
    pages: z.array(
      z.object({
        slug: z.string().min(1, "Page slug is required"),
        sections: z.array(z.string()),
        description: z.string(),
        type: z
          .enum(["landing", "dashboard", "settings", "list", "detail", "board", "admin"])
          .optional(),
      })
    ).min(1, "At least one page is required"),
    assets: z.array(z.string()),
  }),
  app: z.object({
    capabilities: z.array(z.string()),
    dataModels: z.array(z.string()),
    integrations: z.array(z.string()),
  }),
  tech: z.object({
    framework: z.enum(["next", "astro", "vite"]),
    deploy: z.enum(["vercel", "netlify", "cloudflare", "static", "docker"]),
    ssr: z.boolean(),
    plugins: z.array(z.string()),
    cms: z.enum(["none", "sanity", "contentful", "markdown"]),
  }),
  agents: z.object({
    lead: z.enum(["claude-code", "codex", "hermes"]),
    reviewer: z.enum(["claude-code", "codex", "hermes"]),
    workflow: z.object({
      builder: z.string(),
      updater: z.string(),
      escalation: z.string(),
    }),
  }),
})

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>

export const defaultConfig: ProjectConfig = {
  project: {
    name: "",
    repo: "",
    description: "",
    domain: "",
    owner: "sabnanikl-dev",
  },
  brand: {
    colors: {
      primary: "#0f0f0f",
      secondary: "#52525b",
      accent: "#e4e4e7",
      background: "#ffffff",
      foreground: "#09090b",
      muted: "#71717a",
      border: "#e4e4e7",
    },
    typography: {
      heading: "system-ui, -apple-system, sans-serif",
      body: "system-ui, -apple-system, sans-serif",
    },
  },
  content: {
    pages: [
      { slug: "home", sections: ["hero", "footer"], description: "" },
    ],
    assets: [],
  },
  app: {
    capabilities: [],
    dataModels: [],
    integrations: [],
  },
  tech: {
    framework: "next",
    deploy: "static",
    ssr: false,
    plugins: [],
    cms: "none",
  },
  agents: {
    lead: "claude-code",
    reviewer: "codex",
    workflow: {
      builder: "",
      updater: "",
      escalation: "",
    },
  },
}
