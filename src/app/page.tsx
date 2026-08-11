import { HomeDemo } from '@/components/home-demo'
import {
  GITHUB_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'sk-SK',
    },
    {
      '@type': 'SoftwareSourceCode',
      '@id': `${SITE_URL}/#project`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      description: SITE_DESCRIPTION,
      codeRepository: GITHUB_URL,
      programmingLanguage: ['TypeScript', 'TSX', 'CSS'],
      runtimePlatform: 'React, Next.js',
      isAccessibleForFree: true,
      keywords: [
        'IDSK 3.1',
        'React',
        'shadcn/ui',
        'Tailwind CSS',
        'slovenská verejná správa',
      ],
      inLanguage: 'sk-SK',
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
        type="application/ld+json"
      />
      <HomeDemo />
    </>
  )
}
