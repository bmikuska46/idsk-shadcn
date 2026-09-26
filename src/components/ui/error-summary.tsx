'use client'

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
} from 'react'

import { cn } from '@/lib/utils'

export type ErrorSummaryItem = {
  href: `#${string}` | string
  text: string
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'>
}

export type ErrorSummaryProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  /** Move focus to the summary when it appears after an unsuccessful submit. */
  focusOnMount?: boolean
  description?: string
  items: ErrorSummaryItem[]
  title: string
}

function focusErrorTarget(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith('#')) return

  const targetId = decodeURIComponent(href.slice(1))
  const target = document.getElementById(targetId)
  if (!target) return

  event.preventDefault()

  const fieldset = target.closest('fieldset')
  const label = document.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(targetId)}"]`)
  const scrollTarget = fieldset?.querySelector('legend') ?? label ?? target

  scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' })
  window.history.replaceState(null, '', href)

  if (target instanceof HTMLElement) {
    const control = target.matches('fieldset, [role=group], [role=radiogroup]')
      ? target.querySelector<HTMLElement>('input:not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled)')
      : target
    control?.focus({ preventScroll: true })
  }
}

/**
 * IDSK "Sumár chýb": white box with a 2px Error alert border, 5px on the left,
 * 5px radius, 20px vertical and 30px horizontal padding. Headline M (24/35),
 * Body 1 description and Body links (19/28) in the link colour.
 */
export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  (
    {
      className,
      description,
      focusOnMount = false,
      id,
      items,
      title,
      ...props
    },
    forwardedRef,
  ) => {
    const generatedId = useId()
    const summaryId = id ?? `error-summary-${generatedId.replace(/:/g, '')}`
    const titleId = `${summaryId}-title`
    const descriptionId = description ? `${summaryId}-description` : undefined
    const localRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (focusOnMount) localRef.current?.focus()
    }, [focusOnMount])

    return (
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        className={cn(
          'mb-8 flex min-w-0 flex-col gap-[10px] rounded-[5px] border-2 border-l-[5px] border-error bg-white pt-[13px] pr-[18px] pb-[13px] pl-[15px] text-foreground sm:pt-[18px] sm:pr-[28px] sm:pb-[18px] sm:pl-[25px]',
          'focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-focus',
          className,
        )}
        data-module="govuk-error-summary"
        id={summaryId}
        ref={(node) => {
          localRef.current = node
          if (typeof forwardedRef === 'function') forwardedRef(node)
          else if (forwardedRef) forwardedRef.current = node
        }}
        role={focusOnMount ? undefined : 'alert'}
        tabIndex={-1}
        {...props}
      >
        <div>
          <h2 className="text-[20px] leading-[26px] font-bold sm:text-[24px] sm:leading-[35px]" id={titleId}>
            {title}
          </h2>
          {description ? (
            <p className="text-[16px] leading-6" id={descriptionId}>
              {description}
            </p>
          ) : null}
        </div>
        <ul className="m-0 flex list-none flex-col gap-[10px] p-0">
          {items.map(({ href, linkProps, text }) => (
            <li key={`${href}-${text}`}>
              <a
                {...linkProps}
                className={cn(
                  'break-words text-[16px] leading-6 text-link underline sm:text-[19px] sm:leading-7 decoration-[1px] underline-offset-3 transition-all duration-200',
                  'hover:text-primary hover:decoration-[3px]',
                  'focus-visible:rounded-none focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus',
                  linkProps?.className,
                )}
                href={href}
                onClick={(event) => {
                  linkProps?.onClick?.(event)
                  if (!event.defaultPrevented) focusErrorTarget(event, href)
                }}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  },
)

ErrorSummary.displayName = 'ErrorSummary'
