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
        'inline-flex items-center gap-3',
        inverted ? 'text-white' : 'text-foreground',
        className,
      )}
    >
      <div className="flex flex-col leading-none">
        <span className="text-[1.125rem] font-black">{siteName}</span>
        <span
          className={cn(
            'idsk-caption mt-1',
            inverted ? 'text-white/80' : 'text-foreground-muted',
          )}
        >
          {tagline}
        </span>
      </div>
    </div>
  )
}
