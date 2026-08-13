// Form controls — text entry, the full form layout, selection, and date pickers.
// One component per specimen section; App.tsx renders them in document order.

import { useState } from 'react'
import { Button } from '../components/Button'
import { Calendar } from '../components/Calendar'
import { Checkbox } from '../components/Checkbox'
import type { CheckboxValue } from '../components/Checkbox'
import { Combobox } from '../components/Combobox'
import { DatePicker } from '../components/DatePicker'
import { Form, FormFieldset, FormFooter, FormRow, FormSection } from '../components/Form'
import { Input } from '../components/Input'
import { NumberField } from '../components/NumberField'
import { Radio, RadioGroup } from '../components/Radio'
import { Select } from '../components/Select'
import { Slider } from '../components/Slider'
import { Switch } from '../components/Switch'
import { Textarea } from '../components/Textarea'
import { Toggle, ToggleGroup } from '../components/Toggle'
import {
  ArrowRightIcon,
  ChartBarIcon,
  FlaskIcon,
  FolderIcon,
  MailIcon,
  SearchIcon,
  SquaresFourIcon,
} from '../components/icons'
import { SectionHead } from './section-head'
import { sec } from './section-meta'

export function InputsSpecimen() {
  const [email, setEmail] = useState('')
  const [search, setSearch] = useState('Iberian rewilding')
  const [bad, setBad] = useState('not-an-email')

  return (
      <section id="inputs" className="section reveal">
        <SectionHead meta={sec('inputs')} />
        <div className="section__body">
          <div className="specimen-stack specimen-stack--narrow">
            <Input
              label="Email address"
              placeholder="you@example.com"
              iconLeft={<MailIcon />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="We'll never share your email."
            />
            <Input
              label="Search"
              placeholder="Search projects"
              iconLeft={<SearchIcon />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Input
              label="Email address"
              value={bad}
              onChange={(e) => setBad(e.target.value)}
              error
              helperText="Enter a valid email address."
            />
          </div>
        </div>
      </section>
  )
}

export function FormSpecimen() {
  const [formProjectName, setFormProjectName] = useState('Iberian rewilding pilot')
  const [formProjectCode, setFormProjectCode] = useState('iber-001')
  const [formMethodology, setFormMethodology] = useState('Methodology v3.2')
  const [formPlots, setFormPlots] = useState('12')
  const [formSampleDate, setFormSampleDate] = useState('2026-04-22')
  const [formVerification, setFormVerification] = useState('full')
  const [formTerms, setFormTerms] = useState<CheckboxValue>(false)
  const projectCodeError = !/^OGCR-/.test(formProjectCode)

  return (
      <section id="form" className="section reveal">
        <SectionHead meta={sec('form')} />
        <div className="section__body">
          <div className="specimen-form">
            <Form noValidate onSubmit={(e) => e.preventDefault()}>
              <FormSection
                step="I"
                title="Project"
                description="Identify the project being submitted for verification."
              >
                <FormRow>
                  <Input
                    label="Project name"
                    value={formProjectName}
                    onChange={(e) => setFormProjectName(e.target.value)}
                    placeholder="e.g. Iberian rewilding pilot"
                  />
                  <Input
                    label="Project code"
                    value={formProjectCode}
                    onChange={(e) => setFormProjectCode(e.target.value)}
                    error={projectCodeError}
                    helperText={
                      projectCodeError
                        ? 'Code must begin with OGCR-'
                        : 'Issued by the registry on intake.'
                    }
                  />
                </FormRow>
                <Input
                  label="Methodology"
                  value={formMethodology}
                  onChange={(e) => setFormMethodology(e.target.value)}
                  iconLeft={<FlaskIcon />}
                  helperText="Versioned methodology used for this issuance."
                />
              </FormSection>

              <FormSection
                step="II"
                title="Sampling"
                description="Field measurements that back the issuance request."
              >
                <FormRow>
                  <Input
                    label="Plot count"
                    type="number"
                    value={formPlots}
                    onChange={(e) => setFormPlots(e.target.value)}
                  />
                  <Input
                    label="Sampling date"
                    type="date"
                    value={formSampleDate}
                    onChange={(e) => setFormSampleDate(e.target.value)}
                  />
                </FormRow>
              </FormSection>

              <FormSection
                step="III"
                title="Verification"
                description="Reviewer level required for this submission."
              >
                <FormFieldset legend="Verification level" required inline>
                  <RadioGroup
                    aria-label="Verification level"
                    className="flex flex-row gap-12"
                    name="form-verify"
                    value={formVerification}
                    onValueChange={(v) => setFormVerification(v as 'basic' | 'full')}
                  >
                    <Radio
                      layout="border-left"
                      value="basic"
                      label="Basic verification"
                      secondaryText="Document review only"
                    />
                    <Radio
                      layout="border-left"
                      value="full"
                      label="Full audit"
                      secondaryText="Field visit and sampling"
                    />
                  </RadioGroup>
                </FormFieldset>
              </FormSection>

              <FormSection
                step="IV"
                title="Confirm"
                description="Acknowledge before submitting for review."
              >
                <Checkbox
                  label="I confirm that the data above is accurate and complete."
                  checked={formTerms}
                  onChange={(v) => setFormTerms(v)}
                />
              </FormSection>

              <FormFooter note="Required fields are marked *">
                <Button variant="filled" type="submit" iconRight={<ArrowRightIcon />}>
                  Submit for review
                </Button>
                <Button variant="outlined" type="button">Save draft</Button>
                <Button variant="text" type="button">Cancel</Button>
              </FormFooter>
            </Form>
          </div>
        </div>
      </section>
  )
}

export function TextareaSpecimen() {
  return (
      <section id="textarea" className="section reveal">
        <SectionHead meta={sec('textarea')} />
        <div className="section__body">
          <div className="specimen-stack specimen-stack--narrow">
            <Textarea
              label="Reviewer notes"
              placeholder="Summarise the variance findings…"
              defaultValue="Plot 7 deviates from the regional baseline by 18%. Recommend a second core sample before issuance."
              helperText="Shared with the project owner once submitted."
            />
            <Textarea
              label="Remediation summary"
              placeholder="Describe the corrective action…"
              rows={3}
              errorText="A remediation summary is required before review can resume."
            />
            <Textarea
              label="Locked note"
              defaultValue="Archived — read only."
              resize="none"
              disabled
            />
          </div>
        </div>
      </section>
  )
}

export function CheckboxSpecimen() {
  const [terms, setTerms] = useState<CheckboxValue>(false)
  const [marketing, setMarketing] = useState<CheckboxValue>('indeterminate')
  const [card1, setCard1] = useState<CheckboxValue>(true)

  return (
      <section id="checkbox" className="section reveal">
        <SectionHead meta={sec('checkbox')} />
        <div className="section__body">
          <div className="specimen-stack">
            <Checkbox
              label="I agree to the terms of service"
              checked={terms}
              onChange={(v) => setTerms(v)}
            />
            <Checkbox
              label="Receive marketing emails"
              checked={marketing}
              onChange={(v) => setMarketing(v)}
            />
            <Checkbox label="Disabled option" checked disabled />
            <Checkbox label="Required field" error />
            <Checkbox
              layout="border-left"
              label="Verified registry"
              secondaryText="Manual review by an OGCR analyst"
              checked={card1}
              onChange={(v) => setCard1(v)}
            />
            <Checkbox
              layout="border-left"
              label="Self-attested"
              secondaryText="Project owner provides documentation only"
              checked={card1 === true ? false : true}
              onChange={(v) => setCard1(v)}
            />
          </div>
        </div>
      </section>
  )
}

export function RadioSpecimen() {
  const [plan, setPlan] = useState('annual')
  const [verificationPlan, setVerificationPlan] = useState('basic')

  return (
      <section id="radio" className="section reveal">
        <SectionHead meta={sec('radio')} />
        <div className="section__body">
          <div className="specimen-stack">
            <RadioGroup
              aria-label="Plan"
              value={plan}
              onValueChange={(v) => setPlan(v as 'monthly' | 'annual')}
            >
              <Radio value="monthly" label="Monthly" />
              <Radio value="annual" label="Annual" />
              <Radio value="custom" label="Custom" disabled />
            </RadioGroup>
            <RadioGroup
              aria-label="Verification"
              value={verificationPlan}
              onValueChange={(v) => setVerificationPlan(v as 'basic' | 'full')}
            >
              <Radio
                layout="border-left"
                value="basic"
                label="Basic verification"
                secondaryText="Document review only"
              />
              <Radio
                layout="border-left"
                value="full"
                label="Full audit"
                secondaryText="Field visit + sampling"
              />
            </RadioGroup>
          </div>
        </div>
      </section>
  )
}

export function SelectSpecimen() {
  const [registry, setRegistry] = useState<string | null>('verra')

  return (
      <section id="select" className="section reveal">
        <SectionHead meta={sec('select')} />
        <div className="section__body">
          <div className="specimen-stack specimen-stack--narrow">
            <Select
              aria-label="Registry"
              value={registry}
              onValueChange={setRegistry}
              options={[
                { value: 'verra', label: 'Verra (VCS)' },
                { value: 'gold', label: 'Gold Standard' },
                { value: 'puro', label: 'Puro.earth' },
                { value: 'isometric', label: 'Isometric' },
                { value: 'legacy', label: 'Legacy registry', disabled: true },
              ]}
            />
            <Select
              aria-label="Methodology"
              placeholder="Select methodology"
              options={[
                { value: 'soil', label: 'Soil carbon v3.2' },
                { value: 'forest', label: 'Afforestation v2.8' },
                { value: 'blue', label: 'Blue carbon v3.1' },
              ]}
            />
            <Select
              aria-label="Required registry"
              error
              placeholder="Selection required"
              options={[{ value: 'a', label: 'Option A' }]}
            />
            <Select
              aria-label="Disabled registry"
              disabled
              placeholder="Unavailable"
              options={[{ value: 'a', label: 'Option A' }]}
            />
          </div>
        </div>
      </section>
  )
}

export function ComboboxSpecimen() {
  const [methodology, setMethodology] = useState('Soil carbon v3.2')

  return (
      <section id="combobox" className="section reveal">
        <SectionHead meta={sec('combobox')} />
        <div className="section__body">
          <div className="specimen-stack specimen-stack--narrow">
            <Combobox
              value={methodology}
              onValueChange={setMethodology}
              placeholder="Search methodologies…"
              items={[
                'Soil carbon v3.2',
                'Afforestation v2.8',
                'Blue carbon v3.1',
                'Biochar v1.4',
                'Enhanced weathering v2.0',
                'Peatland restoration v3.0',
              ]}
            />
          </div>
        </div>
      </section>
  )
}

export function NumberFieldSpecimen() {
  const [plotCount, setPlotCount] = useState<number | null>(12)

  return (
      <section id="number-field" className="section reveal">
        <SectionHead meta={sec('number-field')} />
        <div className="section__body">
          <div className="specimen-stack specimen-stack--narrow">
            <NumberField
              label="Plot count"
              value={plotCount}
              onValueChange={setPlotCount}
              min={0}
              max={99}
            />
            <NumberField
              label="Sampling radius (m)"
              defaultValue={25}
              step={5}
              min={0}
              helperText="Snaps to 5-metre increments."
            />
            <NumberField
              label="Estimated credits"
              defaultValue={42180}
              helperText="Tonnes CO₂e."
            />
            <NumberField label="Locked" defaultValue={12} disabled />
          </div>
        </div>
      </section>
  )
}

export function SliderSpecimen() {
  const [variance, setVariance] = useState(18)

  return (
      <section id="slider" className="section reveal">
        <SectionHead meta={sec('slider')} />
        <div className="section__body">
          <div className="specimen-stack specimen-stack--narrow">
            <Slider
              label="Sampling variance"
              value={variance}
              onValueChange={setVariance}
              showValue
              max={100}
            />
            <Slider label="Confidence threshold" defaultValue={80} showValue />
            <Slider label="Out of tolerance" defaultValue={64} showValue error />
            <Slider label="Locked" defaultValue={40} disabled />
          </div>
        </div>
      </section>
  )
}

export function ToggleSpecimen() {
  const [boldOn, setBoldOn] = useState(false)

  return (
      <section id="toggle" className="section reveal">
        <SectionHead meta={sec('toggle')} />
        <div className="section__body">
          <div className="specimen-stack" style={{ gap: 16 }}>
            <div className="button-row">
              <Toggle aria-label="Bold" pressed={boldOn} onPressedChange={setBoldOn}>
                Bold
              </Toggle>
              <Toggle aria-label="Grid view">
                <SquaresFourIcon />
              </Toggle>
              <Toggle aria-label="Disabled" disabled>
                Disabled
              </Toggle>
            </div>
            <ToggleGroup
              aria-label="View"
              defaultValue={['grid']}
              items={[
                { value: 'grid', label: 'Grid', icon: <SquaresFourIcon /> },
                { value: 'chart', label: 'Chart', icon: <ChartBarIcon /> },
                { value: 'files', label: 'Files', icon: <FolderIcon /> },
              ]}
            />
          </div>
        </div>
      </section>
  )
}

export function SwitchSpecimen() {
  const [notify, setNotify] = useState(true)

  return (
      <section id="switch" className="section reveal">
        <SectionHead meta={sec('switch')} />
        <div className="section__body">
          <div className="specimen-stack">
            <Switch
              label="Email notifications"
              secondaryText="Sent when a review status changes"
              checked={notify}
              onCheckedChange={setNotify}
            />
            <Switch label="Auto-publish methodology updates" />
            <Switch label="Locked on" checked disabled />
            <Switch
              label="Requires attention"
              secondaryText="Toggle to acknowledge"
              error
            />
          </div>
        </div>
      </section>
  )
}

export function CalendarSpecimen() {
  const [calDate, setCalDate] = useState<Date | undefined>(new Date(2026, 3, 22))

  return (
      <section id="calendar" className="section reveal">
        <SectionHead meta={sec('calendar')} />
        <div className="section__body">
          <div className="button-row" style={{ alignItems: 'flex-start' }}>
            <Calendar
              mode="single"
              selected={calDate}
              onSelect={setCalDate}
              defaultMonth={new Date(2026, 3, 1)}
              className="border border-border-light rounded-16 shadow-elevation-l"
            />
          </div>
        </div>
      </section>
  )
}

export function DatePickerSpecimen() {
  const [sampleDate, setSampleDate] = useState<Date | undefined>(new Date(2026, 3, 22))

  return (
      <section id="date-picker" className="section reveal">
        <SectionHead meta={sec('date-picker')} />
        <div className="section__body">
          <div className="specimen-stack specimen-stack--narrow">
            <DatePicker
              value={sampleDate}
              onChange={setSampleDate}
              clearable
              formatOptions={{ year: 'numeric', month: 'long', day: 'numeric' }}
            />
            <DatePicker placeholder="Sampling date" />
            <DatePicker error placeholder="Date required" />
            <DatePicker defaultValue={new Date(2026, 3, 22)} disabled />
          </div>
        </div>
      </section>
  )
}
