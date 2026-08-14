'use client'

import {
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
  X,
} from 'lucide-react'
import {
  useId,
  type HTMLAttributes,
  type ReactNode,
} from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type InformationBarVariant = 'information' | 'error' | 'warning' | 'success'

type InformationBarProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  action?: ReactNode
  children: ReactNode
  dismissLabel?: string
  dynamic?: boolean
  icon?: ReactNode
  onDismiss?: () => void
  title: ReactNode
  variant?: InformationBarVariant
}

const variants: Record<
  InformationBarVariant,
  { className: string; icon: ReactNode }
> = {
  information: {
    className: 'border-primary text-primary',
    icon: <Info aria-hidden="true" className="size-6" />,
  },
  error: {
    className: 'border-warning text-warning',
    icon: <CircleX aria-hidden="true" className="size-6" />,
  },
  warning: {
    className: 'border-alert text-alert',
    icon: <TriangleAlert aria-hidden="true" className="size-6" />,
  },
  success: {
    className: 'border-success text-success',
    icon: <CircleCheck aria-hidden="true" className="size-6" />,
  },
}

export function InformationBar({
  action,
  children,
  className,
  dismissLabel = 'Zatvoriť informačnú lištu',
  dynamic = false,
  icon,
  onDismiss,
  title,
  variant = 'information',
  ...props
}: InformationBarProps) {
  const generatedId = useId()
  const titleId = `${generatedId}-title`
  const config = variants[variant]
  const role = dynamic
    ? variant === 'error' || variant === 'warning'
      ? 'alert'
      : 'status'
    : 'region'

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'relative flex w-full max-w-[740px] flex-col gap-3 rounded-[5px] border-2 border-l-[5px] bg-white p-4 sm:flex-row sm:items-center sm:px-6 sm:py-5',
        config.className,
        className,
      )}
      role={role}
      {...props}
    >
      <div className="flex min-w-0 grow items-start">
        <div className="mr-3 shrink-0 self-center sm:mr-4">
          {icon ?? config.icon}
        </div>
        <div className="min-w-0 grow text-foreground">
          <h3 className="text-base font-bold leading-6 tracking-wide sm:text-lg" id={titleId}>
            {title}
          </h3>
          <div className="mt-1 text-sm leading-6 tracking-wide sm:text-base">
            {children}
          </div>
        </div>
      </div>
      {action || onDismiss ? (
        <div className="flex shrink-0 items-center gap-1 self-start pl-9 sm:ml-3 sm:self-center sm:pl-0">
          {action}
          {onDismiss ? (
            <Button
              aria-label={dismissLabel}
              className="size-10 p-0"
              onClick={onDismiss}
              size="md"
              type="button"
              variant="text"
            >
              <X aria-hidden="true" className="size-5" />
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

export type { InformationBarProps, InformationBarVariant }
