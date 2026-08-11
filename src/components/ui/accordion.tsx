'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type IdskAccordionItem = {
  content: ReactNode
  description?: ReactNode
  disabled?: boolean
  title: ReactNode
  value: string
}

export type IdskAccordionProps = {
  className?: string
  defaultValue?: string[]
  items: IdskAccordionItem[]
  onValueChange?: (value: string[]) => void
  value?: string[]
}

/**
 * IDSK accordion. Sections are independent, so more than one can be open at
 * the same time, as required by the IDSK interaction guidance.
 */
export function IdskAccordion({
  className,
  defaultValue,
  items,
  onValueChange,
  value,
}: IdskAccordionProps) {
  return (
    <AccordionPrimitive.Root
      className={cn('space-y-6', className)}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      type="multiple"
      value={value}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          className="rounded-lg border border-[#BDBDBD] bg-[#F5F5F5] text-black data-[disabled]:opacity-60"
          disabled={item.disabled}
          key={item.value}
          value={item.value}
        >
          <AccordionPrimitive.Header className="m-0 p-0">
            <AccordionPrimitive.Trigger className="group relative z-0 flex w-full flex-col rounded-lg bg-[#F5F5F5] px-6 py-4 text-left outline-none transition-shadow duration-200 hover:z-30 hover:shadow-[0_0_0_4px_#757575] focus:ring-[3px] focus:ring-[#D96E00] focus:ring-offset-[2px] focus-visible:z-30 data-[state=open]:rounded-b-none disabled:cursor-not-allowed">
              <span className="flex w-full items-center justify-between">
                <span className="m-0 flex-grow p-0 text-base font-bold text-black sm:text-lg">
                  {item.title}
                </span>
                <span
                  aria-hidden="true"
                  className="ml-4 inline-block h-[9px] w-[9px] shrink-0 rotate-45 border-r-[2.5px] border-b-[2.5px] border-black transition-transform duration-300 ease-in-out group-data-[state=open]:-rotate-135"
                />
              </span>
              {item.description ? (
                <span className="mt-1 block text-[0.9rem] font-normal text-black">
                  {item.description}
                </span>
              ) : null}
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden rounded-b-lg border-t border-neutral-200 bg-white text-black">
            <div className="idsk-body p-6 text-black">{item.content}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}
