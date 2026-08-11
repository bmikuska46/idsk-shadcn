'use client'

import { ChevronDown, Menu, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { GovernmentLogo } from '@/components/ui/government-logo'
import { SearchInput } from '@/components/ui/search-input'
import { cn } from '@/lib/utils'

type NavChild = {
  active?: boolean
  href: string
  label: string
}

type NavItem = {
  active?: boolean
  children?: NavChild[]
  href?: string
  label: string
}

type LanguageItem = {
  active?: boolean
  href: string
  label: string
  languageCode?: string
}

type HeaderAction = {
  ariaLabel?: string
  disabled?: boolean
  href?: string
  icon?: ReactNode
  label: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'text'
}

type HeaderProps = {
  actions?: HeaderAction[]
  className?: string
  homeHref?: string
  languageLinks?: LanguageItem[]
  nav?: NavItem[]
  officialInfoHref?: string
  onSearch?: (value: string) => void
  search?: boolean
  searchPlaceholder?: string
  serviceName: string
  showOfficialBanner?: boolean
  tagline?: string
  userName?: string
  variant?: 'website' | 'service'
}

export function IdskHeader({
  actions = [],
  className,
  homeHref = '/',
  languageLinks = [
    { href: '#', label: 'Slovenčina', languageCode: 'sk', active: true },
    { href: '#', label: 'English', languageCode: 'en' },
  ],
  nav = [],
  officialInfoHref = 'https://www.slovensko.sk/sk/agendy/agenda/_organy-verejnej-moci',
  onSearch,
  search = false,
  searchPlaceholder = 'Hľadať na stránke...',
  serviceName,
  showOfficialBanner = false,
  tagline = 'Neoficiálna ukážka komponentov',
  userName,
  variant = 'website',
}: HeaderProps) {
  const generatedId = useId()
  const [officialOpen, setOfficialOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openNav, setOpenNav] = useState<number | null>(null)
  const officialButtonRef = useRef<HTMLButtonElement>(null)
  const languageButtonRef = useRef<HTMLButtonElement>(null)
  const mobileButtonRef = useRef<HTMLButtonElement>(null)
  const navButtonRefs = useRef(new Map<number, HTMLButtonElement>())
  const activeLanguage = languageLinks.find((item) => item.active) ?? languageLinks[0]
  const hasNavigation = nav.length > 0
  const hasTopBar = showOfficialBanner || languageLinks.length > 0

  useEffect(() => {
    const closeMenus = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      const focusTarget = openNav !== null
        ? navButtonRefs.current.get(openNav)
        : languageOpen
          ? languageButtonRef.current
          : officialOpen
            ? officialButtonRef.current
            : mobileOpen
              ? mobileButtonRef.current
              : null

      setOfficialOpen(false)
      setLanguageOpen(false)
      setMobileOpen(false)
      setOpenNav(null)
      requestAnimationFrame(() => focusTarget?.focus())
    }

    document.addEventListener('keydown', closeMenus)
    return () => document.removeEventListener('keydown', closeMenus)
  }, [languageOpen, mobileOpen, officialOpen, openNav])

  return (
    <header
      className={cn('w-full bg-white font-sans shadow-idsk-head', className)}
      data-idsk="header"
      data-variant={variant}
    >
      {hasTopBar ? (
        <div className="relative z-30 flex w-full flex-col items-center bg-[#003078] text-white" data-idsk="top-bar">
          <div className={cn('idsk-container flex items-center gap-3 py-1', showOfficialBanner ? 'justify-between' : 'justify-end')}>
            {showOfficialBanner ? (
              <button
                aria-controls={`${generatedId}-official-panel`}
                aria-expanded={officialOpen}
                aria-label="Zobraziť informácie o oficiálnej stránke verejnej správy SR"
                className="idsk-focus-inverse my-px inline-flex min-h-10 min-w-0 items-center gap-1 rounded-[5px] py-2 text-left text-base leading-6 underline hover:ring-4 hover:ring-white active:bg-surface-primary active:text-primary-dark"
                onClick={() => {
                  setOfficialOpen((value) => !value)
                  setLanguageOpen(false)
                  setOpenNav(null)
                }}
                ref={officialButtonRef}
                type="button"
              >
                <span className="min-w-0">
                  Oficiálna stránka <strong>verejnej správy SR</strong>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn('size-4 shrink-0 transition-transform', officialOpen && 'rotate-180')}
                />
              </button>
            ) : null}

            {languageLinks.length ? (
              <div className="relative shrink-0">
                <button
                  aria-controls={`${generatedId}-languages`}
                  aria-expanded={languageOpen}
                  aria-label={`Zmeniť jazyk, zvolený jazyk: ${activeLanguage?.label ?? ''}`}
                  className="idsk-focus-inverse my-px inline-flex min-h-10 items-center gap-1.5 rounded-[5px] px-2 py-2 text-base font-bold leading-6 underline hover:ring-4 hover:ring-white active:bg-surface-primary active:text-primary-dark"
                  onClick={() => {
                    setLanguageOpen((value) => !value)
                    setOfficialOpen(false)
                    setOpenNav(null)
                  }}
                  ref={languageButtonRef}
                  type="button"
                >
                  <span lang={activeLanguage?.languageCode}>{activeLanguage?.label}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn('size-4 transition-transform', languageOpen && 'rotate-180')}
                  />
                </button>
                <ul
                  className="absolute right-0 top-full z-40 mt-1 min-w-40 list-none rounded-[5px] border border-border bg-white p-1 text-foreground shadow-idsk-sm"
                  hidden={!languageOpen}
                  id={`${generatedId}-languages`}
                >
                  {languageLinks.map((item) => (
                    <li key={`${item.languageCode}-${item.label}`}>
                      <a
                        aria-current={item.active ? 'true' : undefined}
                        className={cn(
                          'block rounded-[5px] px-3 py-2 text-base text-primary no-underline hover:bg-surface-primary',
                          item.active && 'font-bold',
                        )}
                        href={item.href}
                        lang={item.languageCode}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {showOfficialBanner ? (
            <div className="w-full" hidden={!officialOpen} id={`${generatedId}-official-panel`}>
              <div className="idsk-container grid gap-6 pb-5 pt-3 md:grid-cols-2">
                <div>
                  <h2 className="mb-2 text-base font-bold leading-6">Doména gov.sk je oficiálna</h2>
                  <p className="text-base leading-6">
                    Toto je oficiálna webová stránka orgánu verejnej moci Slovenskej republiky.{' '}
                    <a
                      className="idsk-focus-inverse rounded-[5px] text-white underline hover:text-white hover:decoration-[3px]"
                      href={officialInfoHref}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Zoznam orgánov verejnej moci
                      <span className="sr-only"> (otvorí sa v novom okne)</span>
                    </a>
                  </p>
                </div>
                <div>
                  <h2 className="mb-2 text-base font-bold leading-6">Táto stránka je zabezpečená</h2>
                  <p className="text-base leading-6">
                    Zabezpečenú stránku spoznáte podľa adresy začínajúcej https://. Citlivé údaje zdieľajte iba cez zabezpečené stránky verejnej správy.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex w-full flex-col items-center border-b border-border bg-white py-4" data-idsk="header-main-section">
        <div className="idsk-container flex flex-wrap items-center justify-between gap-4">
          <a
            aria-label={`Domovská stránka ${serviceName}`}
            className="min-w-0 rounded-[5px] no-underline hover:ring-4 hover:ring-foreground-muted"
            href={homeHref}
          >
            <GovernmentLogo siteName={serviceName} tagline={tagline} />
          </a>

          {search ? (
            <div className="order-3 hidden w-full max-w-[360px] min-[730px]:order-none min-[730px]:block">
              <SearchInput
                buttonAriaLabel="Vyhľadať"
                label="Hľadať na stránke"
                onSearch={onSearch}
                placeholder={searchPlaceholder}
              />
            </div>
          ) : null}

          <div className="flex shrink-0 items-center gap-3">
            {userName ? (
              <span className="hidden text-base font-bold text-foreground-soft sm:inline">
                {userName}
              </span>
            ) : null}
            <div className="hidden items-center gap-2 min-[730px]:flex">
              {actions.map((action) =>
                action.href && !action.disabled ? (
                  <Button
                    aria-label={action.ariaLabel}
                    asChild
                    key={action.label}
                    variant={action.variant ?? 'primary'}
                  >
                    <a href={action.href}>
                      {action.icon}
                      {action.label}
                    </a>
                  </Button>
                ) : (
                  <Button
                    aria-label={action.ariaLabel}
                    disabled={action.disabled}
                    key={action.label}
                    onClick={action.onClick}
                    type="button"
                    variant={action.variant ?? 'primary'}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ),
              )}
            </div>
            {(hasNavigation || search || actions.length > 0) ? (
              <button
                aria-controls={`${generatedId}-mobile-menu`}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Zatvoriť menu' : 'Otvoriť menu'}
                className="inline-flex min-h-10 items-center gap-2 rounded-[5px] border-2 border-primary-dark px-4 font-bold text-primary-dark hover:ring-4 hover:ring-foreground-muted min-[730px]:hidden"
                onClick={() => {
                  setMobileOpen((value) => !value)
                  setLanguageOpen(false)
                  setOfficialOpen(false)
                  setOpenNav(null)
                }}
                ref={mobileButtonRef}
                type="button"
              >
                {mobileOpen ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
                Menu
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {hasNavigation ? (
        <nav
          aria-label="Hlavná navigácia"
          className="hidden w-full flex-col items-center bg-white pt-1 min-[730px]:flex"
          data-idsk="website-navigation"
        >
          <ul className="idsk-container m-0 flex list-none flex-row gap-4" role="list">
            {nav.slice(0, 5).map((item, index) => (
              <li className="relative flex" key={item.label}>
                {item.children?.length ? (
                  <>
                    <button
                      aria-controls={`${generatedId}-nav-${index}`}
                      aria-expanded={openNav === index}
                      className={cn(
                        'flex h-12 items-center border-b-[3px] px-3 text-base font-bold text-primary-dark hover:rounded-[5px] hover:ring-4 hover:ring-foreground-muted',
                        item.active ? 'border-primary-dark bg-surface-primary' : 'border-transparent',
                      )}
                      onClick={() => {
                        setOpenNav((value) => value === index ? null : index)
                        setLanguageOpen(false)
                        setOfficialOpen(false)
                      }}
                      ref={(node) => {
                        if (node) navButtonRefs.current.set(index, node)
                        else navButtonRefs.current.delete(index)
                      }}
                      type="button"
                    >
                      {item.label}
                      <ChevronDown aria-hidden="true" className="ml-1 size-4" />
                    </button>
                    <ul
                      className="absolute left-0 top-full z-20 min-w-60 list-none rounded-b-[5px] border border-border bg-white p-2 shadow-idsk-md"
                      hidden={openNav !== index}
                      id={`${generatedId}-nav-${index}`}
                    >
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <a
                            aria-current={child.active ? 'page' : undefined}
                            className="block rounded-[5px] px-3 py-2 text-primary-dark no-underline hover:bg-surface-primary"
                            href={child.href}
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a
                    aria-current={item.active ? 'page' : undefined}
                    className={cn(
                      'flex h-12 items-center border-b-[3px] px-3 text-base font-bold text-primary-dark no-underline hover:rounded-[5px] hover:ring-4 hover:ring-foreground-muted',
                      item.active ? 'border-primary-dark bg-surface-primary' : 'border-transparent',
                    )}
                    href={item.href ?? '#'}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div
        className="border-b border-border bg-white py-5 min-[730px]:hidden"
        hidden={!mobileOpen}
        id={`${generatedId}-mobile-menu`}
      >
        <div className="idsk-container space-y-5">
          {search ? (
            <SearchInput
              buttonAriaLabel="Vyhľadať"
              label="Hľadať na stránke"
              onSearch={onSearch}
              placeholder={searchPlaceholder}
            />
          ) : null}
          {hasNavigation ? (
            <nav aria-label="Mobilná hlavná navigácia">
              <ul className="list-none space-y-1">
                {nav.slice(0, 5).map((item) => (
                  <li key={item.label}>
                    <a
                      aria-current={item.active ? 'page' : undefined}
                      className={cn(
                        'block rounded-[5px] px-3 py-3 font-bold text-primary-dark no-underline',
                        item.active ? 'bg-surface-primary' : 'hover:bg-surface-muted',
                      )}
                      href={item.href ?? item.children?.[0]?.href ?? '#'}
                    >
                      {item.label}
                    </a>
                    {item.children?.length ? (
                      <ul className="ml-5 list-none border-l border-border pl-3">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <a className="block px-3 py-2 text-primary-dark" href={child.href}>
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {actions.length ? (
            <div className="flex flex-wrap gap-3 border-t border-border pt-4">
              {actions.map((action) =>
                action.href && !action.disabled ? (
                  <Button asChild key={action.label} variant={action.variant ?? 'primary'}>
                    <a aria-label={action.ariaLabel} href={action.href}>{action.label}</a>
                  </Button>
                ) : (
                  <Button
                    aria-label={action.ariaLabel}
                    disabled={action.disabled}
                    key={action.label}
                    onClick={action.onClick}
                    type="button"
                    variant={action.variant ?? 'primary'}
                  >
                    {action.label}
                  </Button>
                ),
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export type { HeaderAction, HeaderProps, LanguageItem, NavChild, NavItem }
