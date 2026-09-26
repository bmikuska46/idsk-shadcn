'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { useState, useSyncExternalStore, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { MaterialIcon } from '@/components/ui/material-icon'
import { cn } from '@/lib/utils'

const subscribe = () => () => {}

export type IdskAccordionItem = {
  content: ReactNode
  description?: ReactNode
  disabled?: boolean
  title: ReactNode
  value: string
}

export type IdskAccordionProps = {
  className?: string
  /** Label of the "open all" control, shown when `toggleAll` is set. */
  closeAllLabel?: string
  defaultValue?: string[]
  /** Heading level of the optional title (sections are one level lower), default 2. */
  headingLevel?: 2 | 3 | 4
  items: IdskAccordionItem[]
  onValueChange?: (value: string[]) => void
  openAllLabel?: string
  /** Optional Headline L title rendered in the header row next to the toggle-all control. */
  title?: ReactNode
  /** Renders the IDSK "Otvoriť všetky / Zavrieť všetky" control above the list. */
  toggleAll?: boolean
  value?: string[]
}

/**
 * IDSK accordion. Every section is an independent N90 box with a 2px N300
 * border and 10px radius. The header has 20px padding, Headline M title,
 * Body description and a 32px chevron; hover shows the 5px N600 outline.
 * Sections are independent, so more than one can be open at the same time.
 */
export function IdskAccordion({
  className,
  closeAllLabel = 'Zavrieť všetky',
  defaultValue = [],
  headingLevel = 2,
  items,
  onValueChange,
  openAllLabel = 'Otvoriť všetky',
  title,
  toggleAll = false,
  value,
}: IdskAccordionProps) {
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false)
  const TitleHeading = headingLevel === 3 ? 'h3' : headingLevel === 4 ? 'h4' : 'h2'
  // Sections sit one level under the title; without a title they take the given level.
  const sectionLevel = title ? headingLevel + 1 : headingLevel
  const SectionHeading = sectionLevel === 2 ? 'h2' : sectionLevel === 3 ? 'h3' : sectionLevel === 4 ? 'h4' : 'h5'
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue)
  const openValues = value ?? internalValue
  const enabledValues = items.filter((item) => !item.disabled).map((item) => item.value)
  const allOpen = enabledValues.length > 0 && enabledValues.every((item) => openValues.includes(item))

  const updateValue = (nextValue: string[]) => {
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue)
  }

  return (
    <div className={cn('flex flex-col gap-[10px]', className)}>
      {title || toggleAll ? (
        <div className="flex flex-wrap items-end justify-between gap-[10px]">
          {title ? (
            <TitleHeading className="text-[36px] leading-[45px] font-black text-foreground">{title}</TitleHeading>
          ) : null}
          {toggleAll && enhanced ? (
            <Button
              aria-expanded={allOpen}
              className="ml-auto h-auto text-[14px] leading-5 sm:text-[16px] sm:leading-6"
              onClick={() => updateValue(allOpen ? [] : enabledValues)}
              size="md"
              trailingIcon={
                <MaterialIcon name="expandMore"
                  aria-hidden="true"
                  className={cn('transition-transform duration-200', allOpen && 'rotate-180')}
                />
              }
              type="button"
              variant="text-inline"
            >
              {allOpen ? closeAllLabel : openAllLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
      <AccordionPrimitive.Root
        className="flex flex-col gap-[15px] sm:gap-5"
        onValueChange={updateValue}
        type="multiple"
        value={enhanced ? openValues : items.map((item) => item.value)}
      >
        {items.map((item) => (
          <AccordionPrimitive.Item
            className="rounded-[10px] border-2 border-border bg-surface text-foreground data-[disabled]:border-border-muted"
            disabled={item.disabled}
            key={item.value}
            value={item.value}
          >
            <AccordionPrimitive.Header asChild>
              <SectionHeading className="m-0 p-0">
              <AccordionPrimitive.Trigger className="group relative z-0 flex w-full items-start justify-between gap-5 rounded-[10px] p-[18px] text-left outline-none transition-shadow duration-100 hover:z-30 hover:ring-[5px] hover:ring-foreground-muted focus-visible:z-30 focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:text-foreground-muted disabled:hover:ring-0 data-[state=open]:rounded-b-none">
                <span className="flex min-w-0 grow flex-col">
                  <span className="text-[20px] leading-[26px] font-bold sm:text-[24px] sm:leading-[35px]">{item.title}</span>
                  {item.description ? (
                    <span className="text-[16px] leading-6 font-normal sm:text-[19px] sm:leading-7">{item.description}</span>
                  ) : null}
                </span>
                <MaterialIcon name="expandMore"
                  aria-hidden="true"
                  className="mt-[2px] size-8 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </AccordionPrimitive.Trigger>
              </SectionHeading>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden text-[16px] leading-6 text-foreground sm:text-[19px] sm:leading-7">
              <div className="rounded-b-[8px] border-t-2 border-border bg-white p-[13px] sm:p-[18px]">{item.content}</div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    </div>
  )
}
