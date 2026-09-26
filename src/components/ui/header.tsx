'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { GovernmentLogo } from '@/components/ui/government-logo'
import { SearchInput } from '@/components/ui/search-input'
import { MaterialIcon } from '@/components/ui/material-icon'
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

/** Signed-in user shown on the right of the header. */
type HeaderUser = {
  avatarSrc?: string
  /** Secondary line under the name, e.g. the organisation or role. */
  caption?: string
  href?: string
  /** Letters shown in the avatar circle when there is no image. */
  initials?: string
  name: string
}

/** Notification or mail icon button in the header. */
type HeaderIconAction = {
  /** Marks unread items with a red dot. */
  hasNew?: boolean
  href?: string
  label?: string
  onClick?: () => void
}

type HeaderProps = {
  actions?: HeaderAction[]
  className?: string
  homeHref?: string
  /** Approved identity graphic and service name, rendered inside the home link. */
  logo?: ReactNode
  languageLinks?: LanguageItem[]
  mail?: HeaderIconAction
  nav?: NavItem[]
  /** Accessible name of the main navigation landmark. */
  navLabel?: string
  notifications?: HeaderIconAction
  officialInfoHref?: string
  onSearch?: (value: string) => void
  search?: boolean
  searchPlaceholder?: string
  serviceName: string
  showOfficialBanner?: boolean
  /** Service type shown under the service name, e.g. "Elektronická služba". */
  subheading?: string
  /** Optional third line under the service name; IDSK headers normally omit it. */
  tagline?: string
  user?: HeaderUser
  /** @deprecated Use `user`. */
  userName?: string
  variant?: 'website' | 'service'
}

const iconButtonClassName =
  'relative inline-flex h-[41px] w-[49px] shrink-0 items-center justify-center rounded-[5px] text-link no-underline outline-none transition-shadow duration-100 hover:ring-[5px] hover:ring-foreground-muted focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus active:bg-surface-primary'

const serviceNavItemClassName =
  'text-white hover:text-white focus-visible:outline-focus-inverse'

const navItemClassName =
  'flex h-12 items-center border-b-4 px-[10px] text-[16px] leading-6 font-bold text-link no-underline outline-none transition-shadow duration-100 hover:rounded-[5px] hover:ring-[5px] hover:ring-foreground-muted focus-visible:rounded-[5px] focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus'

function ArrowDropDown({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('size-[25px] shrink-0 transition-transform', className)}
      fill="currentColor"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path d="M7 10l5 5 5-5z" />
    </svg>
  )
}

function HeaderIconButton({
  action,
  fallbackLabel,
  icon,
}: {
  action: HeaderIconAction
  fallbackLabel: string
  icon: ReactNode
}) {
  const label = action.label ?? fallbackLabel
  const content = (
    <>
      {icon}
      {action.hasNew ? (
        <span aria-hidden="true" className="absolute top-[6px] right-[6px] size-[10px] rounded-full border-2 border-white bg-error" />
      ) : null}
      <span className="sr-only">{action.hasNew ? `${label}, máte nové položky` : label}</span>
    </>
  )

  if (action.href) {
    return (
      <a className={iconButtonClassName} href={action.href}>
        {content}
      </a>
    )
  }

  return (
    <button className={iconButtonClassName} onClick={action.onClick} type="button">
      {content}
    </button>
  )
}

function HeaderUserBadge({ user }: { user: HeaderUser }) {
  const initials =
    user.initials ??
    user.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
  const content = (
    <>
      {user.avatarSrc ? (
        <img alt="" className="size-10 shrink-0 rounded-full object-cover" src={user.avatarSrc} />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black p-[5px] text-[19px] leading-7 font-normal text-white"
        >
          {initials}
        </span>
      )}
      <span className="hidden min-w-0 flex-col text-left min-[730px]:flex">
        <span className="truncate text-[16px] leading-6 text-foreground">{user.name}</span>
        {user.caption ? (
          <span className="truncate text-[12px] leading-4 text-foreground-muted">{user.caption}</span>
        ) : null}
      </span>
    </>
  )

  if (user.href) {
    return (
      <a
        className="flex min-w-0 items-center gap-[10px] rounded-[5px] no-underline outline-none hover:ring-[5px] hover:ring-foreground-muted focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
        aria-label={`Profil: ${user.name}`}
        href={user.href}
      >
        {content}
      </a>
    )
  }

  return <span className="flex min-w-0 items-center gap-[10px]">{content}</span>
}

/**
 * IDSK "Hlavička". Top bar in P600 with the official-site disclosure and the
 * language switcher, main section with the government logo, service name and
 * optional service type, search toggle, notification and mail icons, user
 * badge and actions, followed by the website navigation.
 */
export function IdskHeader({
  actions = [],
  className,
  homeHref = '/',
  logo,
  languageLinks = [
    { href: '#', label: 'slovenčina', languageCode: 'sk', active: true },
    { href: '#', label: 'English', languageCode: 'en' },
  ],
  mail,
  nav = [],
  navLabel = 'Hlavná navigácia',
  notifications,
  officialInfoHref = 'https://www.slovensko.sk/sk/agendy/agenda/_organy-verejnej-moci',
  onSearch,
  search = false,
  searchPlaceholder = 'Hľadať na stránke...',
  serviceName,
  showOfficialBanner = false,
  subheading,
  tagline,
  user,
  userName,
  variant = 'website',
}: HeaderProps) {
  const generatedId = useId()
  const [officialOpen, setOfficialOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [openNav, setOpenNav] = useState<number | null>(null)
  const [serviceNavOpen, setServiceNavOpen] = useState(false)
  const officialButtonRef = useRef<HTMLButtonElement>(null)
  const languageButtonRef = useRef<HTMLButtonElement>(null)
  const mobileButtonRef = useRef<HTMLButtonElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const serviceNavButtonRef = useRef<HTMLButtonElement>(null)
  const navButtonRefs = useRef(new Map<number, HTMLButtonElement>())
  const activeLanguage = languageLinks.find((item) => item.active) ?? languageLinks[0]
  const hasNavigation = nav.length > 0
  const isService = variant === 'service'
  const desktopNavId = `${generatedId}-navigation`
  const hasTopBar = showOfficialBanner || languageLinks.length > 0
  const resolvedUser = user ?? (userName ? { name: userName } : undefined)
  const searchPanelId = `${generatedId}-search`

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
              : searchOpen
                ? searchButtonRef.current
                : serviceNavOpen
                  ? serviceNavButtonRef.current
                  : null

      setOfficialOpen(false)
      setLanguageOpen(false)
      setMobileOpen(false)
      setOpenNav(null)
      setSearchOpen(false)
      setServiceNavOpen(false)
      requestAnimationFrame(() => focusTarget?.focus())
    }

    document.addEventListener('keydown', closeMenus)
    return () => document.removeEventListener('keydown', closeMenus)
  }, [languageOpen, mobileOpen, officialOpen, openNav, searchOpen, serviceNavOpen])

  const renderActions = (mobile: boolean) =>
    actions.map((action) =>
      action.href && !action.disabled ? (
        <Button
          aria-label={action.ariaLabel}
          asChild
          key={action.label}
          leadingIcon={action.icon}
          size={mobile ? 'lg' : 'md'}
          variant={action.variant ?? 'primary'}
        >
          <a href={action.href}>{action.label}</a>
        </Button>
      ) : (
        <Button
          aria-label={action.ariaLabel}
          disabled={action.disabled}
          key={action.label}
          leadingIcon={action.icon}
          onClick={action.onClick}
          size={mobile ? 'lg' : 'md'}
          type="button"
          variant={action.variant ?? 'primary'}
        >
          {action.label}
        </Button>
      ),
    )

  return (
    <header
      className={cn('w-full bg-white font-sans shadow-idsk-head', className)}
      data-idsk="header"
      data-variant={variant}
    >
      {hasTopBar ? (
        <div className="relative z-30 flex w-full flex-col items-center bg-primary-dark text-white" data-idsk="top-bar">
          <div className={cn('idsk-container flex min-h-[45px] items-center gap-3', showOfficialBanner ? 'justify-between' : 'justify-end')}>
            {showOfficialBanner ? (
              <button
                aria-controls={`${generatedId}-official-panel`}
                aria-expanded={officialOpen}
                aria-label="Zobraziť informácie o oficiálnej stránke verejnej správy SR"
                className="idsk-focus-inverse inline-flex h-[35px] min-w-0 items-center gap-[5px] rounded-[5px] text-left text-[16px] leading-6 font-bold underline hover:ring-[5px] hover:ring-white active:bg-surface-primary active:text-primary-dark"
                onClick={() => {
                  setOfficialOpen((value) => !value)
                  setLanguageOpen(false)
                  setOpenNav(null)
                }}
                ref={officialButtonRef}
                type="button"
              >
                <span className="min-w-0">Oficiálna stránka verejnej správy SR</span>
                <ArrowDropDown className={cn('shrink-0', officialOpen && 'rotate-180')} />
              </button>
            ) : null}

            {languageLinks.length ? (
              <div className="relative shrink-0">
                <button
                  aria-controls={`${generatedId}-languages`}
                  aria-expanded={languageOpen}
                  aria-label={`Zmeniť jazyk, zvolený jazyk: ${activeLanguage?.label ?? ''}`}
                  className="idsk-focus-inverse inline-flex h-[35px] items-center gap-[5px] rounded-[5px] px-0 text-[16px] leading-6 font-bold underline hover:ring-[5px] hover:ring-white active:bg-surface-primary active:text-primary-dark aria-expanded:bg-surface-primary aria-expanded:text-link"
                  onClick={() => {
                    setLanguageOpen((value) => !value)
                    setOfficialOpen(false)
                    setOpenNav(null)
                  }}
                  ref={languageButtonRef}
                  type="button"
                >
                  <span lang={activeLanguage?.languageCode}>{activeLanguage?.label}</span>
                  <ArrowDropDown className={cn(languageOpen && 'rotate-180')} />
                </button>
                <ul
                  className="absolute top-full right-0 z-40 min-w-40 list-none overflow-hidden rounded-[5px] border-2 border-border bg-white p-0 text-foreground shadow-idsk-md"
                  hidden={!languageOpen}
                  id={`${generatedId}-languages`}
                >
                  {languageLinks.map((item) => (
                    <li key={`${item.languageCode}-${item.label}`}>
                      <a
                        aria-current={item.active ? 'true' : undefined}
                        className={cn(
                          'block px-5 py-[10px] text-[16px] leading-6 text-foreground no-underline hover:bg-surface-muted hover:underline',
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
              <div className="idsk-container flex flex-col gap-[10px] pt-[10px] pb-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <p className="text-[16px] leading-6">
                    Toto je oficiálna webová stránka orgánu verejnej moci Slovenskej republiky. Webové
                    stránky, ktoré využívajú doménu .gov.sk, sú oficiálnymi webovými stránkami orgánov
                    verejnej moci, alebo elektronických služieb štátu.
                  </p>
                  <div className="flex flex-col gap-[10px]">
                    <h2 className="text-[16px] leading-6 font-bold">Táto stránka je zabezpečená</h2>
                    <p className="text-[16px] leading-6">
                      Buďte pozorní a vždy sa uistite, že zdieľate informácie iba cez zabezpečenú webovú
                      stránku verejnej správy SR. Zabezpečená stránka vždy začína https:// pred názvom
                      domény webového sídla.
                    </p>
                  </div>
                </div>
                <p className="text-[16px] leading-6">
                  <a
                    className="idsk-focus-inverse rounded-[5px] text-white underline hover:text-white hover:decoration-[3px]"
                    href={officialInfoHref}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Zoznam adries webových sídiel orgánov verejnej moci.
                    <span className="sr-only"> (otvorí sa v novom okne)</span>
                  </a>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex w-full flex-col items-center border-b-2 border-border bg-white py-5" data-idsk="header-main-section">
        <div className="idsk-container flex flex-col gap-5">
          <div className="flex items-center justify-between gap-5">
            <a
              aria-label={`Domovská stránka ${serviceName}`}
              className="flex min-w-0 items-center gap-5 rounded-[5px] no-underline outline-none hover:ring-[5px] hover:ring-foreground-muted focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
              href={homeHref}
            >
              {logo ?? <GovernmentLogo size="header" siteName={serviceName} subheading={subheading} tagline={tagline ?? ''} />}
            </a>

            <div className="flex shrink-0 items-center gap-[10px] min-[730px]:gap-[25px]">
              {search ? (
                <button
                  aria-controls={searchPanelId}
                  aria-expanded={searchOpen}
                  ref={searchButtonRef}
                  className={cn(iconButtonClassName, 'hidden w-[49px] min-[730px]:inline-flex', searchOpen && 'bg-surface-primary')}
                  onClick={() => setSearchOpen((value) => !value)}
                  type="button"
                >
                  {searchOpen ? <MaterialIcon name="close" aria-hidden="true" className="size-6" /> : <MaterialIcon name="search" aria-hidden="true" className="size-6" />}
                  <span className="sr-only">{searchOpen ? 'Zavrieť vyhľadávanie' : 'Vyhľadávanie'}</span>
                </button>
              ) : null}
              {mail ? (
                <span className="hidden min-[730px]:inline-flex">
                  <HeaderIconButton
                    action={mail}
                    fallbackLabel="Správy"
                    icon={<MaterialIcon name="mail" className="size-6" />}
                  />
                </span>
              ) : null}
              {notifications ? (
                <span className="hidden min-[730px]:inline-flex">
                  <HeaderIconButton
                    action={notifications}
                    fallbackLabel="Notifikácie"
                    icon={<MaterialIcon name="notifications" className="size-6" />}
                  />
                </span>
              ) : null}
              <div className="hidden items-center gap-[25px] min-[730px]:flex">
                {isService && hasNavigation ? (
                  <Button
                    aria-controls={desktopNavId}
                    aria-expanded={serviceNavOpen}
                    ref={serviceNavButtonRef}
                    className={cn(serviceNavOpen && 'bg-surface-primary')}
                    onClick={() => {
                      setServiceNavOpen((value) => !value)
                      setOpenNav(null)
                    }}
                    size="md"
                    trailingIcon={
                      <MaterialIcon name="expandMore"
                        aria-hidden="true"
                        className={cn('transition-transform', serviceNavOpen && 'rotate-180')}
                      />
                    }
                    type="button"
                    variant="text"
                  >
                    Navigácia
                  </Button>
                ) : null}
                {renderActions(false)}
              </div>
              {resolvedUser ? <HeaderUserBadge user={resolvedUser} /> : null}
              {hasNavigation || search || actions.length > 0 || notifications || mail ? (
                <button
                  aria-controls={`${generatedId}-mobile-menu`}
                  aria-expanded={mobileOpen}
                  aria-label={mobileOpen ? 'Zatvoriť menu' : 'Otvoriť menu'}
                  className="inline-flex h-[41px] items-center gap-[5px] rounded-[5px] border-2 border-link px-[10px] text-[16px] leading-6 font-bold text-link outline-none hover:underline focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus min-[730px]:hidden"
                  onClick={() => {
                    setMobileOpen((value) => !value)
                    setLanguageOpen(false)
                    setOfficialOpen(false)
                    setOpenNav(null)
                  }}
                  ref={mobileButtonRef}
                  type="button"
                >
                  {mobileOpen ? <MaterialIcon name="close" aria-hidden="true" className="size-6" /> : <MaterialIcon name="menu" aria-hidden="true" className="size-6" />}
                  Menu
                </button>
              ) : null}
            </div>
          </div>

          {search ? (
            <div className="hidden min-[730px]:block" hidden={!searchOpen} id={searchPanelId}>
              <SearchInput
                buttonAriaLabel="Vyhľadať"
                label="Hľadať na stránke"
                onSearch={onSearch}
                placeholder={searchPlaceholder}
              />
            </div>
          ) : null}
        </div>
      </div>

      {hasNavigation ? (
        <nav
          aria-label={navLabel}
          className={cn(
            'w-full flex-col items-center pt-[5px]',
            isService ? 'bg-primary-dark text-white' : 'bg-white',
            isService && !serviceNavOpen ? 'hidden' : 'hidden min-[730px]:flex',
          )}
          data-idsk={isService ? 'service-navigation' : 'website-navigation'}
          id={desktopNavId}
        >
          <ul className={cn('idsk-container m-0 flex list-none flex-row flex-wrap justify-between', isService && 'gap-[25px]')} role="list">
            {nav.map((item, index) => (
              <li className="relative flex" key={item.label}>
                {item.children?.length ? (
                  <>
                    <button
                      aria-controls={`${generatedId}-nav-${index}`}
                      aria-expanded={openNav === index}
                      className={cn(
                        navItemClassName,
                        isService && (openNav === index ? 'focus-visible:outline-focus-inverse' : serviceNavItemClassName),
                        openNav === index
                          ? 'border-link bg-surface-primary text-link hover:text-link'
                          : item.active
                            ? isService
                              ? 'border-white'
                              : 'border-link'
                            : 'border-transparent',
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
                      <MaterialIcon name="expandMore"
                        aria-hidden="true"
                        className={cn('size-[25px] transition-transform', openNav === index && 'rotate-180')}
                      />
                    </button>
                    <ul
                      className="absolute top-full left-0 z-20 mt-[5px] min-w-60 list-none overflow-hidden rounded-[5px] border-2 border-border bg-white p-0 shadow-idsk-md"
                      hidden={openNav !== index}
                      id={`${generatedId}-nav-${index}`}
                    >
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <a
                            aria-current={child.active ? 'page' : undefined}
                            className="block px-5 py-[10px] text-[16px] leading-6 font-normal text-foreground no-underline hover:bg-surface-muted hover:underline"
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
                      navItemClassName,
                      isService && serviceNavItemClassName,
                      item.active ? (isService ? 'border-white' : 'border-link') : 'border-transparent',
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
        className="border-b-2 border-border bg-white py-5 min-[730px]:hidden"
        hidden={!mobileOpen}
        id={`${generatedId}-mobile-menu`}
      >
        <div className="idsk-container flex flex-col gap-5">
          {search ? (
            <SearchInput
              buttonAriaLabel="Vyhľadať"
              label="Hľadať na stránke"
              onSearch={onSearch}
              placeholder={searchPlaceholder}
            />
          ) : null}
          {hasNavigation ? (
            <nav aria-label={`${navLabel} (mobil)`}>
              <ul className="list-none space-y-1">
                {nav.map((item) => (
                  <li key={item.label}>
                    <a
                      aria-current={item.active ? 'page' : undefined}
                      className={cn(
                        'block rounded-[5px] px-3 py-3 text-[16px] leading-6 font-bold text-link no-underline',
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
                            <a className="block px-3 py-2 text-[16px] leading-6 text-link" href={child.href}>
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
          {notifications || mail ? (
            <div className="flex gap-[10px]">
              {mail ? (
                <HeaderIconButton
                  action={mail}
                  fallbackLabel="Správy"
                  icon={<MaterialIcon name="mail" className="size-6" />}
                />
              ) : null}
              {notifications ? (
                <HeaderIconButton
                  action={notifications}
                  fallbackLabel="Notifikácie"
                  icon={<MaterialIcon name="notifications" className="size-6" />}
                />
              ) : null}
            </div>
          ) : null}
          {actions.length ? (
            <div className="flex flex-wrap gap-[10px] border-t border-border pt-5">{renderActions(true)}</div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export type { HeaderAction, HeaderIconAction, HeaderProps, HeaderUser, LanguageItem, NavChild, NavItem }
