import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SignpostBaseProps = {
  className?: string
  description: ReactNode
  headingLevel?: 2 | 3 | 4
  href?: string
  /** Decorative thematic icon displayed before the title. */
  icon?: ReactNode
  /** Kept for the image-led compatibility variant; IDSK horizontal signposts do not require an image. */
  newWindowLabel?: string
  rel?: string
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
  showArrow = false,
  tag,
  target,
  title,
  variant = 'horizontal',
}: SignpostProps) {
  const Heading = headingLevel === 2 ? 'h2' : headingLevel === 4 ? 'h4' : 'h3'
  const hasImage = variant === 'vertical' && Boolean(imageSrc)
  const opensNewWindow = target === '_blank'
  const rootClassName = cn(
    'group block w-full rounded-[10px] border-2 border-[#BDBDBD] bg-white tracking-wide no-underline hover:ring-[4px] hover:ring-[#757575] focus:outline-none focus-visible:outline-[3px] focus-visible:outline-solid focus-visible:outline-[#D96E00] focus-visible:outline-offset-2',
    hasImage ? 'overflow-hidden' : 'p-5',
    className,
  )

  const content = (
    <>
      {hasImage ? (
        <div className="h-[192px] w-full overflow-hidden bg-zinc-200">
          <img
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
            src={imageSrc}
          />
        </div>
      ) : null}
      <div className={cn(hasImage && 'p-5')}>
        {tag ? (
          <span className="mb-3 inline-flex rounded-full bg-[#EFF5FE] px-3 py-1 text-sm font-bold text-[#0B4199]">
            {tag}
          </span>
        ) : null}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            {icon ? (
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-[#0B4199]"
              >
                {icon}
              </span>
            ) : null}
            <Heading className="text-[19px] leading-7 font-bold text-[#0B4199] underline sm:text-[24px] sm:leading-9 group-hover:decoration-[3px] group-hover:underline-offset-2">
              {title}
            </Heading>
          </div>
          {showArrow ? (
            <ArrowRight
              aria-hidden="true"
              className="mt-1 h-6 w-6 shrink-0 text-[#0B4199] group-focus-visible:text-[#0B0C0C]"
              focusable="false"
              strokeWidth={2}
            />
          ) : null}
        </div>
        <p className="mt-5 text-[19px] leading-7 text-[#212121] group-focus-visible:text-[#0B0C0C]">
          {description}
        </p>
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
