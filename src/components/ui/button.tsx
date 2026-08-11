'use client'

import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[10px] rounded-[5px] p-3 text-center text-[16px] leading-6 font-bold tracking-wide outline-none transition-all duration-100 focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-[#D96E00] disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'border-0 text-white enabled:hover:underline enabled:hover:ring-4 enabled:hover:ring-[#757575] enabled:active:scale-[0.98] enabled:active:underline disabled:bg-[#BDBDBD] disabled:text-white',
        secondary:
          'border-2 bg-white enabled:hover:underline enabled:hover:ring-4 enabled:hover:ring-[#757575] enabled:active:scale-[0.98] enabled:active:underline disabled:border-[#BDBDBD] disabled:bg-white disabled:text-[#BDBDBD]',
        text: 'border-0 bg-transparent underline enabled:hover:ring-4 enabled:hover:ring-[#757575] enabled:hover:decoration-2 enabled:hover:underline-offset-[3px] enabled:active:scale-[0.98] enabled:active:decoration-2 enabled:active:underline-offset-[3px] disabled:text-[#BDBDBD]',
      },
      tone: {
        basic: '',
        success: '',
        warning: '',
      },
      size: {
        lg: 'h-12',
        md: 'h-10',
        sm: 'h-[34px]',
      },
      fullWidth: {
        true: 'w-full sm:w-auto',
        false: 'w-auto',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        tone: 'basic',
        className: 'bg-[#126DFF] enabled:active:bg-[#072C66]',
      },
      {
        variant: 'primary',
        tone: 'success',
        className: 'bg-[#078814] enabled:active:bg-[#033608]',
      },
      {
        variant: 'primary',
        tone: 'warning',
        className: 'bg-[#C3112B] enabled:active:bg-[#4E0711]',
      },
      {
        variant: 'secondary',
        tone: 'basic',
        className:
          'border-[#0B4199] text-[#0B4199] enabled:active:bg-[#EFF5FE]',
      },
      {
        variant: 'secondary',
        tone: 'success',
        className:
          'border-[#078814] text-[#078814] enabled:active:bg-[#EBF5EC]',
      },
      {
        variant: 'secondary',
        tone: 'warning',
        className:
          'border-[#C3112B] text-[#C3112B] enabled:active:bg-[#FBEEF0]',
      },
      {
        variant: 'text',
        tone: 'basic',
        className: 'text-[#0B4199] enabled:active:bg-[#EFF5FE]',
      },
      {
        variant: 'text',
        tone: 'success',
        className: 'text-[#078814] enabled:active:bg-[#EBF5EC]',
      },
      {
        variant: 'text',
        tone: 'warning',
        className: 'text-[#C3112B] enabled:active:bg-[#FBEEF0]',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      tone: 'basic',
      size: 'lg',
      fullWidth: false,
    },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      className,
      children,
      leadingIcon,
      trailingIcon,
      variant,
      tone,
      size,
      fullWidth,
      type,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, tone, size, fullWidth }), className)}
        ref={ref}
        type={asChild ? undefined : (type ?? 'button')}
        {...props}
      >
        {leadingIcon ? <span className="shrink-0">{leadingIcon}</span> : null}
        <Slottable>{children}</Slottable>
        {trailingIcon ? <span className="shrink-0">{trailingIcon}</span> : null}
      </Comp>
    )
  },
)

Button.displayName = 'Button'
