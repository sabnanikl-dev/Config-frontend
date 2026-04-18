# Design System

## Brand Colors

Neutral palette for the internal config tool. Edit `@theme` in `src/styles/globals.css`.

```css
--color-primary: #0f0f0f;
--color-primary-foreground: #fafafa;
--color-secondary: #52525b;
--color-accent: #e4e4e7;
--color-muted: #71717a;
--color-border: #e4e4e7;
--color-background: #fafafa;
--color-foreground: #09090b;
```

## Typography
- system-ui stack (no custom fonts)

## Rules
1. Never use hex codes in components — use `text-primary`, `bg-accent`
2. No arbitrary Tailwind values `[]`
3. 60-30-10 rule
