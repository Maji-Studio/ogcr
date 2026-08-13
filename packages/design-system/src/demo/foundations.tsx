// Foundations — tokens, buttons, KPI, avatar, progress, skeleton, separator.
// One component per specimen section; App.tsx renders them in document order.

import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { Kpi } from '../components/Kpi'
import { ProgressBar } from '../components/ProgressBar'
import { Separator } from '../components/Separator'
import { Skeleton } from '../components/Skeleton'
import { ArrowRightIcon, SearchIcon } from '../components/icons'
import { SectionHead } from './section-head'
import { sec } from './section-meta'

export function TokensSpecimen() {
  return (
      <section id="tokens" className="section reveal">
        <SectionHead meta={sec('tokens')} />
        <div className="section__body">
          <div className="tokens">
            <div className="tokens__group">
              <h3 className="tokens__group-title">Brand & primitives</h3>
              <ul className="tokens__swatches">
                {[
                  { name: '--color-brand-blue-300', value: '#3f88c6' },
                  { name: '--color-brand-blue-800', value: '#1c3d59' },
                  { name: '--color-brand-green-500', value: '#6db087' },
                  { name: '--color-red-500', value: '#ef4444' },
                  { name: '--color-red-600', value: '#dc2626' },
                  { name: '--color-orange-400', value: '#fb923c' },
                  { name: '--color-orange-500', value: '#f97316' },
                  { name: '--color-amber-300', value: '#fcd34d' },
                ].map((t) => (
                  <li key={t.name} className="tokens__swatch">
                    <span className="tokens__chip" style={{ background: t.value }} />
                    <span className="tokens__name">{t.name}</span>
                    <span className="tokens__value">{t.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tokens__group">
              <h3 className="tokens__group-title">Surface</h3>
              <ul className="tokens__swatches">
                {[
                  { name: '--color-surface-page', value: '#f8f3ef' },
                  { name: '--color-surface-light', value: '#ffffff' },
                  { name: '--color-surface-neutral', value: '#f5f5f4' },
                  { name: '--color-surface-strong', value: '#0f3655' },
                  { name: '--color-surface-inverted', value: '#443321' },
                  { name: '--color-surface-positive', value: '#e2efe6' },
                  { name: '--color-surface-warning', value: '#ffedd5' },
                  { name: '--color-surface-negative', value: '#fee2e2' },
                ].map((t) => (
                  <li key={t.name} className="tokens__swatch">
                    <span className="tokens__chip" style={{ background: t.value }} />
                    <span className="tokens__name">{t.name}</span>
                    <span className="tokens__value">{t.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tokens__group">
              <h3 className="tokens__group-title">Text & icon</h3>
              <ul className="tokens__swatches">
                {[
                  { name: '--color-text-primary', value: '#0f3655' },
                  { name: '--color-text-secondary', value: '#6a8196' },
                  { name: '--color-text-neutral', value: '#334155' },
                  { name: '--color-text-positive', value: '#416c51' },
                  { name: '--color-text-negative', value: '#b91c1c' },
                  { name: '--color-text-warning', value: '#c2410c' },
                ].map((t) => (
                  <li key={t.name} className="tokens__swatch">
                    <span className="tokens__chip" style={{ background: t.value }} />
                    <span className="tokens__name">{t.name}</span>
                    <span className="tokens__value">{t.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tokens__group">
              <h3 className="tokens__group-title">Border</h3>
              <ul className="tokens__swatches">
                {[
                  { name: '--color-border-light', value: '#e7e5e4' },
                  { name: '--color-border-medium', value: '#d6d3d1' },
                  { name: '--color-border-strong', value: '#a8a29e' },
                  { name: '--color-border-high-contrast', value: '#443321' },
                  { name: '--color-border-positive-light', value: '#c5dfce' },
                  { name: '--color-border-warning-light', value: '#fed7aa' },
                  { name: '--color-border-negative-light', value: '#fecaca' },
                  { name: '--color-border-negative-strong', value: '#dc2626' },
                ].map((t) => (
                  <li key={t.name} className="tokens__swatch">
                    <span className="tokens__chip" style={{ background: t.value }} />
                    <span className="tokens__name">{t.name}</span>
                    <span className="tokens__value">{t.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tokens__group">
              <h3 className="tokens__group-title">Interaction</h3>
              <ul className="tokens__swatches">
                {[
                  { name: '--color-interaction-primary-default', value: '#4f8263' },
                  { name: '--color-interaction-primary-hover', value: '#416c51' },
                  { name: '--color-interaction-primary-active', value: '#416c51' },
                  { name: '--color-interaction-primary-focus', value: '#e2efe6' },
                  { name: '--color-interaction-secondary-focus', value: '#e2d0bf' },
                  { name: '--color-focus-ring-error', value: '#fecaca' },
                ].map((t) => (
                  <li key={t.name} className="tokens__swatch">
                    <span className="tokens__chip" style={{ background: t.value }} />
                    <span className="tokens__name">{t.name}</span>
                    <span className="tokens__value">{t.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tokens__group">
              <h3 className="tokens__group-title">Typography</h3>
              <ul className="tokens__type">
                {[
                  { name: 'text-h1', size: '32 → 40px', cls: 'text-h1' },
                  { name: 'text-h2', size: '24 → 32px', cls: 'text-h2' },
                  { name: 'text-h3', size: '20 → 24px', cls: 'text-h3' },
                  { name: 'text-h4', size: '18 → 20px', cls: 'text-h4' },
                  { name: 'text-body', size: '18 → 20px', cls: 'text-body' },
                  { name: 'text-body-l', size: '20 → 24px', cls: 'text-body-l' },
                  { name: 'text-body-s', size: '14 → 18px', cls: 'text-body-s' },
                  { name: 'text-lead', size: '20 → 24px', cls: 'text-lead' },
                  { name: 'text-quote', size: '24 → 32px · italic', cls: 'text-quote' },
                  { name: 'text-label-button', size: '14 → 18px', cls: 'text-label-button' },
                  { name: 'text-label-navigation', size: '14 → 18px', cls: 'text-label-navigation' },
                  { name: 'text-label-input', size: '14px', cls: 'text-label-input' },
                ].map((t) => (
                  <li key={t.name} className="tokens__type-row">
                    <div className="tokens__type-meta">
                      <span className="tokens__name">.{t.name}</span>
                      <span className="tokens__value">{t.size}</span>
                    </div>
                    <span className={`tokens__type-sample ${t.cls}`}>The quick brown fox</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tokens__group">
              <h3 className="tokens__group-title">Spacing</h3>
              <ul className="tokens__scale">
                {[
                  { name: '--spacing-4', value: '4px', px: 4 },
                  { name: '--spacing-8', value: '8px', px: 8 },
                  { name: '--spacing-12', value: '12px', px: 12 },
                  { name: '--spacing-16', value: '16px', px: 16 },
                  { name: '--spacing-24', value: '24px', px: 24 },
                  { name: '--spacing-32', value: '32px', px: 32 },
                  { name: '--spacing-64', value: '64px', px: 64 },
                ].map((t) => (
                  <li key={t.name} className="tokens__scale-row">
                    <span className="tokens__name">{t.name}</span>
                    <span
                      className="tokens__bar"
                      style={{ width: t.px }}
                      aria-hidden="true"
                    />
                    <span className="tokens__value">{t.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tokens__group">
              <h3 className="tokens__group-title">Radius</h3>
              <ul className="tokens__radii">
                {[
                  { name: '--radius-2', value: '2px', px: 2 },
                  { name: '--radius-4', value: '4px', px: 4 },
                  { name: '--radius-8', value: '8px', px: 8 },
                  { name: '--radius-12', value: '12px', px: 12 },
                  { name: '--radius-16', value: '16px', px: 16 },
                  { name: '--radius-full', value: '999px', px: 32 },
                ].map((t) => (
                  <li key={t.name} className="tokens__radius-cell">
                    <span
                      className="tokens__radius-shape"
                      style={{ borderRadius: t.px }}
                      aria-hidden="true"
                    />
                    <span className="tokens__name">{t.name}</span>
                    <span className="tokens__value">{t.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tokens__group">
              <h3 className="tokens__group-title">Elevation & motion</h3>
              <div className="tokens__misc">
                <div className="tokens__elevation">
                  <span className="tokens__elevation-card" aria-hidden="true" />
                  <span className="tokens__name">--elevation-l</span>
                  <span className="tokens__value">card · 0 8 16 rgba(68,51,33,.16)</span>
                </div>
                <div className="tokens__motion">
                  <span className="tokens__name">--motion-fast</span>
                  <span className="tokens__value">150ms ease-out</span>
                </div>
                <div className="tokens__motion">
                  <span className="tokens__name">--motion-base</span>
                  <span className="tokens__value">200ms cubic-bezier(.2,0,0,1)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export function ButtonsSpecimen() {
  return (
      <section id="buttons" className="section reveal">
        <SectionHead meta={sec('buttons')} />
        <div className="section__body">
          <div className="button-row">
            <Button variant="filled">Primary action</Button>
            <Button variant="filled" iconRight={<ArrowRightIcon />}>Continue</Button>
            <Button variant="outlined">Secondary</Button>
            <Button variant="outlined" iconLeft={<SearchIcon />}>Search</Button>
            <Button variant="text">Tertiary</Button>
            <Button variant="filled" disabled>Disabled</Button>
          </div>
        </div>
      </section>
  )
}

export function KpiSpecimen() {
  return (
      <section id="kpi" className="section reveal">
        <SectionHead meta={sec('kpi')} />
        <div className="section__body">
          <div className="specimen-stack specimen-stack--narrow">
            <Kpi
              label="Total credits issued"
              value="694,820 t"
              secondaryText="Year to date"
              status={{ label: 'On track', tone: 'positive' }}
              tone="positive"
            />
            <Kpi
              label="Pending validations"
              value="14"
              secondaryText="3 due this week"
              status={{ label: 'Attention', tone: 'warning' }}
              tone="warning"
            />
            <Kpi
              label="Failed audits"
              value="2"
              secondaryText="Reopened by reviewer"
              status={{ label: 'Action needed', tone: 'negative' }}
              tone="negative"
            />
            <Kpi
              label="Active projects"
              value="38"
              secondaryText="Across 12 jurisdictions"
              tone="neutral"
            />
          </div>
        </div>
      </section>
  )
}

export function AvatarSpecimen() {
  return (
      <section id="avatar" className="section reveal">
        <SectionHead meta={sec('avatar')} />
        <div className="section__body">
          <div className="button-row">
            <Avatar size="xs" name="Camila Rojas" />
            <Avatar size="s" name="Diego Marín" />
            <Avatar size="m" name="Iberian Rewilding" />
            <Avatar size="l" shape="square" name="Mossy Earth" />
            <Avatar size="xl" src="https://i.pravatar.cc/96?img=12" name="Reviewer" />
          </div>
        </div>
      </section>
  )
}

export function ProgressSpecimen() {
  return (
      <section id="progress" className="section reveal">
        <SectionHead meta={sec('progress')} />
        <div className="section__body">
          <div className="specimen-stack specimen-stack--narrow">
            <ProgressBar label="Methodology validation" value={32} />
            <ProgressBar label="Sampling complete" value={64} tone="blue" />
            <ProgressBar label="Reviewer escalations" value={88} tone="orange" />
            <ProgressBar label="Archive sweep" value={100} tone="neutral" />
          </div>
        </div>
      </section>
  )
}

export function SkeletonSpecimen() {
  return (
      <section id="skeleton" className="section reveal">
        <SectionHead meta={sec('skeleton')} />
        <div className="section__body">
          <div className="specimen-stack specimen-stack--narrow">
            <div className="button-row" style={{ alignItems: 'center' }}>
              <Skeleton variant="circular" width={48} height={48} />
              <div style={{ flex: 1 }}>
                <Skeleton variant="text" lines={2} />
              </div>
            </div>
            <Skeleton variant="rectangular" height={120} />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      </section>
  )
}

export function SeparatorSpecimen() {
  return (
      <section id="separator" className="section reveal">
        <SectionHead meta={sec('separator')} />
        <div className="section__body">
          <div className="specimen-stack specimen-stack--narrow">
            <p className="text-body-s card__paragraph">Issuance summary</p>
            <Separator />
            <p className="text-body-s card__paragraph">Reviewer notes</p>
            <Separator label="then" />
            <div className="button-row" style={{ alignItems: 'center', height: 40 }}>
              <span className="text-body-s">Draft</span>
              <Separator orientation="vertical" />
              <span className="text-body-s">In review</span>
              <Separator orientation="vertical" />
              <span className="text-body-s">Issued</span>
            </div>
          </div>
        </div>
      </section>
  )
}
