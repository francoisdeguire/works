import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: (ClassValue | ((...args: never[]) => unknown))[]): string {
  return twMerge(clsx(inputs as ClassValue[]))
}
