import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { Button } from '../components/Button'

/**
 * The theming seam (Phase 1a).
 *
 * Every brand color lives in `src/styles/palette.css` as a runtime `--ds-*`
 * custom property. The `@theme inline` color tokens reference those, so each
 * color utility bakes a `var(--ds-…)` reference — not a frozen hex. Override a
 * `--ds-*` on any scoping element and every utility (and focus shadow) that
 * derives from it follows, with no rebuild.
 *
 * The filled `Button` paints with `bg-interaction-primary-default`. The right
 * column below scopes three `--ds-interaction-primary-*` overrides to a wrapper
 * `div`; the button visibly retints while the left column keeps the default
 * green. Same component, same class — only the seam moved.
 */
const meta = {
  title: 'Foundations/Theming',
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Scoped palette override — only this subtree sees the retinted interaction color.
const overridden: CSSProperties = {
  '--ds-interaction-primary-default': '#7c3aed',
  '--ds-interaction-primary-hover': '#6d28d9',
  '--ds-interaction-primary-active': '#5b21b6',
} as CSSProperties

export const SeamOverride: Story = {
  render: () => (
    <div className="flex items-start gap-48">
      <section className="flex flex-col items-center gap-12">
        <p className="text-body-s text-text-secondary">Default palette</p>
        <Button variant="filled">Issue credits</Button>
      </section>

      <section style={overridden} className="flex flex-col items-center gap-12">
        <p className="text-body-s text-text-secondary">--ds-* overridden on this wrapper</p>
        <Button variant="filled">Issue credits</Button>
      </section>
    </div>
  ),
}
