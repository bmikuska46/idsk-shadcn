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
  | { href: string; tags?: Array<{ href?: never; text: string }> }
  | { href?: undefined; tags?: CardTag[] }

export type CardProps = CardBaseProps & CardImageProps & CardLinkProps

export function Card({
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
        'relative flex h-full w-full min-w-0 overflow-hidden rounded-[10px] border-2 border-[#BDBDBD] bg-white tracking-wide transition-all duration-200',
        isHorizontal ? 'flex-col min-[730px]:flex-row' : 'flex-col',
        isLinked && 'group-hover:ring-[4px] group-hover:ring-[#757575]',
        !isLinked && className,
      )}
    >
      {imageSrc ? (
        <div
          className={cn(
            'relative shrink-0 overflow-hidden bg-zinc-200',
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
      <div className="flex min-w-0 grow flex-col justify-start p-5">
        <div className="flex flex-col gap-[10px]">
          <Heading
            className={cn(
              'line-clamp-2 text-[24px]/[36px] font-bold tracking-[0.5px]',
              isLinked ? 'text-[#0B4199] underline' : 'text-[#212121]',
            )}
          >
            {title}
          </Heading>
          <p className="line-clamp-3 text-[19px]/[28px] font-normal tracking-[0.5px] text-[#212121]">
            {description}
          </p>
        </div>
        {date || tags?.length ? (
          <p className="mt-5 flex flex-wrap items-center gap-x-[10px] gap-y-1 text-[16px]/[24px] tracking-wide text-[#757575]">
            {date ? <time dateTime={date}>{dateLabel ?? date}</time> : null}
            {tags?.map((tag, index) => (
              <span className="flex items-center gap-x-[10px]" key={`${tag.text}-${index}`}>
                {date || index > 0 ? (
                  <span aria-hidden="true">{date && index === 0 ? '—' : '|'}</span>
                ) : null}
                {tag.href && !isLinked ? (
                  <a
                    className="rounded-[5px] text-[#0B4199] underline hover:decoration-[3px] focus:outline focus:outline-[3px] focus:outline-[#D96E00] focus:outline-offset-2"
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
      </div>
    </article>
  )

  if (href) {
    const opensNewWindow = target === '_blank'

    return (
      <a
        className={cn(
          'group block h-full min-w-0 max-w-[1060px] rounded-[10px] focus:outline-[3px] focus:outline-solid focus:outline-[#D96E00] focus:outline-offset-2',
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
