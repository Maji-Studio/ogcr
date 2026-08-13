import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Tractor } from '@phosphor-icons/react'
import * as Icons from '.'
import { LeafIcon, PlusIcon, createDecorativeIcon } from '.'

/** The glyph exports are the PascalCase `*Icon` names; everything else is a helper/type. */
const glyphNames = Object.keys(Icons).filter((name) => /^[A-Z].*Icon$/.test(name))

describe('icons', () => {
  it('marks every glyph aria-hidden by default', () => {
    const { container } = render(<LeafIcon />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('lets a caller opt back into the a11y tree', () => {
    const { container } = render(<PlusIcon aria-hidden={false} aria-label="Add" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'false')
    expect(svg).toHaveAttribute('aria-label', 'Add')
  })

  it('exposes createDecorativeIcon so apps can wrap glyphs on the same contract', () => {
    const TractorIcon = createDecorativeIcon(Tractor, 'TractorIcon')
    expect(TractorIcon.displayName).toBe('TractorIcon')
    const { container } = render(<TractorIcon />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('covers the glyphs the farmer app was importing raw from Phosphor', () => {
    const required = [
      'ArrowClockwiseIcon',
      'ArrowRightIcon',
      'CaretLeftIcon',
      'ChartBarIcon',
      'CheckIcon',
      'CheckCircleIcon',
      'CornersOutIcon',
      'CurrencyEurIcon',
      'DatabaseIcon',
      'FactoryIcon',
      'FileTextIcon',
      'GaugeIcon',
      'GearIcon',
      'GlobeIcon',
      'HandshakeIcon',
      'HouseIcon',
      'InfoIcon',
      'LeafIcon',
      'ListIcon',
      'LockIcon',
      'LockKeyIcon',
      'MapIcon',
      'MinusIcon',
      'PackageIcon',
      'PencilIcon',
      'PlantIcon',
      'PlusIcon',
      'PrinterIcon',
      'ShieldCheckIcon',
      'ShoppingCartIcon',
      'TrashIcon',
      'XIcon',
    ]
    expect(glyphNames).toEqual(expect.arrayContaining(required))
  })

  it('names every glyph for React DevTools', () => {
    for (const name of glyphNames) {
      const Glyph = Icons[name as keyof typeof Icons] as { displayName?: string }
      expect(Glyph.displayName).toBe(name)
    }
  })
})
