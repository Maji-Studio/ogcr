import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

/* Size scale (spec §4.1 + §7.1 Icon Button + §8 hit targets):
 *   s → 32px — the compact/dense control height. Below the 40×40 minimum hit
 *              target, so only use it inside a larger padded row (spec §8).
 *   m → 40px — the smallest height that satisfies the 40×40 minimum on its own.
 *   l → 48px — the standard `filled`/`outlined` height from spec §4.1.
 * `size` is optional; when omitted each variant falls back to its spec height
 * (`filled`/`outlined` → l, `text` → m). */
const button = cva(
  [
    'inline-flex items-center justify-center font-standard font-medium leading-none tracking-[0.28px] text-s',
    'cursor-pointer select-none whitespace-nowrap border border-transparent',
    'transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out',
    'focus-visible:outline-none focus-visible:shadow-focus-primary',
    'active:translate-y-px',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0',
  ],
  {
    variants: {
      variant: {
        filled: [
          'bg-interaction-primary-default text-surface-page',
          'hover:not-disabled:bg-interaction-primary-hover active:bg-interaction-primary-active',
        ],
        outlined: [
          'bg-surface-light border-border-medium text-text-primary',
          'hover:not-disabled:bg-surface-neutral hover:not-disabled:border-border-strong',
        ],
        text: ['bg-transparent text-text-primary', 'hover:not-disabled:bg-surface-neutral'],
      },
      size: {
        s: 'h-32 gap-8 px-8 rounded-8',
        m: 'h-40 gap-8 px-12 rounded-8',
        l: 'h-48 gap-12 px-16 rounded-12',
      },
      fullWidth: { true: 'w-full', false: '' },
      /** Square hit area, no label — the label lives in `aria-label` (spec §7.1). */
      iconOnly: { true: 'px-0 shrink-0', false: '' },
      shape: { rounded: '', circle: 'rounded-full' },
    },
    compoundVariants: [
      { iconOnly: true, size: 's', class: 'w-32' },
      { iconOnly: true, size: 'm', class: 'w-40' },
      { iconOnly: true, size: 'l', class: 'w-48' },
    ],
    defaultVariants: { variant: 'filled', fullWidth: false, iconOnly: false, shape: 'rounded' },
  },
)

export type ButtonVariant = NonNullable<VariantProps<typeof button>['variant']>
export type ButtonSize = NonNullable<VariantProps<typeof button>['size']>
export type ButtonShape = NonNullable<VariantProps<typeof button>['shape']>

/** Spec height per variant when no explicit `size` is given. */
const DEFAULT_SIZE: Record<ButtonVariant, ButtonSize> = {
  filled: 'l',
  outlined: 'l',
  text: 'm',
}

/** Icon box per size — 24px at `l` (spec §4.1), 20px below it (spec §5 control size). */
const ICON_BOX: Record<ButtonSize, string> = {
  s: 'w-20 h-20',
  m: 'w-20 h-20',
  l: 'w-24 h-24',
}

const iconSlot = 'inline-flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full'

type ButtonOwnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  /** Control height. Defaults to the variant's spec height — `l` (48px), or `m` (40px) for `text`. */
  size?: ButtonSize
  /** Stretches the button to its container — replaces `className="w-full"`. */
  fullWidth?: boolean
  /** Renders a square, label-less button (FAB / toolbar icon). Requires an accessible name. */
  iconOnly?: boolean
  /** `circle` fully rounds the corners — the FAB shape. */
  shape?: ButtonShape
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

/**
 * An icon-only button has no visible text, so the accessible name has to come from
 * `aria-label` or `aria-labelledby` (spec §8). The union makes that a type error to omit.
 */
export type ButtonProps =
  | (ButtonOwnProps & { iconOnly?: false })
  | (ButtonOwnProps & { iconOnly: true; 'aria-label': string })
  | (ButtonOwnProps & { iconOnly: true; 'aria-labelledby': string })

export function Button(props: ButtonProps) {
  const {
    variant = 'filled',
    size,
    fullWidth = false,
    iconOnly = false,
    shape = 'rounded',
    iconLeft,
    iconRight,
    className,
    children,
    type = 'button',
    ...rest
  } = props as ButtonOwnProps

  const resolvedSize = size ?? DEFAULT_SIZE[variant]
  const classes = cn(
    button({ variant, size: resolvedSize, fullWidth, iconOnly, shape }),
    className,
  )

  if (iconOnly) {
    return (
      <button data-slot="button" data-icon-only="true" type={type} className={classes} {...rest}>
        <span
          data-slot="button-icon"
          aria-hidden="true"
          className={cn(iconSlot, ICON_BOX[resolvedSize])}
        >
          {iconLeft ?? iconRight ?? children}
        </span>
      </button>
    )
  }

  return (
    <button data-slot="button" type={type} className={classes} {...rest}>
      {iconLeft && (
        <span
          data-slot="button-icon"
          aria-hidden="true"
          className={cn(iconSlot, ICON_BOX[resolvedSize])}
        >
          {iconLeft}
        </span>
      )}
      {children !== undefined && (
        <span data-slot="button-label" className="inline-flex items-center whitespace-nowrap">
          {children}
        </span>
      )}
      {iconRight && (
        <span
          data-slot="button-icon"
          aria-hidden="true"
          className={cn(iconSlot, ICON_BOX[resolvedSize])}
        >
          {iconRight}
        </span>
      )}
    </button>
  )
}
