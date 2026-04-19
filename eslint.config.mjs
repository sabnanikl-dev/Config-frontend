/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    // Apply to all TS/TSX files
    files: ['**/*.{ts,tsx}'],
  },
  {
    extends: ['next/core-web-vitals', 'next/typescript'],
  },
  {
    rules: {
      // No console.log in production code
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Prefer named exports for components
      'import/no-default-export': 'off',
      'import/no-anonymous-default-export': 'warn',
      // React specific
      '@next/next/no-img-element': 'warn', // use <Image> instead
      'prefer-const': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
]
