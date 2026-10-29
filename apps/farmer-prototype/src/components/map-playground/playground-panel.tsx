"use client";

import type { ReactNode } from "react";
import {
  Button,
  Pill,
  Radio,
  RadioGroup,
  Select,
  Separator,
  Switch,
  ToggleGroup,
  type SelectOption,
  type ToggleGroupItem,
} from "@majistudio/ogcr-design-system";
import type { BasemapId } from "@/config/geo";
import type { ParcelMapStatus } from "@/components/programs/data";
import {
  STATUS_LABEL,
  type DataPresetId,
  type ParcelStatus,
  type PlaygroundParcel,
} from "./playground-data";

export type LegendId = "off" | "carbon" | "enrolled" | "awaiting" | "dropped";
export type ViewportId = "fit" | "close" | "wide";

const PRESET_OPTIONS: SelectOption[] = [
  { value: "farm", label: "Lindenhof farm (4 parcels)" },
  { value: "program", label: "Program fields (3 parcels)" },
  { value: "all-statuses", label: "One of every status (6 parcels)" },
  { value: "many", label: "Many parcels (24)" },
  { value: "single", label: "A single parcel" },
  { value: "none", label: "No parcels" },
];

const BASEMAP_ITEMS: ToggleGroupItem[] = [
  { value: "minimal", label: "Minimal" },
  { value: "satellite", label: "Satellite" },
];

const PROGRAM_STATUS_ITEMS: ToggleGroupItem[] = (
  ["enrolled", "awaiting", "dropped"] as const
).map((status) => ({ value: status, label: STATUS_LABEL[status] }));

const LEGEND_OPTIONS: SelectOption[] = [
  { value: "carbon", label: "Carbon potential (farmer screen)" },
  { value: "enrolled", label: "Enrolled parcel (program)" },
  { value: "awaiting", label: "Included parcel (program)" },
  { value: "dropped", label: "Withdrawn parcel (program)" },
  { value: "off", label: "Hidden" },
];

/** A labelled control with a one-line hint underneath. */
function Control({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-body-s font-medium text-text-primary">{label}</span>
        <span className="text-body-s text-text-secondary">{hint}</span>
      </div>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-16">
      <h2 className="text-h4 text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export interface PlaygroundSettings {
  basemap: BasemapId;
  preset: DataPresetId;
  programStatus: ParcelMapStatus;
  selectedId: string | null;
  showLabels: boolean;
  showDots: boolean;
  showControls: boolean;
  legend: LegendId;
  viewport: ViewportId;
}

interface PlaygroundPanelProps {
  settings: PlaygroundSettings;
  onChange: (patch: Partial<PlaygroundSettings>) => void;
  parcels: PlaygroundParcel[];
  selected: { name: string; status: string; detail: string } | null;
  onReset: () => void;
}

export function PlaygroundPanel({
  settings,
  onChange,
  parcels,
  selected,
  onReset,
}: PlaygroundPanelProps) {
  const parcelOptions: SelectOption[] = [
    { value: "", label: "None" },
    ...parcels.map((parcel) => ({ value: parcel.id, label: parcel.name })),
  ];

  return (
    <div className="flex flex-col gap-24">
      <Section title="Basemap">
        <Control label="Style" hint="Switch between the aerial photo and the plain grey map.">
          <ToggleGroup
            aria-label="Basemap style"
            items={BASEMAP_ITEMS}
            value={[settings.basemap]}
            onValueChange={(next) => {
              const picked = next[0];
              if (picked === "minimal" || picked === "satellite") onChange({ basemap: picked });
            }}
            className="self-start"
          />
        </Control>
      </Section>

      <Separator />

      <Section title="Parcels">
        <Control
          label="Sample data"
          hint="Which parcels the map draws, from none to a crowded farm."
        >
          <Select
            aria-label="Sample data"
            options={PRESET_OPTIONS}
            value={settings.preset}
            onValueChange={(next) =>
              next && onChange({ preset: next as DataPresetId, selectedId: null })
            }
          />
        </Control>

        {settings.preset === "program" && (
          <Control
            label="Program parcel colour"
            hint="Program fields all share one colour that follows their status."
          >
            <ToggleGroup
              aria-label="Program parcel colour"
              items={PROGRAM_STATUS_ITEMS}
              value={[settings.programStatus]}
              onValueChange={(next) => {
                const picked = next[0];
                if (picked) onChange({ programStatus: picked as ParcelMapStatus });
              }}
              className="self-start"
            />
          </Control>
        )}

        <Switch
          label="Parcel name cards"
          secondaryText="Name and area on each active parcel. They appear once you zoom in close."
          checked={settings.showLabels}
          onCheckedChange={(next) => onChange({ showLabels: next })}
        />
        <Switch
          label="Locator dots"
          secondaryText="A coloured dot per parcel that stands in for it when zoomed far out."
          checked={settings.showDots}
          onCheckedChange={(next) => onChange({ showDots: next })}
        />
      </Section>

      <Separator />

      <Section title="Selection">
        <Control
          label="Selected parcel"
          hint="Click a parcel on the map, or pick one here. The selected parcel gets a thick outline."
        >
          <Select
            aria-label="Selected parcel"
            options={parcelOptions}
            value={settings.selectedId ?? ""}
            disabled={parcels.length === 0}
            onValueChange={(next) => onChange({ selectedId: next || null })}
          />
        </Control>
        {selected ? (
          <div className="flex flex-col gap-8 rounded-12 bg-surface-neutral p-12">
            <div className="flex items-center justify-between gap-8">
              <span className="text-body-s font-medium text-text-primary">{selected.name}</span>
              <Pill tone="neutral">{selected.status}</Pill>
            </div>
            {selected.detail && (
              <span className="text-body-s text-text-secondary">{selected.detail}</span>
            )}
          </div>
        ) : (
          <p className="text-body-s text-text-secondary">
            {parcels.length === 0 ? "There are no parcels to select." : "No parcel selected."}
          </p>
        )}
        <Button
          variant="outlined"
          size="m"
          disabled={!selected}
          onClick={() => onChange({ selectedId: null })}
          className="self-start"
        >
          Clear selection
        </Button>
      </Section>

      <Separator />

      <Section title="Map furniture">
        <Control label="Legend" hint="The colour key in the bottom-left corner, as each page shows it.">
          <Select
            aria-label="Legend"
            options={LEGEND_OPTIONS}
            value={settings.legend}
            onValueChange={(next) => next && onChange({ legend: next as LegendId })}
          />
        </Control>
        <Switch
          label="Map controls"
          secondaryText="The basemap switch and the zoom buttons on the map."
          checked={settings.showControls}
          onCheckedChange={(next) => onChange({ showControls: next })}
        />
      </Section>

      <Separator />

      <Section title="Camera">
        <Control label="Starting view" hint="Where the camera lands when you change this setting.">
          <RadioGroup
            aria-label="Starting view"
            value={settings.viewport}
            onValueChange={(next) => onChange({ viewport: next as ViewportId })}
          >
            <Radio value="fit" label="Fit to parcels" secondaryText="Frames every parcel at once." />
            <Radio value="close" label="Zoom in close" secondaryText="Reads field boundaries and name cards." />
            <Radio value="wide" label="Zoomed out" secondaryText="Shows the area; locator dots stand in for parcels." />
          </RadioGroup>
        </Control>
      </Section>

      <Button variant="text" size="m" onClick={onReset} className="self-start">
        Reset all settings
      </Button>
    </div>
  );
}

export type { ParcelStatus };
