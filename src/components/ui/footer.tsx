import type { ReactNode } from 'react'

import { GovernmentLogo } from '@/components/ui/government-logo'
import { cn } from '@/lib/utils'

type FooterLink = {
  href: string
  label: string
  newWindow?: boolean
}

type FooterColumn = {
  links: FooterLink[]
  title: string
}

type FooterProps = {
  ariaLabel?: string
  className?: string
  columns?: FooterColumn[]
  cookieNotice?: ReactNode
  logo?: ReactNode
  logoHref?: string
  operator?: ReactNode
  supportingLinks?: FooterLink[]
}

const defaultSupportingLinks: FooterLink[] = [
  { href: '#accessibility', label: 'Vyhlásenie o prístupnosti' },
  { href: '#contact', label: 'Kontakt na prevádzkovateľa' },
  { href: '#sitemap', label: 'Mapa stránky' },
]

export function IdskFooter({
  ariaLabel,
  className,
  columns = [],
  cookieNotice = 'Na tomto webovom sídle sa využívajú len nevyhnutné/technické cookies.',
  logo,
  logoHref,
  operator = 'Neoficiálna ukážka React / shadcn komponentov postavených na pravidlách IDSK.',
  supportingLinks = defaultSupportingLinks,
}: FooterProps) {
  const logoContent = logo ?? <GovernmentLogo />

  return (
    <footer
      aria-label={ariaLabel}
      className={cn('w-full border-t border-border bg-surface-muted', className)}
    >
      <div className="idsk-container flex flex-wrap items-end justify-between gap-8 py-12">
        <div className="min-w-0 flex-[1_1_560px] text-base leading-6 text-foreground">
          {columns.length ? (
            <nav aria-label="Navigácia v päte" className="border-b border-border pb-7">
              <div className="flex flex-wrap gap-x-20 gap-y-10">
                {columns.map((column) => (
                  <div className="min-w-[180px] flex-1" key={column.title}>
                    <h2 className="mb-4 text-lg font-bold">{column.title}</h2>
                    <ul className="m-0 list-none space-y-3 p-0">
                      {column.links.map((link) => (
                        <li key={`${link.href}-${link.label}`}>
                          <FooterAnchor link={link} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          ) : null}

          {cookieNotice ? <div className={cn(columns.length && 'mt-5')}>{cookieNotice}</div> : null}

          {supportingLinks.length ? (
            <nav aria-label="Doplňujúce odkazy" className="mt-4">
              <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
                {supportingLinks.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <FooterAnchor link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {operator ? <div className="mt-4">{operator}</div> : null}
        </div>

        <div className="max-w-full shrink-0">
          {logoHref ? (
            <a
              className="block max-w-[290px] rounded-[5px] text-foreground no-underline hover:text-foreground hover:ring-4 hover:ring-foreground-muted"
              href={logoHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              {logoContent}
              <span className="sr-only"> (otvorí sa v novom okne)</span>
            </a>
          ) : (
            logoContent
          )}
        </div>
      </div>
    </footer>
  )
}

function FooterAnchor({ link }: { link: FooterLink }) {
  return (
    <a
      className="idsk-link text-foreground"
      href={link.href}
      rel={link.newWindow ? 'noopener noreferrer' : undefined}
      target={link.newWindow ? '_blank' : undefined}
    >
      {link.label}
      {link.newWindow ? <span className="sr-only"> (otvorí sa v novom okne)</span> : null}
    </a>
  )
}

export type { FooterColumn, FooterLink, FooterProps }
