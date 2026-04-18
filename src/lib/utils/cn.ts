/**
 * Utility for merging Tailwind class names.
 * Replaces clsx + tailwind-merge pattern.
 * For full merge support, install: tailwind-merge
 */
type ClassValue = string | undefined | null | false | ClassValue[]

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
