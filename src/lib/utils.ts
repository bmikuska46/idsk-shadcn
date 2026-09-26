import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ['idsk-1', 'idsk-2', 'idsk-3', 'idsk-4', 'idsk-5', 'idsk-6'],
      shadow: ['idsk-sm', 'idsk-md', 'idsk-lg', 'idsk-dialog', 'idsk-head'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
