import { cn } from '@/lib/utils'

type GovernmentLogoProps = {
  className?: string
  inverted?: boolean
  siteName?: string
  tagline?: string
}

export function GovernmentLogo({
  className,
  inverted,
  siteName = 'IDSK shadcn',
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
      <div className="flex min-w-0 flex-col leading-none">
        <span className="break-words text-[1.125rem] font-black">{siteName}</span>
        <span
          className={cn(
            'idsk-caption mt-1 text-pretty',
            inverted ? 'text-white/80' : 'text-foreground-muted',
          )}
        >
          {tagline}
        </span>
      </div>
    </div>
  )
}
