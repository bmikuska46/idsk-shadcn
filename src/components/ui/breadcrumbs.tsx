
import { MaterialIcon } from '@/components/ui/material-icon'
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

/**
 * IDSK "Omrvinková navigácia": Body 1 (16/24) links, 14/20 on small screens,
 * each followed 5px later by a small chevron, with 25px before the next item.
 */
export function Breadcrumbs({
  className,
  contained = true,
  collapseOnMobile = false,
  homeIcon = false,
  items,
  label = 'Omrvinková navigácia',
}: BreadcrumbsProps) {
  const currentIndex = items.length - 1
  const parent = items[items.length - 2]
  const linkClassName =
    'min-w-0 break-words rounded-[5px] text-foreground underline hover:text-link hover:decoration-[3px] focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-focus'

  return (
    <nav
      aria-label={label}
      className={cn(
        'mt-8 text-[14px] leading-5 text-foreground sm:text-[16px] sm:leading-6',
        contained && 'idsk-container',
        className,
      )}
    >
      {collapseOnMobile && parent?.href ? (
        <a
          className={cn(linkClassName, 'mb-2 hidden items-center gap-[5px] max-[480px]:inline-flex')}
          href={parent.href}
        >
          <MaterialIcon name="chevronLeft" aria-hidden="true" className="size-6 shrink-0" />
          <span>{parent.label}</span>
        </a>
      ) : null}
      <ol
        className={cn(
          'flex flex-wrap items-center gap-x-[25px] gap-y-2',
          collapseOnMobile && parent?.href && 'max-[480px]:hidden',
        )}
        role="list"
      >
        {items.map((item, index) => {
          const isCurrent = index === currentIndex
          const showHomeIcon = homeIcon && index === 0 && !isCurrent

          return (
            <li
              aria-current={isCurrent ? 'page' : undefined}
              className="flex min-w-0 items-center gap-[5px]"
              key={`${item.label}-${index}`}
            >
              {!isCurrent && item.href ? (
                <a
                  aria-label={showHomeIcon ? item.label : undefined}
                  className={linkClassName}
                  href={item.href}
                >
                  {showHomeIcon ? (
                    <MaterialIcon name="home"
                      aria-hidden="true"
                      className="size-6 shrink-0"
                      focusable="false"
                    />
                  ) : (
                    item.label
                  )}
                </a>
              ) : (
                <span className="min-w-0 break-words text-foreground">{item.label}</span>
              )}
              {!isCurrent ? (
                <MaterialIcon name="chevronRight"
                  aria-hidden="true"
                  className="size-4 shrink-0 text-[#505A5F]"
                  focusable="false"
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
