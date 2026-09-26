'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Select, type SelectOption } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { MaterialIcon } from '@/components/ui/material-icon'
import { cn } from '@/lib/utils'

type FeedbackBarProps = {
  className?: string
  confirmationMessage?: string
  failureMessage?: string
  pendingMessage?: string
  /** Maximum length of the free text fields, IDSK uses 350 characters. */
  maxLength?: number
  noAccessibleLabel?: string
  /** Label of the textarea shown after answering "Nie". */
  noFormLabel?: string
  noLabel?: string
  onNo?: () => void
  /** Receives the follow-up message typed after answering "Nie". */
  onNoSubmit?: (message: string) => void | Promise<void>
  onReport?: () => void
  /** Receives the error report typed into the inline report form. */
  onReportSubmit?: (report: { message: string; type: string }) => void | Promise<void>
  onYes?: () => void | Promise<void>
  question?: string
  regionLabel?: string
  reportAccessibleLabel?: string
  /** Options of the "Typ chyby" select in the inline report form. */
  reportErrorTypes?: SelectOption[]
  /** External report page. When omitted, the report form opens inline. */
  reportHref?: string
  reportLabel?: string
  showReportButton?: boolean
  submitLabel?: string
  yesAccessibleLabel?: string
  yesLabel?: string
}

const defaultReportErrorTypes: SelectOption[] = [
  { label: 'Obsahová chyba', value: 'content' },
  { label: 'Technická chyba', value: 'technical' },
  { label: 'Chyba prístupnosti', value: 'accessibility' },
  { label: 'Iné', value: 'other' },
]

/**
 * IDSK "Lišta spätnej väzby": white bar with a 1px P300 top border. The
 * question is Body (19/28), answers are 228px secondary M buttons 25px apart
 * and the report link is Body 1 on the right; the link stays visible after the
 * question has been answered. Answering "Nie" opens a follow-up
 * textarea, the report link opens an error type select and a textarea.
 */
export function FeedbackBar({
  className,
  confirmationMessage = 'Ďakujeme, že nám pomáhate zlepšovať kvalitu portálu.',
  failureMessage = 'Odoslanie sa nepodarilo. Skúste to znova.',
  pendingMessage = 'Odosiela sa...',
  maxLength = 350,
  noAccessibleLabel = 'Nie, tieto informácie neboli pre mňa užitočné',
  noFormLabel = 'Čo by sme mohli zlepšiť?',
  noLabel = 'Nie',
  onNo,
  onNoSubmit,
  onReport,
  onReportSubmit,
  onYes,
  question = 'Boli tieto informácie pre Vás užitočné?',
  regionLabel = 'Lišta spätnej väzby',
  reportAccessibleLabel = 'Našli ste na stránke chybu? Nahláste ju.',
  reportErrorTypes = defaultReportErrorTypes,
  reportHref,
  reportLabel = 'Našli ste na stránke chybu?',
  showReportButton = true,
  submitLabel = 'Odoslať',
  yesAccessibleLabel = 'Áno, tieto informácie boli pre mňa užitočné',
  yesLabel = 'Áno',
}: FeedbackBarProps) {
  const generatedId = useId()
  const questionId = `${generatedId}-question`
  const reportFormId = `${generatedId}-report-form`
  const [response, setResponse] = useState<'yes' | 'no' | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportType, setReportType] = useState('')
  const [pending, setPending] = useState(false)
  const [failed, setFailed] = useState(false)
  const showConfirmation = submitted
  const confirmationRef = useRef<HTMLDivElement>(null)
  const noTextareaRef = useRef<HTMLTextAreaElement>(null)
  const reportButtonRef = useRef<HTMLButtonElement>(null)

  // The answer buttons unmount after a click, so move focus to what replaced them.
  useEffect(() => {
    if (!showConfirmation && response === 'no') noTextareaRef.current?.focus()
  }, [response, showConfirmation])

  const submit = async (action: () => void | Promise<void>) => {
    if (pending) return
    setPending(true)
    setFailed(false)
    try {
      await action()
      setSubmitted(true)
      setReportOpen(false)
      requestAnimationFrame(() => confirmationRef.current?.focus())
    } catch {
      setFailed(true)
    } finally {
      setPending(false)
    }
  }

  const respond = (value: 'yes' | 'no') => {
    if (value === 'yes') void submit(() => onYes?.())
    else {
      setResponse(value)
      onNo?.()
    }
  }

  const handleNoSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = String(new FormData(event.currentTarget).get('message') ?? '')
    void submit(() => onNoSubmit?.(message))
  }

  const handleReportSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = String(new FormData(event.currentTarget).get('message') ?? '')
    void submit(() => onReportSubmit?.({ message, type: reportType }))
  }

  const openReport = () => {
    onReport?.()
    setReportOpen(true)
  }

  const closeReport = () => {
    setReportOpen(false)
    requestAnimationFrame(() => reportButtonRef.current?.focus())
  }

  return (
    <section
      aria-label={regionLabel}
      className={cn('w-full border-t border-primary-light bg-surface', className)}
      role="region"
    >
      <div aria-live="polite" aria-atomic="true" role="status" className="sr-only">
        {showConfirmation ? confirmationMessage : pending ? pendingMessage : ''}
      </div>
      {failed ? <p role="alert" className="idsk-container text-error">{failureMessage}</p> : null}
      <div className="idsk-container flex flex-col gap-5 py-5">
        <div className="flex flex-col gap-[25px] lg:flex-row lg:items-center lg:justify-between sm:gap-[30px]">
          {showConfirmation ? (
            <div
              className="flex min-h-[41px] flex-col items-center gap-[5px] rounded-[5px] text-center text-[16px] leading-6 text-foreground outline-none sm:flex-row sm:items-center sm:gap-[10px] sm:text-left sm:text-[19px] sm:leading-7 focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
              role="group"
              aria-label="Spätná väzba"
              ref={confirmationRef}
              tabIndex={-1}
            >
              <MaterialIcon name="checkCircle" className="size-8 shrink-0 text-success sm:size-6" />
              <p aria-hidden="true">{confirmationMessage}</p>
            </div>
          ) : (
            <fieldset className="min-w-0">
              <legend className="sr-only" id={questionId}>
                {question}
              </legend>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-[30px]">
                <p aria-hidden="true" className="text-center text-[16px] leading-6 text-foreground sm:text-left sm:text-[19px] sm:leading-7">
                  {question}
                </p>
                <div className="flex gap-[25px]">
                  <Button
                    disabled={pending}
                    aria-describedby={questionId}
                    aria-label={yesAccessibleLabel}
                    className="flex-1 sm:w-[228px] sm:flex-none"
                    onClick={() => respond('yes')}
                    size="md"
                    type="button"
                    variant="secondary"
                  >
                    {yesLabel}
                  </Button>
                  <Button
                    disabled={pending}
                    aria-describedby={questionId}
                    aria-label={noAccessibleLabel}
                    className="flex-1 sm:w-[228px] sm:flex-none"
                    onClick={() => respond('no')}
                    size="md"
                    type="button"
                    variant="secondary"
                  >
                    {noLabel}
                  </Button>
                </div>
              </div>
            </fieldset>
          )}

          {showReportButton ? (
            <div className="flex justify-center sm:justify-end">
              {reportHref ? (
                <a
                  aria-label={reportAccessibleLabel}
                  className="rounded-[5px] text-[14px] leading-5 text-link underline sm:text-[16px] sm:leading-6 hover:decoration-[3px] focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
                  href={reportHref}
                >
                  {reportLabel}
                </a>
              ) : (
                <Button
                  aria-controls={reportFormId}
                  aria-expanded={reportOpen}
                  aria-label={reportAccessibleLabel}
                  className="h-auto text-[14px] leading-5 sm:text-[16px] sm:leading-6"
                  onClick={openReport}
                  ref={reportButtonRef}
                  type="button"
                  variant="text-inline"
                >
                  {reportLabel}
                </Button>
              )}
            </div>
          ) : null}
        </div>

        {!showConfirmation && response === 'no' && !reportOpen ? (
          <form className="flex max-w-[740px] flex-col gap-5" onSubmit={handleNoSubmit}>
            <Textarea
              label={noFormLabel}
              maxLength={maxLength}
              name="message"
              ref={noTextareaRef}
              rows={4}
              size="m"
            />
            <Button disabled={pending} className="self-start" size="md" type="submit" variant="primary">
              {submitLabel}
            </Button>
          </form>
        ) : null}

        {reportOpen ? (
          <form className="flex max-w-[740px] flex-col gap-5" id={reportFormId} onSubmit={handleReportSubmit}>
            <Select
              label="Typ chyby"
              name="type"
              onValueChange={setReportType}
              options={reportErrorTypes}
              required
              size="m"
              value={reportType}
            />
            <Textarea label="Popis chyby" maxLength={maxLength} name="message" required rows={4} size="m" />
            <div className="flex gap-[25px]">
              <Button disabled={pending} size="md" type="submit" variant="primary">
                {submitLabel}
              </Button>
              <Button onClick={closeReport} size="md" type="button" variant="secondary">
                Zrušiť
              </Button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  )
}

export type { FeedbackBarProps }
