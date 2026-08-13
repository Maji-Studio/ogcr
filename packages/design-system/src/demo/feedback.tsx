// Feedback & overlays — messages, toasts, sheets, popovers, dialogs, tooltips.
// One component per specimen section; App.tsx renders them in document order.

import { AlertDialog } from '../components/AlertDialog'
import { Button } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { Input } from '../components/Input'
import { Message } from '../components/Message'
import { Popover } from '../components/Popover'
import { Sidesheet } from '../components/Sidesheet'
import { useToast } from '../components/Toast'
import { Tooltip } from '../components/Tooltip'
import { BellIcon, InfoIcon } from '../components/icons'
import { SectionHead } from './section-head'
import { sec } from './section-meta'

function ToastDemo() {
  const toast = useToast()
  return (
    <div className="button-row">
      <Button
        variant="filled"
        onClick={() =>
          toast.add({
            type: 'success',
            title: 'Project verified',
            description: '42,180 t CO₂e is now eligible for issuance.',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          toast.add({
            type: 'warning',
            title: 'Sampling variance is high',
            description: 'Plot 7 deviates from the regional baseline by 18%.',
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          toast.add({
            type: 'error',
            title: 'Audit failed',
            description: 'Two findings require remediation before issuance.',
            actionProps: { children: 'Open findings', onClick: () => {} },
          })
        }
      >
        Error + action
      </Button>
      <Button
        variant="text"
        onClick={() =>
          toast.add({
            type: 'info',
            title: 'Methodology v3.2 published',
            description: 'Existing projects keep v3.1 until their next reissuance window.',
          })
        }
      >
        Info
      </Button>
    </div>
  )
}

export function MessagesSpecimen() {
  return (
      <section id="messages" className="section reveal">
        <SectionHead meta={sec('messages')} />
        <div className="section__body">
          <div className="specimen-stack">
            <Message
              state="neutral"
              title="Methodology v3.2 published"
              description="Existing projects retain v3.1 until their next reissuance window."
              actionLabel="Read changelog"
            />
            <Message
              state="success"
              title="Project verified"
              description="42,180 t CO₂e is now eligible for issuance."
              actionLabel="View certificate"
            />
            <Message
              state="warning"
              title="Sampling variance is high"
              description="Plot 7 deviates from the regional baseline by 18%."
              actionLabel="Inspect"
            />
            <Message
              state="error"
              title="Audit failed"
              description="Two findings require remediation before issuance can resume."
              actionLabel="Open findings"
            />
            <Message
              state="success"
              type="floating"
              title="Saved as draft"
              description="Your edits will be available when you return."
              onDismiss={() => {}}
            />
          </div>
        </div>
      </section>
  )
}

export function ToastSpecimen() {
  return (
      <section id="toast" className="section reveal">
        <SectionHead meta={sec('toast')} />
        <div className="section__body">
          <ToastDemo />
        </div>
      </section>
  )
}

export function SidesheetSpecimen() {
  return (
      <section id="sidesheet" className="section reveal">
        <SectionHead meta={sec('sidesheet')} />
        <div className="section__body">
          <Sidesheet
            trigger={<Button>Open sidesheet</Button>}
            navLabel="All projects"
            title="Iberian rewilding"
            status="In review"
            primaryAction={{ label: 'Confirm' }}
            secondaryAction={{ label: 'Cancel' }}
          >
            <Input label="Project ID" value="OGCR-IBER-001" readOnly />
            <Input label="Reviewer" value="Camila Rojas" readOnly />
            <p className="text-body-s card__paragraph">
              Methodology v3.2 with field sampling at 12 plots. Reviewer flagged two
              variance issues that need clarification before issuance.
            </p>
            <div className="kv-list">
              <div className="kv-row">
                <span className="kv-row__key">Estimated credits</span>
                <span className="kv-row__value">42,180 t CO₂e</span>
              </div>
              <div className="kv-row">
                <span className="kv-row__key">Decision due</span>
                <span className="kv-row__value">May 7, 2026</span>
              </div>
            </div>
          </Sidesheet>
        </div>
      </section>
  )
}

export function PopoverSpecimen() {
  return (
      <section id="popover" className="section reveal">
        <SectionHead meta={sec('popover')} />
        <div className="section__body">
          <div className="button-row">
            <Popover
              trigger={
                <Button variant="outlined" iconLeft={<InfoIcon />}>
                  What&apos;s this?
                </Button>
              }
              title="Methodology v3.2"
              description="Governs sampling cadence and the baseline model. Existing projects keep v3.1 until their next reissuance window."
            />
            <Popover
              showArrow
              trigger={<Button variant="text">With arrow</Button>}
              title="Heads up"
              description="This popover points back at its trigger."
            />
          </div>
        </div>
      </section>
  )
}

export function DialogSpecimen() {
  return (
      <section id="dialog" className="section reveal">
        <SectionHead meta={sec('dialog')} />
        <div className="section__body">
          <div className="button-row">
            <Dialog
              trigger={<Button variant="filled">Open dialog</Button>}
              title="Submit for review"
              description="The reviewer will be notified once you submit."
              primaryAction={{ label: 'Submit' }}
              secondaryAction={{ label: 'Cancel' }}
            >
              <p style={{ margin: 0 }}>
                Methodology v3.2 · 12 plots · 42,180 t CO₂e estimated. You can keep editing
                after submission until a reviewer is assigned.
              </p>
            </Dialog>
          </div>
        </div>
      </section>
  )
}

export function AlertDialogSpecimen() {
  return (
      <section id="alert-dialog" className="section reveal">
        <SectionHead meta={sec('alert-dialog')} />
        <div className="section__body">
          <div className="button-row">
            <AlertDialog
              trigger={<Button variant="outlined">Archive project</Button>}
              title="Archive this project?"
              description="It moves to the archive and stops accruing credits. You can restore it within 30 days."
              confirmLabel="Archive"
            />
            <AlertDialog
              tone="danger"
              trigger={<Button variant="outlined">Delete issuance</Button>}
              title="Delete this issuance?"
              description="This permanently removes the issuance record and its sampling data. This cannot be undone."
              confirmLabel="Delete"
            />
          </div>
        </div>
      </section>
  )
}

export function TooltipSpecimen() {
  return (
      <section id="tooltip" className="section reveal">
        <SectionHead meta={sec('tooltip')} />
        <div className="section__body">
          <div className="button-row">
            <Tooltip
              trigger={
                <Button variant="outlined" iconLeft={<InfoIcon />}>
                  Methodology
                </Button>
              }
            >
              v3.2 governs sampling cadence and the baseline model.
            </Tooltip>
            <Tooltip
              side="right"
              trigger={
                <button type="button" className="nav-bell" aria-label="Notifications">
                  <BellIcon />
                </button>
              }
            >
              3 reviews awaiting your sign-off
            </Tooltip>
            <Tooltip
              side="bottom"
              showArrow={false}
              trigger={<Button variant="text">No arrow</Button>}
            >
              A plain tooltip without the pointer.
            </Tooltip>
          </div>
        </div>
      </section>
  )
}
