import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine Tailwind classes with clsx
 */
export function cn(...inputs: (string | boolean | undefined | null)[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to Turkish locale
 */
export function formatDate(date: string | Date, locale = 'tr-TR') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Sleep for given milliseconds
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout>
  return function (...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}