/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  // Use single quotes for consistency with JSX
  singleQuote: true,
  // Standard 2-space indent (Next.js convention)
  tabWidth: 2,
  printWidth: 100,
  trailingComma: 'all',
  semi: true,
  // Tailwind plugin auto-sorts classes
  plugins: ['prettier-plugin-tailwindcss'],
  // Tailwind plugin must always be last
  tailwindFunctions: ['clsx', 'cn'],
  // Ignore files
  useTabs: false,
}

module.exports = config
