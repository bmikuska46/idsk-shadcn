import { CircleCheck } from 'lucide-react'
import { useId, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type FeedbackBarProps = {
  className?: string
  confirmationMessage?: string
  noAccessibleLabel?: string
  noLabel?: string
  onNo?: () => void
  onReport?: () => void
  onYes?: () => void
  question?: string
  regionLabel?: string
  reportAccessibleLabel?: string
  reportHref?: string
  reportLabel?: string
  showReportButton?: boolean
  yesAccessibleLabel?: string
  yesLabel?: string
}

export function FeedbackBar({
  className,
  confirmationMessage = 'Ďakujeme za vašu spätnú väzbu.',
  noAccessibleLabel = 'Nie, tieto informácie neboli pre mňa užitočné',
  noLabel = 'Nie',
  onNo,
  onReport,
  onYes,
  question = 'Našli ste na tejto stránke to, čo ste hľadali?',
  regionLabel = 'Lišta spätnej väzby',
  reportAccessibleLabel = 'Oznámte chybu s touto stránkou',
  reportHref,
  reportLabel = 'Oznámte chybu',
  showReportButton = true,
  yesAccessibleLabel = 'Áno, tieto informácie boli pre mňa užitočné',
  yesLabel = 'Áno',
}: FeedbackBarProps) {
  const generatedId = useId()
  const questionId = `${generatedId}-question`
  const [response, setResponse] = useState<'yes' | 'no' | null>(null)
  const statusMessage = response ? confirmationMessage : ''

  const respond = (value: 'yes' | 'no') => {
    setResponse(value)
    if (value === 'yes') {
      onYes?.()
    } else {
      onNo?.()
    }
  }

  return (
    <section
      aria-label={regionLabel}
      className={cn('w-full border-y border-border bg-surface-muted', className)}
      role="region"
    >
      <div className="idsk-container py-5">
        <div
          aria-atomic="true"
          aria-live="polite"
          className="sr-only"
          id={`${generatedId}-status`}
        >
          {statusMessage}
        </div>

        {response ? (
          <div className="flex min-h-12 items-center justify-center gap-3 text-base font-bold md:justify-start">
            <CircleCheck aria-hidden="true" className="size-6 text-success" />
            <p>{confirmationMessage}</p>
          </div>
        ) : (
          <div className="grid items-center gap-4 min-[769px]:grid-cols-[minmax(0,1fr)_minmax(140px,190px)] min-[769px]:gap-x-[25px]">
            <fieldset className="min-w-0">
              <legend className="sr-only" id={questionId}>
                {question}
              </legend>
              <div className="grid items-center gap-4 min-[769px]:grid-cols-[minmax(0,1fr)_auto] min-[769px]:gap-x-[25px]">
                <p
                  aria-hidden="true"
                  className="text-center text-base font-medium leading-6 min-[769px]:text-left"
                >
                  {question}
                </p>
                <div className="grid w-full max-w-[400px] grid-cols-2 gap-[25px] justify-self-center min-[769px]:flex min-[769px]:w-auto min-[769px]:max-w-none">
                <Button
                  aria-describedby={questionId}
                  aria-label={yesAccessibleLabel}
                  className="w-full min-w-28 bg-white px-6 min-[769px]:w-auto min-[769px]:min-w-24 min-[769px]:px-7"
                  onClick={() => respond('yes')}
                  size="lg"
                  type="button"
                  variant="secondary"
                >
                  {yesLabel}
                </Button>
                <Button
                  aria-describedby={questionId}
                  aria-label={noAccessibleLabel}
                  className="w-full min-w-28 bg-white px-6 min-[769px]:w-auto min-[769px]:min-w-24 min-[769px]:px-7"
                  onClick={() => respond('no')}
                  size="lg"
                  type="button"
                  variant="secondary"
                >
                  {noLabel}
                </Button>
                </div>
              </div>
            </fieldset>

            {showReportButton ? (
              <div className="flex min-h-11 w-full justify-center min-[769px]:justify-end">
                {reportHref ? (
                  <Button asChild className="px-2" size="lg" variant="text">
                    <a aria-label={reportAccessibleLabel} href={reportHref}>
                      {reportLabel}
                    </a>
                  </Button>
                ) : (
                  <Button
                    aria-label={reportAccessibleLabel}
                    className="px-2"
                    onClick={onReport}
                    size="lg"
                    type="button"
                    variant="text"
                  >
                    {reportLabel}
                  </Button>
                )}
              </div>
            ) : (
              <div aria-hidden="true" className="hidden min-[769px]:block" />
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export type { FeedbackBarProps }
