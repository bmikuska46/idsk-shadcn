import { ChevronLeft, ChevronRight, House } from 'lucide-react'

import { cn } from '@/lib/utils'

export type BreadcrumbItem = {
  href?: string
  label: string
}

export type BreadcrumbsProps = {
  /** Apply the standard IDSK page container used by the existing component API. */
  contained?: boolean
  /** Replace the first item's text with an accessible home icon. */
  homeIcon?: boolean
  /** On screens up to 480 px, show only a link back to the parent item. */
  collapseOnMobile?: boolean
  className?: string
  items: BreadcrumbItem[]
  label?: string
}

export function Breadcrumbs({
  className,
  contained = true,
  collapseOnMobile = false,
  homeIcon = false,
  items,
  label = 'Omrvinková navigácia',
}: BreadcrumbsProps) {
  const currentIndex = items.length - 1
  const parent = items.at(-2)

  return (
    <nav
      aria-label={label}
      className={cn(
        'mt-8 text-[16px]/[24px] text-black',
        contained && 'idsk-container',
        className,
      )}
    >
      {collapseOnMobile && parent?.href ? (
        <a
          className="mb-2 hidden items-center gap-1 text-[#212121] underline hover:text-[#0B4199] hover:decoration-[3px] focus:rounded-[5px] focus:outline focus:outline-[3px] focus:outline-[#D96E00] focus:outline-offset-2 max-[480px]:inline-flex"
          href={parent.href}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span>{parent.label}</span>
        </a>
      ) : null}
      <ol
        className={cn(
          'flex flex-wrap items-center gap-y-2',
          collapseOnMobile && 'max-[480px]:hidden',
        )}
        role="list"
      >
        {items.map((item, index) => {
          const isCurrent = index === currentIndex
          const showHomeIcon = homeIcon && index === 0 && !isCurrent

          return (
            <li
              aria-current={isCurrent ? 'page' : undefined}
              className="flex min-w-0 items-center gap-2 whitespace-nowrap"
              key={`${item.label}-${index}`}
            >
              {index > 0 ? (
                <ChevronRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-[#757575]"
                  focusable="false"
                />
              ) : null}
              {!isCurrent && item.href ? (
                <a
                  aria-label={showHomeIcon ? item.label : undefined}
                  className="min-w-0 rounded-[5px] text-[#212121] underline hover:text-[#0B4199] hover:decoration-[3px] focus:outline focus:outline-[3px] focus:outline-[#D96E00] focus:outline-offset-2"
                  href={item.href}
                >
                  {showHomeIcon ? (
                    <House
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0"
                      focusable="false"
                    />
                  ) : (
                    item.label
                  )}
                </a>
              ) : (
                <span className="min-w-0 text-black">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
