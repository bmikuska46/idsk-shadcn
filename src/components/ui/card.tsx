import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type CardTag = {
  href?: string
  text: string
}

type CardBaseProps = {
  className?: string
  date?: string
  dateLabel?: string
  description: ReactNode
  headingLevel?: 2 | 3 | 4
  rel?: string
  target?: string
  title: ReactNode
  variant?: 'horizontal' | 'vertical'
}

type CardImageProps =
  | { imageAlt: string; imageSrc: string }
  | { imageAlt?: never; imageSrc?: never }

type CardLinkProps =
  | { actions?: never; href: string; tags?: Array<{ href?: never; text: string }> }
  | {
      /** Buttons rendered under the content. Only available when the card itself is not a link. */
      actions?: ReactNode
      href?: undefined
      tags?: CardTag[]
    }

export type CardProps = CardBaseProps & CardImageProps & CardLinkProps

/**
 * IDSK "Karta": white surface with a 2px N300 border and 10px radius, 20px
 * content padding, Headline M title and Body description. Linked cards show
 * the 5px N600 hover outline and the orange focus outline on the whole card.
 */
export function Card({
  actions,
  className,
  date,
  dateLabel,
  description,
  headingLevel = 3,
  href,
  imageAlt,
  imageSrc,
  rel,
  tags,
  target,
  title,
  variant = 'horizontal',
}: CardProps) {
  const Heading = headingLevel === 2 ? 'h2' : headingLevel === 4 ? 'h4' : 'h3'
  const isHorizontal = variant === 'horizontal'
  const isLinked = Boolean(href)

  const article = (
    <article
      className={cn(
        'relative flex h-full w-full min-w-0 overflow-hidden rounded-[10px] border-2 border-border bg-white transition-shadow duration-100',
        isHorizontal ? 'flex-col min-[730px]:flex-row' : 'flex-col',
        isLinked && 'group-hover:ring-[5px] group-hover:ring-foreground-muted',
        !isLinked && className,
      )}
    >
      {imageSrc ? (
        <div
          className={cn(
            'relative shrink-0 overflow-hidden bg-surface-hover',
            isHorizontal
              ? 'h-[192px] w-full min-[730px]:h-auto min-[730px]:min-h-[170px] min-[730px]:w-[40%] min-[730px]:max-w-[360px]'
              : 'h-[192px] w-full',
          )}
        >
          <img
            alt={imageAlt}
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              isLinked &&
                'transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105',
            )}
            src={imageSrc}
          />
        </div>
      ) : null}
      <div className={cn('flex min-w-0 grow flex-col justify-start px-[18px] pb-[18px]', imageSrc ? 'pt-5' : 'pt-[18px]')}>
        <div className="flex flex-col gap-[10px]">
          <Heading
            className={cn(
              'text-[24px] leading-9 font-bold',
              isLinked && 'line-clamp-2',
              isLinked ? 'text-link underline group-hover:decoration-[3px]' : 'text-foreground',
            )}
          >
            {title}
          </Heading>
          <p className={cn('text-[19px] leading-7 text-foreground', isLinked && 'line-clamp-3')}>{description}</p>
        </div>
        {date || tags?.length ? (
          <p className="mt-[10px] flex flex-wrap items-center gap-x-[10px] gap-y-1 text-[16px] leading-6 text-foreground-muted">
            {date ? <time dateTime={date}>{dateLabel ?? date}</time> : null}
            {tags?.map((tag, index) => (
              <span className="flex items-center gap-x-[10px]" key={`${tag.text}-${index}`}>
                {date || index > 0 ? (
                  <span aria-hidden="true">{date && index === 0 ? '-' : '|'}</span>
                ) : null}
                {tag.href && !isLinked ? (
                  <a
                    className="rounded-[5px] text-link underline hover:decoration-[3px] focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-focus"
                    href={tag.href}
                  >
                    {tag.text}
                  </a>
                ) : (
                  <span>{tag.text}</span>
                )}
              </span>
            ))}
          </p>
        ) : null}
        {actions && !isLinked ? (
          <div className="mt-5 flex flex-wrap items-center gap-[25px]">{actions}</div>
        ) : null}
      </div>
    </article>
  )

  if (href) {
    const opensNewWindow = target === '_blank'

    return (
      <a
        className={cn(
          'group block h-full min-w-0 rounded-[10px] focus:outline-solid focus:outline-[3px] focus:outline-offset-2 focus:outline-focus',
          className,
        )}
        href={href}
        rel={opensNewWindow ? rel ?? 'noopener noreferrer' : rel}
        target={target}
      >
        {article}
      </a>
    )
  }

  return article
}
