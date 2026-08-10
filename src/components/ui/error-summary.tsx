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
    target.focus({ preventScroll: true })
  }
}

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
          'mb-8 max-w-[640px] rounded-lg border-y-2 border-r-2 border-l-[5px] border-warning bg-white p-5 text-foreground',
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
        role="region"
        tabIndex={-1}
        {...props}
      >
        <h2 className="mb-4 text-lg font-bold sm:text-xl" id={titleId}>
          {title}
        </h2>
        {description ? (
          <p className="mb-4 text-base leading-6" id={descriptionId}>
            {description}
          </p>
        ) : null}
        <ul className="m-0 list-none space-y-2 p-0">
          {items.map(({ href, linkProps, text }) => (
            <li key={`${href}-${text}`}>
              <a
                {...linkProps}
                className={cn(
                  'text-primary underline decoration-[1px] underline-offset-3 transition-all duration-200',
                  'hover:text-[#126DFF] hover:decoration-[2px]',
                  'focus:text-[#126DFF] focus-visible:rounded-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2',
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
