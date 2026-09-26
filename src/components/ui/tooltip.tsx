'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { forwardRef, useRef, useState, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react'

import { MaterialIcon } from '@/components/ui/material-icon'
import { cn } from '@/lib/utils'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * IDSK tooltip bubble: N900 background, 10px radius, 20px padding, at most
 * 400px wide and 290 characters long, Middle shadow, arrow on any side.
 */
const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ children, className, side = 'top', sideOffset = 0, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      className={cn(
        'z-50 max-w-[min(400px,calc(100vw-2rem))] rounded-[10px] bg-surface-inverse p-5 text-[16px] leading-6 text-white shadow-idsk-md hover:ring-[5px] hover:ring-foreground-muted',
        className,
      )}
      ref={ref}
      side={side}
      sideOffset={sideOffset}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className="fill-surface-inverse" height={21} width={24} />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

type InfoTooltipProps = {
  className?: string
  /** Text read by assistive technology for the mark itself. */
  label?: string
  /** Tooltip text, at most 290 characters according to IDSK. */
  children: ReactNode
  side?: ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>['side']
}

/**
 * IDSK "Vysvetlivka": a 25px info_outline mark in P400 placed next to a field
 * label. Opens on hover and keyboard focus and toggles on tap, click, Enter
 * and Space; the mark is a real button so it is reachable with a keyboard.
 */
export function InfoTooltip({ children, className, label = 'Vysvetlivka', side = 'top' }: InfoTooltipProps) {
  const [open, setOpen] = useState(false)
  // Radix closes an open tooltip on pointerdown, so remember the state before the tap.
  const wasOpenRef = useRef<boolean | null>(null)

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip onOpenChange={setOpen} open={open}>
        <TooltipTrigger asChild>
          <button
            aria-label={label}
            className={cn(
              'group inline-flex size-[25px] shrink-0 items-center justify-center rounded-full text-primary outline-none',
              'focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-0 focus-visible:outline-focus',
              className,
            )}
            onClick={(event) => {
              event.preventDefault()
              // Keyboard activation has detail 0 and no pointerdown, so use the live state.
              const wasOpen = event.detail === 0 ? open : (wasOpenRef.current ?? open)
              wasOpenRef.current = null
              setOpen(!wasOpen)
            }}
            onPointerCancel={() => {
              wasOpenRef.current = null
            }}
            onPointerDown={() => {
              wasOpenRef.current = open
            }}
            type="button"
          >
            <span className="inline-flex size-[21px] items-center justify-center rounded-full group-hover:ring-[5px] group-hover:ring-foreground-muted">
              <MaterialIcon name="info" aria-hidden="true" className="size-[21px]" />
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side={side}>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
export type { InfoTooltipProps }
