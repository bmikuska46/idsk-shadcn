'use client'

import { useId, type HTMLAttributes, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { MaterialIcon } from '@/components/ui/material-icon'
import { cn } from '@/lib/utils'

type InformationBarVariant = 'information' | 'error' | 'warning' | 'success'

type InformationBarProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  action?: ReactNode
  children: ReactNode
  dismissLabel?: string
  dynamic?: boolean
  headingLevel?: 2 | 3 | 4
  icon?: ReactNode
  onDismiss?: () => void
  title: ReactNode
  variant?: InformationBarVariant
}

const variants: Record<InformationBarVariant, { className: string; icon: ReactNode }> = {
  information: {
    className: 'border-primary text-primary',
    icon: <MaterialIcon name="info" className="size-[25px]" />,
  },
  success: {
    className: 'border-success text-success',
    icon: <MaterialIcon name="checkCircle" className="size-[25px]" />,
  },
  warning: {
    className: 'border-warning text-warning',
    icon: <MaterialIcon name="warning" className="size-[25px]" />,
  },
  error: {
    className: 'border-error text-error',
    icon: <MaterialIcon name="error" className="size-[25px]" />,
  },
}

/**
 * IDSK "Informačná lišta": white box with a 2px semantic border, 5px on the
 * left, 5px radius. Desktop padding 20px / 30px, mobile 15px / 20px. Title is
 * Headline M (24/35), body is Body (19/28); on mobile Body and Body 1.
 * Variants: information (P400), success (Positive), warning (Warning orange)
 * and error (Error alert red).
 */
export function InformationBar({
  action,
  children,
  className,
  dismissLabel = 'Zatvoriť informačnú lištu',
  dynamic = false,
  headingLevel = 3,
  icon,
  onDismiss,
  title,
  variant = 'information',
  ...props
}: InformationBarProps) {
  const generatedId = useId()
  const titleId = `${generatedId}-title`
  const config = variants[variant]
  const Heading = headingLevel === 2 ? 'h2' : headingLevel === 4 ? 'h4' : 'h3'
  const role = dynamic
    ? variant === 'error' || variant === 'warning'
      ? 'alert'
      : 'status'
    : 'region'

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'relative flex w-full flex-col gap-[15px] rounded-[5px] border-2 border-l-[5px] bg-white pt-[13px] pr-[18px] pb-[13px] pl-[15px] sm:flex-row sm:items-center sm:gap-5 sm:pt-[18px] sm:pr-[28px] sm:pb-[18px] sm:pl-[25px]',
        config.className,
        className,
      )}
      role={role}
      {...props}
    >
      <div className="flex min-w-0 grow flex-col gap-[15px] sm:flex-row sm:items-center sm:gap-5">
        <div className="shrink-0 self-start sm:self-center">{icon ?? config.icon}</div>
        <div className="flex min-w-0 grow flex-col text-foreground">
          <Heading className="text-[19px] leading-7 font-bold sm:text-[24px] sm:leading-9" id={titleId}>
            {title}
          </Heading>
          <div className="text-[16px] leading-6 sm:text-[19px] sm:leading-7">{children}</div>
        </div>
      </div>
      {action || onDismiss ? (
        <div className="flex shrink-0 items-center gap-[10px] self-end sm:self-center">
          {action}
          {onDismiss ? (
            <Button
              aria-label={dismissLabel}
              className="size-[41px] p-0"
              onClick={onDismiss}
              size="md"
              type="button"
              variant="text"
            >
              <MaterialIcon name="close" aria-hidden="true" className="size-6" />
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

export type { InformationBarProps, InformationBarVariant }
