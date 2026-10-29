import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const pill = cva(
  'inline-flex items-center font-standard font-normal whitespace-nowrap',
  {
    variants: {
      /** `m` is the default pill; `xs` is the dense status chip (prototype `.stchip` / `.tag`). */
      size: {
        /* leading follows text-*: tailwind-merge drops a leading-* that precedes a font-size class. */
        m: 'gap-8 px-8 py-4 text-s leading-[1.4]',
        xs: 'gap-4 px-8 py-2 text-xxs leading-[1.4]',
      },
      shape: {
        rounded: 'rounded-8',
        round: 'rounded-full',
      },
      tone: {
        neutral: 'bg-surface-neutral text-text-primary',
        positive: 'bg-surface-positive text-text-positive',
        warning: 'bg-surface-warning text-text-warning',
        negative: 'bg-surface-negative text-text-negative',
        /** In-flight / informational — the blue "progress" ramp from the Figma token set. */
        progress: 'bg-surface-progress text-text-progress',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'm', shape: 'rounded' },
  },
)

export type PillTone = NonNullable<VariantProps<typeof pill>['tone']>
export type PillSize = NonNullable<VariantProps<typeof pill>['size']>
export type PillShape = NonNullable<VariantProps<typeof pill>['shape']>

export type PillProps = ComponentPropsWithoutRef<'span'> & {
  children: ReactNode
  tone?: PillTone
  /** `m` (default) or `xs` (12px text, tight padding, scaled-down icon and dot). */
  size?: PillSize
  /** `rounded` (default, 8px radius) or `round` (fully round). */
  shape?: PillShape
  /**
   * Renders a small round status dot before the label, tinted with the tone's own
   * text colour (`currentColor`). For a dot in some other colour — or any other
   * leading glyph — pass `leading` instead.
   */
  dot?: boolean
  /** Arbitrary leading content (icon, custom-coloured dot). Takes precedence over `dot`. */
  leading?: ReactNode
}

export function Pill({
  tone,
  size,
  shape,
  dot = false,
  leading,
  children,
  className,
  ...rest
}: PillProps) {
  const xs = size === 'xs'
  return (
    <span
      {...rest}
      data-slot="pill"
      data-tone={tone ?? 'neutral'}
      className={cn(pill({ tone, size, shape }), className)}
    >
      {leading ? (
        <span
          data-slot="pill-leading"
          aria-hidden="true"
          className={cn(
            'inline-flex shrink-0 items-center justify-center',
            xs ? '[&>svg]:w-12 [&>svg]:h-12' : '[&>svg]:w-16 [&>svg]:h-16',
          )}
        >
          {leading}
        </span>
      ) : (
        dot && (
          <span
            data-slot="pill-dot"
            aria-hidden="true"
            className={cn('inline-block shrink-0 rounded-full bg-current', xs ? 'w-6 h-6' : 'w-8 h-8')}
          />
        )
      )}
      {children}
    </span>
  )
}
