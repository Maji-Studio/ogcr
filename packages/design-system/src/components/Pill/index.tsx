import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const pill = cva(
  'inline-flex items-center gap-8 px-8 py-4 rounded-8 font-standard font-normal text-s leading-[1.4] whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'bg-surface-neutral text-text-primary',
        positive: 'bg-surface-positive text-text-positive',
        warning: 'bg-surface-warning text-text-warning',
        negative: 'bg-surface-negative text-text-negative',
        /** In-flight / informational — the blue "progress" ramp from the Figma token set. */
        progress: 'bg-surface-progress text-text-progress',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export type PillTone = NonNullable<VariantProps<typeof pill>['tone']>

export type PillProps = ComponentPropsWithoutRef<'span'> & {
  children: ReactNode
  tone?: PillTone
  /**
   * Renders a small round status dot before the label, tinted with the tone's own
   * text colour (`currentColor`). For a dot in some other colour — or any other
   * leading glyph — pass `leading` instead.
   */
  dot?: boolean
  /** Arbitrary leading content (icon, custom-coloured dot). Takes precedence over `dot`. */
  leading?: ReactNode
}

export function Pill({ tone, dot = false, leading, children, className, ...rest }: PillProps) {
  return (
    <span {...rest} data-slot="pill" data-tone={tone ?? 'neutral'} className={cn(pill({ tone }), className)}>
      {leading ? (
        <span
          data-slot="pill-leading"
          aria-hidden="true"
          className="inline-flex shrink-0 items-center justify-center [&>svg]:w-16 [&>svg]:h-16"
        >
          {leading}
        </span>
      ) : (
        dot && (
          <span
            data-slot="pill-dot"
            aria-hidden="true"
            className="inline-block w-8 h-8 shrink-0 rounded-full bg-current"
          />
        )
      )}
      {children}
    </span>
  )
}
