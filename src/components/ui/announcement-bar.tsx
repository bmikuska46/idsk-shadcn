'use client'

import { useId, type HTMLAttributes, type ReactNode } from 'react'

import { MaterialIcon } from '@/components/ui/material-icon'
import { cn } from '@/lib/utils'

type AnnouncementBarStatus = 'information' | 'error' | 'warning' | 'success'

type AnnouncementBarProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  children: ReactNode
  dismissLabel?: string
  /** Announce dynamically inserted bars to assistive technology. */
  dynamic?: boolean
  headingLevel?: 2 | 3 | 4
  icon?: ReactNode
  /** Link rendered under the text, e.g. `<a className="idsk-link">Viac informácií</a>`. */
  link?: ReactNode
  onDismiss?: () => void
  status?: AnnouncementBarStatus
  title: ReactNode
}

const statuses: Record<AnnouncementBarStatus, { className: string; icon: ReactNode }> = {
  information: {
    className: 'bg-surface-primary text-primary',
    icon: <MaterialIcon name="info" className="size-6" />,
  },
  success: {
    className: 'bg-surface-success text-success',
    icon: <MaterialIcon name="checkCircle" className="size-6" />,
  },
  warning: {
    className: 'bg-surface-warning text-warning',
    icon: <MaterialIcon name="warning" className="size-6" />,
  },
  error: {
    className: 'bg-surface-error text-error',
    icon: <MaterialIcon name="error" className="size-6" />,
  },
}

/**
 * IDSK "Oznamovacia lišta": full-width tinted bar (P100, Positive bg,
 * Warning bg or Error bg) with a 5px radius, 20px / 30px padding, a 24px
 * status icon, Headline M title, Body text, an optional link and a 49px
 * close button.
 */
export function AnnouncementBar({
  children,
  className,
  dismissLabel = 'Zatvoriť oznámenie',
  dynamic = false,
  headingLevel = 2,
  icon,
  link,
  onDismiss,
  status = 'information',
  title,
  ...props
}: AnnouncementBarProps) {
  const generatedId = useId()
  const titleId = `${generatedId}-title`
  const config = statuses[status]
  const Heading = headingLevel === 3 ? 'h3' : headingLevel === 4 ? 'h4' : 'h2'
  const role = dynamic ? (status === 'error' || status === 'warning' ? 'alert' : 'status') : 'region'

  const closeButton = onDismiss ? (
    <button
      aria-label={dismissLabel}
      className="inline-flex size-[49px] shrink-0 items-center justify-center rounded-[5px] text-link outline-none transition-shadow duration-100 hover:ring-[5px] hover:ring-foreground-muted focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
      onClick={onDismiss}
      type="button"
    >
      <MaterialIcon name="close" aria-hidden="true" className="size-6" />
    </button>
  ) : null

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'flex w-full flex-col gap-0 rounded-[5px] px-[30px] py-5 sm:flex-row sm:items-center sm:gap-5',
        config.className,
        className,
      )}
      role={role}
      {...props}
    >
      <div className="flex items-center justify-between sm:block sm:shrink-0">
        <span className="inline-flex shrink-0">{icon ?? config.icon}</span>
        <span className="sm:hidden">{closeButton}</span>
      </div>
      <div className="flex min-w-0 grow flex-col text-foreground">
        <Heading className="text-[20px] leading-[26px] font-bold sm:text-[24px] sm:leading-[35px]" id={titleId}>
          {title}
        </Heading>
        <div className="flex flex-col gap-[10px]">
          <div className="text-[16px] leading-6 sm:text-[19px] sm:leading-7">{children}</div>
          {link ? <div className="text-[16px] leading-6 sm:text-[19px] sm:leading-7">{link}</div> : null}
        </div>
      </div>
      {closeButton ? <div className="hidden sm:block sm:shrink-0">{closeButton}</div> : null}
    </section>
  )
}

export type { AnnouncementBarProps, AnnouncementBarStatus }
