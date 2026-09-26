'use client'

import { useId, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CookieBarProps = {
  acceptLabel?: string
  children?: ReactNode
  className?: string
  cookiesHref?: string
  cookiesLinkLabel?: string
  onAcceptAll?: () => void
  onRejectAll?: () => void
  onSettings?: () => void
  /** Renders the bar fixed to the bottom of the viewport (default) or in flow. */
  position?: 'fixed' | 'static'
  privacyHref?: string
  privacyLinkLabel?: string
  rejectLabel?: string
  settingsHref?: string
  settingsLabel?: string
  title?: string
}

/**
 * IDSK "Cookie lišta". Desktop: white panel with 10px radius, 30px vertical
 * and 60px horizontal padding and the Big shadow, Headline L title (36/45,
 * weight 900), Perex text (24/36), Body links, then 60px of space before two
 * secondary L buttons 25px apart and a "Nastavenia cookies" link. Mobile: the
 * panel sticks to the bottom edge with top corners rounded, 40px / 20px
 * padding, a 24/35 weight 900 title, Body 1 text, 40px of space and stacked
 * full-width buttons.
 */
export function CookieBar({
  acceptLabel = 'Prijať súbory cookies',
  children = 'Používame cookies, aby sme vám zabezpečili čo najlepší zážitok z používania našich webových stránok. Súbory cookies nám pomáhajú analyzovať návštevnosť a prispôsobovať obsah.',
  className,
  cookiesHref = '#cookies',
  cookiesLinkLabel = 'nastaveniach cookies',
  onAcceptAll,
  onRejectAll,
  onSettings,
  position = 'fixed',
  privacyHref = '#privacy',
  privacyLinkLabel = 'zásadách ochrany osobných údajov.',
  rejectLabel = 'Odmietnuť súbory cookies',
  settingsHref,
  settingsLabel = 'Nastavenia cookies',
  title = 'Táto webová stránka používa súbory cookies',
}: CookieBarProps) {
  const generatedId = useId()
  const titleId = `${generatedId}-title`
  const descriptionId = `${generatedId}-description`
  const linkClassName =
    'text-link underline hover:decoration-[3px] focus-visible:rounded-[5px] focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus'

  return (
    <section
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={cn(
        position === 'fixed' && 'fixed inset-x-0 bottom-0 z-50 sm:bottom-5 sm:px-5',
        className,
      )}
      role="region"
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-[1200px] flex-col gap-10 rounded-t-[10px] bg-white px-5 pt-10 pb-10 shadow-idsk-lg',
          position === 'fixed' && 'max-h-[100dvh] overflow-y-auto overscroll-contain sm:max-h-[calc(100dvh-40px)]',
          'sm:gap-[60px] sm:rounded-[10px] sm:px-[60px] sm:py-[30px]',
        )}
      >
        <div className="flex flex-col gap-[15px] sm:gap-5">
          <h2 className="text-[24px] leading-[35px] font-black text-foreground sm:text-[36px] sm:leading-[45px]" id={titleId}>
            {title}
          </h2>
          <p className="text-[16px] leading-6 text-foreground sm:text-[24px] sm:leading-9" id={descriptionId}>
            {children}
          </p>
          <p className="text-[16px] leading-6 text-foreground sm:text-[19px] sm:leading-7">
            Viac informácií nájdete v{' '}
            <a className={linkClassName} href={cookiesHref}>
              {cookiesLinkLabel}
            </a>{' '}
            a v{' '}
            <a className={linkClassName} href={privacyHref}>
              {privacyLinkLabel}
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-[25px] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-col gap-[25px] sm:flex-row sm:flex-wrap sm:items-center">
            <Button className="w-full sm:w-auto" onClick={onAcceptAll} size="lg" type="button" variant="secondary">
              {acceptLabel}
            </Button>
            <Button className="w-full sm:w-auto" onClick={onRejectAll} size="lg" type="button" variant="secondary">
              {rejectLabel}
            </Button>
          </div>
          {settingsHref ? (
            <a className={cn(linkClassName, 'text-[19px] leading-7 sm:text-[24px] sm:leading-9')} href={settingsHref}>
              {settingsLabel}
            </a>
          ) : (
            <Button
              className="text-[19px] leading-7 sm:text-[24px] sm:leading-9"
              onClick={onSettings}
              type="button"
              variant="text-inline"
            >
              {settingsLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

export type { CookieBarProps }
