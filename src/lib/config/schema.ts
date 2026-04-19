import { z } from 'zod';

export const frameworkOptions = ['next', 'astro', 'vite'] as const;
export const deploymentOptions = ['vercel', 'netlify', 'cloudflare', 'static', 'docker'] as const;
export const cmsOptions = ['none', 'sanity', 'contentful', 'markdown'] as const;
export const agentOptions = ['claude-code', 'codex', 'hermes'] as const;

export const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

const pageSchema = z.object({
  slug: z.string().min(1, 'Page slug is required'),
  sections: z.array(z.string()).min(1, 'At least one section is required'),
  description: z.string(),
});

export const wizardFormSchema = z.object({
  project: z.object({
    name: z.string().min(1, 'Project name is required'),
    repo: z
      .string()
      .min(1, 'Repo name is required')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
    description: z.string(),
    domain: z.string(),
    owner: z.string().min(1, 'GitHub owner is required'),
  }),
  brand: z.object({
    colors: z.object({
      primary: z.string().regex(hexColorPattern, 'Use a 6-digit hex color'),
      secondary: z.string().regex(hexColorPattern, 'Use a 6-digit hex color'),
      accent: z.string().regex(hexColorPattern, 'Use a 6-digit hex color'),
      background: z.string().regex(hexColorPattern, 'Use a 6-digit hex color'),
      foreground: z.string().regex(hexColorPattern, 'Use a 6-digit hex color'),
      muted: z.string().regex(hexColorPattern, 'Use a 6-digit hex color'),
      border: z.string().regex(hexColorPattern, 'Use a 6-digit hex color'),
    }),
    typography: z.object({
      heading: z.string().min(1, 'Heading font is required'),
      body: z.string().min(1, 'Body font is required'),
    }),
  }),
  content: z.object({
    pages: z.array(pageSchema).min(1, 'At least one page is required'),
    assets: z.array(z.string()),
  }),
  tech: z.object({
    framework: z.enum(frameworkOptions),
    deploy: z.enum(deploymentOptions),
    ssr: z.boolean(),
    cms: z.enum(cmsOptions),
    pluginsText: z.string(),
  }),
  agents: z.object({
    lead: z.enum(agentOptions),
    reviewer: z.enum(agentOptions),
  }),
});

export type WizardFormValues = z.infer<typeof wizardFormSchema>;

export interface ProjectConfig {
  project: WizardFormValues['project'];
  brand: WizardFormValues['brand'];
  content: WizardFormValues['content'];
  tech: Omit<WizardFormValues['tech'], 'pluginsText'> & {
    plugins: string[];
  };
  agents: WizardFormValues['agents'];
}

export const defaultWizardValues: WizardFormValues = {
  project: {
    name: '',
    repo: '',
    description: '',
    domain: '',
    owner: 'sabnanikl-dev',
  },
  brand: {
    colors: {
      primary: '#0F0F0F',
      secondary: '#52525B',
      accent: '#E4E4E7',
      background: '#FAFAFA',
      foreground: '#09090B',
      muted: '#71717A',
      border: '#E4E4E7',
    },
    typography: {
      heading: 'system-ui, -apple-system, sans-serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
  },
  content: {
    pages: [
      {
        slug: 'home',
        sections: ['hero', 'footer'],
        description: 'Default landing page scaffold.',
      },
    ],
    assets: [],
  },
  tech: {
    framework: 'next',
    deploy: 'static',
    ssr: false,
    cms: 'none',
    pluginsText: '',
  },
  agents: {
    lead: 'claude-code',
    reviewer: 'codex',
  },
};

export function parsePlugins(pluginsText: string): string[] {
  return pluginsText
    .split('\n')
    .map((plugin) => plugin.trim())
    .filter(Boolean);
}

export function toProjectConfig(values: WizardFormValues): ProjectConfig {
  return {
    project: values.project,
    brand: values.brand,
    content: values.content,
    tech: {
      framework: values.tech.framework,
      deploy: values.tech.deploy,
      ssr: values.tech.ssr,
      cms: values.tech.cms,
      plugins: parsePlugins(values.tech.pluginsText),
    },
    agents: values.agents,
  };
}
