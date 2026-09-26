import type { ReactNode } from 'react'

import { MaterialIcon } from '@/components/ui/material-icon'
import { cn } from '@/lib/utils'

type SignpostBaseProps = {
  className?: string
  description: ReactNode
  headingLevel?: 2 | 3 | 4
  href?: string
  /** Decorative thematic icon displayed before the title, rendered at 36px. */
  icon?: ReactNode
  newWindowLabel?: string
  rel?: string
  /** IDSK signposts end with an arrow; pass `false` for the plain text variant. */
  showArrow?: boolean
  tag?: string
  target?: string
  title: ReactNode
  variant?: 'text' | 'horizontal' | 'vertical'
}

type SignpostImageProps =
  | { imageAlt: string; imageSrc: string }
  | { imageAlt?: never; imageSrc?: never }

export type SignpostProps = SignpostBaseProps & SignpostImageProps

/**
 * IDSK "Rozcestník": white box, 2px N300 border, 10px radius, 20px padding.
 * Title is Headline M in the link colour with underline, description is Body
 * 5px below, arrow_forward on the right. Hover shows the 5px N600 outline.
 */
export function Signpost({
  className,
  description,
  headingLevel = 3,
  href,
  icon,
  imageAlt,
  imageSrc,
  newWindowLabel = 'Otvorí sa v novom okne.',
  rel,
  showArrow = true,
  tag,
  target,
  title,
  variant = 'horizontal',
}: SignpostProps) {
  const Heading = headingLevel === 2 ? 'h2' : headingLevel === 4 ? 'h4' : 'h3'
  const hasImage = variant === 'vertical' && Boolean(imageSrc)
  const opensNewWindow = target === '_blank'
  const rootClassName = cn(
    'group block w-full min-w-0 rounded-[10px] border-2 border-border bg-white no-underline transition-shadow duration-100',
    href &&
      'hover:ring-[5px] hover:ring-foreground-muted focus:outline-none focus-visible:outline-solid focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus',
    hasImage ? 'overflow-hidden' : 'p-[18px]',
    className,
  )

  const content = (
    <>
      {hasImage ? (
        <div className="h-[192px] w-full overflow-hidden bg-surface-hover">
          <img
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
            src={imageSrc}
          />
        </div>
      ) : null}
      <div className={cn(hasImage && 'p-[18px]')}>
        {tag ? (
          <span className="mb-[10px] inline-flex rounded-[5px] bg-surface-primary px-[10px] py-[2px] text-[16px] leading-6 font-bold text-link">
            {tag}
          </span>
        ) : null}
        <div className="flex items-start gap-5">
          {icon ? (
            <span aria-hidden="true" className="shrink-0 text-link [&>svg]:size-9">
              {icon}
            </span>
          ) : null}
          <div className="flex min-w-0 grow flex-col gap-[5px]">
            <Heading className="min-w-0 text-[24px] leading-9 font-bold text-link underline group-hover:decoration-[3px]">
              {title}
            </Heading>
            <p className="text-[19px] leading-7 text-foreground">{description}</p>
          </div>
          {showArrow ? (
            <span aria-hidden="true" className="shrink-0 py-[6px] text-link">
              <MaterialIcon name="arrowForward" className="size-6" focusable="false" />
            </span>
          ) : null}
        </div>
        {opensNewWindow ? (
          <span className="sr-only"> {newWindowLabel}</span>
        ) : null}
      </div>
    </>
  )

  if (href) {
    return (
      <a
        className={rootClassName}
        href={href}
        rel={opensNewWindow ? rel ?? 'noopener noreferrer' : rel}
        target={target}
      >
        {content}
      </a>
    )
  }

  return <div className={rootClassName}>{content}</div>
}
