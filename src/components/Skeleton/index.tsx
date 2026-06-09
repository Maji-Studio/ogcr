import type { ComponentPropsWithoutRef, CSSProperties } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const skeleton = cva('block bg-surface-neutral animate-pulse', {
  variants: {
    variant: {
      text: 'h-[1em] w-full rounded-4',
      rectangular: 'rounded-12',
      circular: 'rounded-full',
    },
  },
  defaultVariants: { variant: 'rectangular' },
})

export type SkeletonVariant = NonNullable<VariantProps<typeof skeleton>['variant']>

export type SkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  variant?: SkeletonVariant
  width?: number | string
  height?: number | string
  /** For `variant="text"`: render N stacked lines (last line is shortened). */
  lines?: number
}

const toDim = (value: number | string | undefined) =>
  value == null ? undefined : typeof value === 'number' ? `${value}px` : value

export function Skeleton({
  variant = 'rectangular',
  width,
  height,
  lines,
  className,
  style,
  ...rest
}: SkeletonProps) {
  if (variant === 'text' && lines && lines > 1) {
    const lineStyle: CSSProperties = { height: toDim(height) }
    return (
      <div
        data-slot="skeleton-group"
        aria-hidden="true"
        className={cn('flex flex-col gap-8', className)}
        style={{ width: toDim(width), ...style }}
        {...rest}
      >
        {Array.from({ length: lines }).map((_, index) => (
          <span
            key={index}
            data-slot="skeleton"
            className={cn(skeleton({ variant: 'text' }), index === lines - 1 && 'w-3/5')}
            style={lineStyle}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(skeleton({ variant }), className)}
      style={{ width: toDim(width), height: toDim(height), ...style }}
      {...rest}
    />
  )
}
