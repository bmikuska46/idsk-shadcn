import type { Metadata } from 'next'
import '@fontsource/source-sans-pro/400.css'
import '@fontsource/source-sans-pro/700.css'
import '@fontsource/source-sans-pro/900.css'

import '@/index.css'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'IDSK shadcn - React komponenty pre slovenské e-služby',
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: '/',
    languages: {
      'sk-SK': '/',
    },
  },
  keywords: [
    'IDSK',
    'IDSK 3.1',
    'shadcn',
    'React komponenty',
    'Tailwind CSS',
    'dizajnový systém',
    'elektronické služby',
    'verejná správa',
    'Slovensko',
  ],
  category: 'technology',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    url: '/',
    siteName: SITE_NAME,
    title: 'IDSK shadcn - React komponenty pre slovenské e-služby',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: 'IDSK shadcn - React komponenty podľa dizajnového systému IDSK 3.1',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IDSK shadcn - React komponenty pre slovenské e-služby',
    description: SITE_DESCRIPTION,
    images: ['/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sk">
      <body>{children}</body>
    </html>
  )
}
