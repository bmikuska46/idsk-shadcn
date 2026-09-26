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
  /** DOM id, e.g. `paticka` for skip links. */
  id?: string
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
  { href: '#rss', label: 'RSS' },
  { href: '#sitemap', label: 'Mapa stránky' },
]

/**
 * IDSK "Pätička": N100 surface with a 1px N400 top border and 30px vertical
 * padding. Link columns have Headline S (20/26) titles underlined by a 1px
 * N400 rule, links 20px apart and columns 30px apart. The columns block is
 * closed by another N400 rule, followed by the cookie notice, supporting
 * links and operator text 30px apart.
 */
export function IdskFooter({
  ariaLabel,
  className,
  columns = [],
  id,
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
      className={cn('w-full border-t border-border-muted bg-surface-muted', className)}
      id={id}
    >
      <div className="idsk-container flex flex-col gap-5 py-5 sm:py-[30px]">
        {columns.length ? (
          <nav aria-label="Navigácia v päte" className="border-b border-border-muted pb-[14px] sm:pb-[19px]">
            <div className={cn('grid gap-[30px]', columns.length > 1 && 'sm:grid-cols-2', columns.length === 3 ? 'lg:grid-cols-3' : columns.length >= 4 ? 'lg:grid-cols-4' : undefined)}>
              {columns.map((column) => (
                <div className="min-w-0" key={column.title}>
                  <h2 className="mb-[10px] border-b border-border-muted pb-[9px] text-[19px] leading-6 font-bold text-foreground sm:text-[20px] sm:leading-[26px]">
                    {column.title}
                  </h2>
                  <ul className="m-0 flex list-none flex-col gap-[15px] p-0 sm:gap-5">
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

        <div className="flex flex-wrap items-end justify-between gap-5 sm:gap-[30px]">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-[15px] text-[14px] leading-5 text-foreground sm:gap-5 sm:text-[16px] sm:leading-6">
            {cookieNotice ? <div>{cookieNotice}</div> : null}

            {supportingLinks.length ? (
              <nav aria-label="Doplňujúce odkazy">
                <ul className="m-0 flex list-none flex-col gap-[10px] p-0 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-0">
                  {supportingLinks.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <FooterAnchor link={link} />
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            {operator ? <div>{operator}</div> : null}
          </div>

          <div className="max-w-full shrink-0">
            {logoHref ? (
              <a
                className="block max-w-[290px] rounded-[5px] text-foreground no-underline hover:text-foreground hover:ring-[5px] hover:ring-foreground-muted"
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
      </div>
    </footer>
  )
}

function FooterAnchor({ link }: { link: FooterLink }) {
  return (
    <a
      className="idsk-link text-[14px] leading-5 text-foreground sm:text-[16px] sm:leading-6"
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
