import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Avatar as BaseAvatar } from '@base-ui/react/avatar'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const avatar = cva(
  [
    'relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none align-middle',
    'bg-surface-strong text-white font-standard font-semibold uppercase tracking-[0.4px]',
    '[&>svg]:w-1/2 [&>svg]:h-1/2',
  ],
  {
    variants: {
      size: {
        xs: 'w-24 h-24 text-[10px]',
        s: 'w-28 h-28 text-[11px]',
        m: 'w-32 h-32 text-[12px]',
        l: 'w-40 h-40 text-s',
        xl: 'w-48 h-48 text-m',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-12',
      },
    },
    defaultVariants: { size: 'm', shape: 'circle' },
  },
)

export type AvatarSize = NonNullable<VariantProps<typeof avatar>['size']>
export type AvatarShape = NonNullable<VariantProps<typeof avatar>['shape']>

export type AvatarProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  /** Image source. Falls back to initials while loading or on error. */
  src?: string
  /** Image alt text. Defaults to `name`. */
  alt?: string
  /** Person/entity name — drives derived initials and the default `alt`. */
  name?: string
  /** Explicit fallback content. Overrides initials derived from `name`. */
  initials?: ReactNode
  size?: AvatarSize
  shape?: AvatarShape
  /** Delay (ms) before the fallback appears, avoiding a flash for fast image loads. */
  delay?: number
}

/** "Jane Cooper" → "JC", "Maji" → "MA". Returns '' for empty input. */
// eslint-disable-next-line react-refresh/only-export-components -- helper ships from the component barrel
export function deriveInitials(name?: string): string {
  if (!name) return ''
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export function Avatar({
  src,
  alt,
  name,
  initials,
  size,
  shape,
  delay,
  className,
  ...rest
}: AvatarProps) {
  const fallback = initials ?? deriveInitials(name)
  return (
    <BaseAvatar.Root
      data-slot="avatar"
      className={cn(avatar({ size, shape }), className)}
      {...rest}
    >
      {src && (
        <BaseAvatar.Image
          src={src}
          alt={alt ?? name ?? ''}
          data-slot="avatar-image"
          className="w-full h-full object-cover"
        />
      )}
      <BaseAvatar.Fallback
        delay={delay}
        data-slot="avatar-fallback"
        className="inline-flex items-center justify-center w-full h-full leading-none"
      >
        {fallback}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  )
}
