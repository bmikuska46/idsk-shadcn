import type { SVGProps } from 'react'

import { cn } from '@/lib/utils'

/** Google Material Icons, Apache-2.0. Adapted to React and currentColor.
 * Source: https://github.com/google/material-design-icons
 * License: docs/licenses/material-icons-Apache-2.0.txt
 */
const paths = {
  "mail": [
    "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
  ],
  "notifications": [
    "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
  ],
  "info": [
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
  ],
  "checkCircle": [
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
  ],
  "warning": [
    "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
  ],
  "error": [
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
  ],
  "expandMore": [
    "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
  ],
  "expandLess": [
    "M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"
  ],
  "chevronLeft": [
    "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
  ],
  "chevronRight": [
    "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
  ],
  "menu": [
    "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
  ],
  "search": [
    "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
  ],
  "close": [
    "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
  ],
  "cloudUpload": [
    "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
  ],
  "file": [
    "M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"
  ],
  "add": [
    "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
  ],
  "upload": [
    "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"
  ],
  "check": [
    "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
  ],
  "remove": [
    "M19 13H5v-2h14v2z"
  ],
  "home": [
    "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
  ],
  "arrowForward": [
    "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
  ]
} as const

export type MaterialIconName = keyof typeof paths

export function MaterialIcon({ name, className, ...props }: SVGProps<SVGSVGElement> & { name: MaterialIconName }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" className={cn('size-6 shrink-0', className)} {...props}>
      {paths[name].map((path) => <path d={path} key={path} />)}
    </svg>
  )
}
