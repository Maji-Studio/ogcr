// The design-system specimen page. This is the Vite demo app (src/main.tsx), NOT part of
// the published library — vite.lib.config.ts excludes it from the built package.
// Every section lives in ./demo/* so no single file carries the whole catalogue.

import { ToastProvider } from './components/Toast'
import { Logo } from './components/Logo'
import { SECTIONS } from './demo/section-meta'
import {
  TokensSpecimen,
  KpiSpecimen,
  ButtonsSpecimen,
  ProgressSpecimen,
  AvatarSpecimen,
  SeparatorSpecimen,
  SkeletonSpecimen,
} from './demo/foundations'
import {
  NavigationSpecimen,
  SidebarSpecimen,
  ContextMenuSpecimen,
  TabsSpecimen,
  BreadcrumbSpecimen,
  PaginationSpecimen,
  MenuSpecimen,
  ToolbarSpecimen,
} from './demo/navigation'
import {
  InputsSpecimen,
  CheckboxSpecimen,
  RadioSpecimen,
  FormSpecimen,
  SelectSpecimen,
  ComboboxSpecimen,
  NumberFieldSpecimen,
  SliderSpecimen,
  ToggleSpecimen,
  SwitchSpecimen,
  TextareaSpecimen,
  CalendarSpecimen,
  DatePickerSpecimen,
} from './demo/forms'
import {
  CardsSpecimen,
  TableSpecimen,
  AccordionSpecimen,
  CollapsibleSpecimen,
  ScrollAreaSpecimen,
} from './demo/data-display'
import {
  SidesheetSpecimen,
  MessagesSpecimen,
  PopoverSpecimen,
  DialogSpecimen,
  AlertDialogSpecimen,
  ToastSpecimen,
  TooltipSpecimen,
} from './demo/feedback'
import './App.css'

function App() {
  return (
    <ToastProvider>
    <main className="page">
      <header className="page__hero reveal">
        <div className="page__hero-top">
          <Logo width={129} className="page__hero-logo" />
          <div className="page__hero-actions">
            <span className="page__kicker">Design System · v0.1 · 2026</span>
            <a className="page__storybook-link" href="/storybook/">
              Storybook ↗
            </a>
          </div>
        </div>
        <h1 className="page__title">
          Design <span className="page__title-accent">system</span>
        </h1>
        <p className="page__subtitle">
          A working catalogue of every primitive and module shipped by the OGCR
          design system. Each entry reflects the live Figma source, with the
          tokens, dimensions, and node IDs needed to keep code and design in lock-step.
        </p>
        <dl className="page__meta">
          <div>
            <dt>Typeface</dt>
            <dd>Inter — Rasmus Andersson</dd>
          </div>
          <div>
            <dt>Mono</dt>
            <dd>JetBrains Mono</dd>
          </div>
          <div>
            <dt>Surface</dt>
            <dd>#f8f3ef · paper</dd>
          </div>
          <div>
            <dt>Accent</dt>
            <dd>#4f8263 · forest</dd>
          </div>
        </dl>
      </header>

      <div className="layout">
        <div className="specimens">
          <TokensSpecimen />

          <NavigationSpecimen />

          <SidebarSpecimen />

          <KpiSpecimen />

          <ButtonsSpecimen />

          <InputsSpecimen />

          <CardsSpecimen />

          <ContextMenuSpecimen />

          <SidesheetSpecimen />

          <MessagesSpecimen />

          <ProgressSpecimen />

          <CheckboxSpecimen />

          <RadioSpecimen />

          <FormSpecimen />

          <TableSpecimen />

          <AvatarSpecimen />

          <SelectSpecimen />

          <ComboboxSpecimen />

          <NumberFieldSpecimen />

          <SliderSpecimen />

          <ToggleSpecimen />

          <SwitchSpecimen />

          <TabsSpecimen />

          <AccordionSpecimen />

          <CollapsibleSpecimen />

          <BreadcrumbSpecimen />

          <PaginationSpecimen />

          <SeparatorSpecimen />

          <PopoverSpecimen />

          <DialogSpecimen />

          <AlertDialogSpecimen />

          <SkeletonSpecimen />

          <TextareaSpecimen />

          <ToastSpecimen />

          <TooltipSpecimen />

          <MenuSpecimen />

          <ToolbarSpecimen />

          <ScrollAreaSpecimen />

          <CalendarSpecimen />

          <DatePickerSpecimen />

          <footer className="colophon">
            <span>© OGCR · Operator platform</span>
            <span>Set in Inter</span>
            <span>Pulled from Figma 2P6XrQJhT8I39IR5LGK7RT</span>
          </footer>
        </div>

        <nav className="toc" aria-label="Sections">
          <p className="toc__heading">Sections</p>
          <ul className="toc__list">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a className="toc__link" href={`#${s.id}`}>
                  <span className="toc__num">§{s.num}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
    </ToastProvider>
  )
}

export default App
