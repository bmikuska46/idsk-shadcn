import { cn } from '@/lib/utils'

type GovernmentLogoProps = {
  className?: string
  inverted?: boolean
  /** `header` renders the name as Headline M in the link colour. */
  size?: 'default' | 'header'
  siteName?: string
  /** Service type shown under the site name in the header, e.g. "Elektronická služba". */
  subheading?: string
  tagline?: string
}

export function GovernmentLogo({
  className,
  inverted,
  size = 'default',
  siteName = 'IDSK shadcn',
  subheading,
  tagline = 'Neoficiálna ukážka komponentov',
}: GovernmentLogoProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 max-w-full items-center gap-3',
        inverted ? 'text-white' : 'text-foreground',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col">
        <span
          className={cn(
            'break-words font-bold',
            size === 'header' ? 'text-[24px] leading-[35px]' : 'text-[19px] leading-7',
            !inverted && size === 'header' && 'text-link',
          )}
        >
          {siteName}
        </span>
        {subheading ? (
          <span className={cn('text-[16px] leading-6', inverted ? 'text-white/80' : 'text-foreground-soft')}>
            {subheading}
          </span>
        ) : null}
        {tagline ? (
          <span
            className={cn(
              'text-[14px] leading-5 text-pretty',
              inverted ? 'text-white/80' : 'text-foreground-soft',
            )}
          >
            {tagline}
          </span>
        ) : null}
      </div>
    </div>
  )
}
