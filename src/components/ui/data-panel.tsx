import { useId, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type DataPanelItem = {
  label: ReactNode
  value: ReactNode
}

type DataPanelProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  /** Buttons rendered on the right of the header, 25px apart. */
  actions?: ReactNode
  headingLevel?: 2 | 3 | 4
  /** 24px icon shown before the title in P600. */
  icon?: ReactNode
  items: DataPanelItem[]
  title: ReactNode
}

/**
 * IDSK "Dátový panel": white panel with a 1px P600 border, 5px on the left,
 * and 5px radius. The header holds an icon, a Headline S title in the link
 * colour and, on desktop, action buttons. Rows are a description list with a
 * 150px label column ("Label:") and Body 1 values in the link colour, separated
 * by inset 1px N300 rules. On small screens the title is 19/24, the rows are
 * 14/20 with label and value stacked, and the actions move to the bottom.
 */
export function DataPanel({
  actions,
  className,
  headingLevel = 3,
  icon,
  items,
  title,
  ...props
}: DataPanelProps) {
  const generatedId = useId()
  const titleId = `${generatedId}-title`
  const Heading = headingLevel === 2 ? 'h2' : headingLevel === 4 ? 'h4' : 'h3'

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'flex w-full flex-col gap-[10px] rounded-[5px] border border-l-[5px] border-primary-dark bg-white py-[10px]',
        'sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-x-[5px] sm:gap-y-0 sm:pt-0',
        className,
      )}
      {...props}
    >
      <div className="pr-5 pl-[25px] sm:py-[10px] sm:pr-[25px]">
        <Heading
          className="flex min-w-0 items-center gap-[10px] text-[19px] leading-6 font-bold text-link sm:text-[20px] sm:leading-[26px]"
          id={titleId}
        >
          {icon ? (
            <span aria-hidden="true" className="shrink-0 text-primary-dark [&>svg]:size-6">
              {icon}
            </span>
          ) : null}
          <span className="min-w-0">{title}</span>
        </Heading>
      </div>
      {items.length ? (
        <dl className="m-0 flex flex-col gap-[5px] sm:col-span-2 sm:col-start-1 sm:row-start-2">
          {items.map((item, index) => (
            <div
              className={cn(
                'mr-[19px] ml-[25px] flex flex-col gap-[5px] text-[14px] leading-5 sm:grid sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5 sm:text-[16px] sm:leading-6',
                index > 0 && 'border-t border-border pt-[10px] sm:pt-[5px]',
              )}
              key={index}
            >
              <dt className="text-link">
                {item.label}
                {typeof item.label === 'string' && !item.label.trim().endsWith(':') ? ':' : null}
              </dt>
              <dd className="m-0 min-w-0 break-words text-link">{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {actions ? (
        <div className="flex flex-wrap items-center gap-[25px] pr-5 pl-[25px] sm:col-start-2 sm:row-start-1 sm:min-h-[49px] sm:shrink-0 sm:pr-0 sm:pl-0">
          {actions}
        </div>
      ) : null}
    </section>
  )
}

export type { DataPanelItem, DataPanelProps }
