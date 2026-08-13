// Data display — cards, the sortable table, disclosure, and scroll containers.
// One component per specimen section; App.tsx renders them in document order.

import { Accordion } from '../components/Accordion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Collapsible } from '../components/Collapsible'
import { Input } from '../components/Input'
import { Pill } from '../components/Pill'
import { ScrollArea } from '../components/ScrollArea'
import { DataTable } from '../components/Table'
import { ArrowRightIcon, MailIcon } from '../components/icons'
import { ISSUANCES, issuanceColumns } from './data'
import { SectionHead } from './section-head'
import { sec } from './section-meta'

export function CardsSpecimen() {
  return (
      <section id="cards" className="section reveal">
        <SectionHead meta={sec('cards')} />
        <div className="section__body">
          <div className="specimen-stack">
            <Card
              title="Carbon credits issued"
              subtitle="Quarterly summary"
              trailing={<Pill tone="positive">+ 12.4%</Pill>}
            >
              <div className="kv-list">
                <div className="kv-row">
                  <span className="kv-row__key">This quarter</span>
                  <span className="kv-row__value">182,540 t CO₂e</span>
                </div>
                <div className="kv-row">
                  <span className="kv-row__key">Last quarter</span>
                  <span className="kv-row__value">162,310 t CO₂e</span>
                </div>
                <div className="kv-row">
                  <span className="kv-row__key">YTD</span>
                  <span className="kv-row__value">694,820 t CO₂e</span>
                </div>
              </div>
            </Card>
            <Card title="Sign in" subtitle="Use your work account" floating>
              <div className="form-stack">
                <Input label="Email address" placeholder="you@example.com" iconLeft={<MailIcon />} />
                <Input label="Password" type="password" placeholder="••••••••" />
                <div className="form-actions">
                  <Button variant="text">Forgot password?</Button>
                  <Button variant="filled">Sign in</Button>
                </div>
              </div>
            </Card>
            <Card
              title="Project status"
              subtitle="Mossy Earth – Iberian rewilding"
              trailing={<Pill tone="warning">Pending review</Pill>}
            >
              <p className="text-body-s card__paragraph">
                Methodology validation in progress. Estimated decision in 8 days.
              </p>
              <div className="form-actions">
                <Button variant="outlined">View details</Button>
                <Button variant="filled" iconRight={<ArrowRightIcon />}>Open project</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
  )
}

export function TableSpecimen() {
  return (
      <section id="table" className="section reveal">
        <SectionHead meta={sec('table')} />
        <div className="section__body">
          <div className="specimen-table">
            <DataTable
              caption="Issuance ledger · last 30 days"
              columns={issuanceColumns}
              data={ISSUANCES}
              initialSorting={[{ id: 'updated', desc: true }]}
            />
          </div>
        </div>
      </section>
  )
}

export function AccordionSpecimen() {
  return (
      <section id="accordion" className="section reveal">
        <SectionHead meta={sec('accordion')} />
        <div className="section__body">
          <div className="specimen-stack--narrow">
            <Accordion
              defaultValue={['methodology']}
              items={[
                {
                  value: 'methodology',
                  title: 'What methodology applies?',
                  content:
                    'Soil carbon v3.2 governs sampling cadence, plot density, and the baseline model used for this issuance.',
                },
                {
                  value: 'sampling',
                  title: 'How is sampling verified?',
                  content:
                    'An OGCR analyst cross-checks field measurements against the regional baseline and flags variance above 15%.',
                },
                {
                  value: 'timeline',
                  title: 'What is the decision timeline?',
                  content:
                    'Most reviews resolve within 8 business days of a complete submission.',
                },
                {
                  value: 'disabled',
                  title: 'Unavailable section',
                  content: 'Not yet published.',
                  disabled: true,
                },
              ]}
            />
          </div>
        </div>
      </section>
  )
}

export function CollapsibleSpecimen() {
  return (
      <section id="collapsible" className="section reveal">
        <SectionHead meta={sec('collapsible')} />
        <div className="section__body">
          <div className="specimen-stack--narrow">
            <Collapsible trigger="Advanced sampling parameters" defaultOpen>
              <div className="kv-list">
                <div className="kv-row">
                  <span className="kv-row__key">Plot density</span>
                  <span className="kv-row__value">1 per 4 ha</span>
                </div>
                <div className="kv-row">
                  <span className="kv-row__key">Core depth</span>
                  <span className="kv-row__value">30 cm</span>
                </div>
                <div className="kv-row">
                  <span className="kv-row__key">Replicates</span>
                  <span className="kv-row__value">3 per plot</span>
                </div>
              </div>
            </Collapsible>
          </div>
        </div>
      </section>
  )
}

export function ScrollAreaSpecimen() {
  return (
      <section id="scroll-area" className="section reveal">
        <SectionHead meta={sec('scroll-area')} />
        <div className="section__body">
          <div className="specimen-stack specimen-stack--narrow">
            <ScrollArea
              maxHeight={200}
              className="border border-border-light rounded-12 bg-surface-light"
              viewportClassName="p-16"
            >
              <div className="kv-list">
                {ISSUANCES.concat(ISSUANCES).map((row, i) => (
                  <div key={`${row.project}-${i}`} className="kv-row">
                    <span className="kv-row__key">{row.project}</span>
                    <span className="kv-row__value">
                      {row.credits.toLocaleString('en-US')} t
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </section>
  )
}
