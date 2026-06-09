import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const button = cva(
  [
    'inline-flex items-center justify-center gap-12 font-standard font-medium leading-none tracking-[0.28px] text-s',
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
          'h-48 px-16 rounded-12',
          'bg-interaction-primary-default text-surface-page',
          'hover:not-disabled:bg-interaction-primary-hover active:bg-interaction-primary-active',
        ],
        outlined: [
          'h-48 px-16 rounded-12',
          'bg-surface-light border-border-medium text-text-primary',
          'hover:not-disabled:bg-surface-neutral hover:not-disabled:border-border-strong',
        ],
        text: [
          'h-32 px-8 rounded-8',
          'bg-transparent text-text-primary',
          'hover:not-disabled:bg-surface-neutral',
        ],
      },
    },
    defaultVariants: { variant: 'filled' },
  },
)

export type ButtonVariant = NonNullable<VariantProps<typeof button>['variant']>

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {
    iconLeft?: ReactNode
    iconRight?: ReactNode
  }

export function Button({
  variant,
  iconLeft,
  iconRight,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      data-slot="button"
      type={type}
      className={cn(button({ variant }), className)}
      {...rest}
    >
      {iconLeft && (
        <span data-slot="button-icon" aria-hidden="true" className="inline-flex w-24 h-24 shrink-0 [&>svg]:w-full [&>svg]:h-full">
          {iconLeft}
        </span>
      )}
      {children !== undefined && (
        <span data-slot="button-label" className="inline-flex items-center whitespace-nowrap">
          {children}
        </span>
      )}
      {iconRight && (
        <span data-slot="button-icon" aria-hidden="true" className="inline-flex w-24 h-24 shrink-0 [&>svg]:w-full [&>svg]:h-full">
          {iconRight}
        </span>
      )}
    </button>
  )
}
