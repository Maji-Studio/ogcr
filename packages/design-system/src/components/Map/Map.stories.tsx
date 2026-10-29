import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Feature, FeatureCollection, Point, Polygon } from 'geojson'
import 'maplibre-gl/dist/maplibre-gl.css'
import './map.css'
import {
  INACTIVE_STATUSES,
  LABEL_MIN_ZOOM,
  MapView,
  PARCEL_FILL_OPACITY,
  PARCEL_LINE_WIDTH,
  PARCEL_STATUS_TOKENS,
  type ParcelStatus,
} from '.'
import { MapLegend, type MapLegendItem } from '../MapLegend'

// ---- Sample parcels ---------------------------------------------------------------------------
// Rectangular fields on a grid around a farm near Plattling (Bavaria), so every status can be seen
// side by side. Real screens pass surveyed polygons.

const FARM: [number, number] = [12.858, 48.792]
/** Metres per degree at 48.79° N. */
const M_PER_DEG_LAT = 111_320
const M_PER_DEG_LNG = 73_400
const M2_PER_HA = 10_000
const FIELD_WIDTH_M = 150
const FIELD_DEPTH_M = 110
const FIELD_GAP_M = 14

const STATUS_LABEL: Record<ParcelStatus, string> = {
  enrolled: 'Enrolled',
  awaiting: 'Included',
  dropped: 'Withdrawn',
  high: 'High potential',
  medium: 'Medium potential',
  ineligible: 'Not eligible',
}
const CAMPAIGN: ParcelStatus[] = ['enrolled', 'awaiting', 'dropped']
const POTENTIAL: ParcelStatus[] = ['high', 'medium', 'ineligible']

type ParcelProps = {
  parcelId: string
  name: string
  status: string
  detail: string
  selected: boolean
}

function fields(
  statuses: ParcelStatus[],
  columns: number,
  origin: [number, number] = FARM,
): Feature<Polygon, ParcelProps>[] {
  const rows = Math.ceil(statuses.length / columns)
  return statuses.map((status, index) => {
    const col = index % columns
    const row = Math.floor(index / columns)
    // Some fields are a little narrower so the shapes and areas are not all identical.
    const widthM = FIELD_WIDTH_M - ((col * 7 + row * 13) % 5) * 12
    const west = (col - (columns - 1) / 2) * (FIELD_WIDTH_M + FIELD_GAP_M) - widthM / 2
    const north = ((rows - 1) / 2 - row) * (FIELD_DEPTH_M + FIELD_GAP_M) + FIELD_DEPTH_M / 2
    const at = (x: number, y: number): [number, number] => [
      origin[0] + x / M_PER_DEG_LNG,
      origin[1] + y / M_PER_DEG_LAT,
    ]
    const label = String(index + 1).padStart(2, '0')
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            at(west, north),
            at(west + widthM, north),
            at(west + widthM, north - FIELD_DEPTH_M),
            at(west, north - FIELD_DEPTH_M),
            at(west, north),
          ],
        ],
      },
      properties: {
        parcelId: `field-${label}`,
        name: `Field ${label}`,
        status,
        detail: `${((widthM * FIELD_DEPTH_M) / M2_PER_HA).toFixed(1)} ha`,
        selected: false,
      },
    }
  })
}

function collection(features: Feature[], selectedId: string | null = null): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        selected: feature.properties?.parcelId === selectedId,
      },
    })),
  }
}

const POTENTIAL_FIELDS = fields(['high', 'medium', 'high', 'ineligible', 'medium', 'high'], 3)
const CAMPAIGN_FIELDS = fields(
  ['enrolled', 'enrolled', 'awaiting', 'dropped', 'enrolled', 'awaiting'],
  3,
)

/** Farms across a ~30 km supply shed: a locator dot plus two fields each. */
const SHED_FARMS: { offsetKm: [number, number]; status: ParcelStatus }[] = [
  { offsetKm: [0, 0], status: 'enrolled' },
  { offsetKm: [-9, 6], status: 'enrolled' },
  { offsetKm: [7, 8], status: 'awaiting' },
  { offsetKm: [12, -4], status: 'enrolled' },
  { offsetKm: [-6, -9], status: 'awaiting' },
  { offsetKm: [3, -12], status: 'dropped' },
  { offsetKm: [-14, -2], status: 'enrolled' },
]
const SHED_FEATURES: Feature[] = SHED_FARMS.flatMap(({ offsetKm, status }) => {
  const centre: [number, number] = [
    FARM[0] + (offsetKm[0] * 1000) / M_PER_DEG_LNG,
    FARM[1] + (offsetKm[1] * 1000) / M_PER_DEG_LAT,
  ]
  const dot: Feature<Point> = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: centre },
    properties: { status },
  }
  return [dot, ...fields([status, status], 2, centre)]
})

const legendItems = (statuses: ParcelStatus[]): MapLegendItem[] =>
  statuses.map((status) => ({ label: STATUS_LABEL[status], token: PARCEL_STATUS_TOKENS[status] }))

// ---- Stories ----------------------------------------------------------------------------------

const meta = {
  title: 'Components/Map',
  component: MapView,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The OGCR map: two key-free basemaps (Satellite by default, Minimal), parcels coloured by status from design-system tokens, name cards at close zoom, and DS controls. Deep import `@majistudio/ogcr-design-system/Map`; needs the `maplibre-gl` peer and its stylesheet, then `@majistudio/ogcr-design-system/map.css`. See **Styling reference** for every parcel state.',
      },
    },
  },
  args: { className: 'h-[560px] w-full', fitToFeatures: true },
  argTypes: {
    initialBasemap: { control: 'inline-radio', options: ['satellite', 'minimal'] },
    showControls: { control: 'boolean' },
    showLabels: { control: 'boolean' },
  },
} satisfies Meta<typeof MapView>

export default meta
type Story = StoryObj<typeof meta>

/** A farmer's own fields before a campaign, coloured by carbon potential. */
export const CarbonPotential: Story = {
  args: { features: collection(POTENTIAL_FIELDS) },
  render: (args) => (
    <div className="relative">
      <MapView {...args} />
      <MapLegend title="Carbon potential" items={legendItems(POTENTIAL)} />
    </div>
  ),
}

/** Campaign fields with one selected: enrolled and included parcels solid, withdrawn ones dashed. */
export const CampaignStatuses: Story = {
  args: { features: collection(CAMPAIGN_FIELDS, 'field-01') },
  render: (args) => (
    <div className="relative">
      <MapView {...args} />
      <MapLegend title="Your fields" items={legendItems(CAMPAIGN)} />
    </div>
  ),
}

/** The same campaign on the Minimal basemap: outlines switch from white to dark navy. */
export const MinimalBasemap: Story = {
  ...CampaignStatuses,
  args: { ...CampaignStatuses.args, initialBasemap: 'minimal' },
}

/** Click a field to select it; click bare map to clear. */
export const SelectableParcels: Story = {
  args: { features: collection(CAMPAIGN_FIELDS) },
  render: function Render(args) {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    return (
      <div className="relative">
        <MapView
          {...args}
          features={collection(CAMPAIGN_FIELDS, selectedId)}
          onSelectFeature={(properties) => setSelectedId(properties?.parcelId ?? null)}
        />
        <MapLegend title="Your fields" items={legendItems(CAMPAIGN)} />
      </div>
    )
  },
}

/** Supply-shed zoom: farms are locator dots until you zoom in and the fields become legible. */
export const SupplyShed: Story = {
  args: { features: collection(SHED_FEATURES), fitMaxZoom: 11 },
  render: (args) => (
    <div className="relative">
      <MapView {...args} />
      <MapLegend title="Farms" items={legendItems(CAMPAIGN)} />
    </div>
  ),
}

/** Every visual rule the map applies to a parcel, read from the same constants the map paints with. */
export const StylingReference: Story = {
  parameters: { controls: { disable: true } },
  render: () => <StylingReferenceSheet />,
}

// ---- Styling reference ------------------------------------------------------------------------

const SWATCH_SIZE = 48
const SWATCH_INSET = 6
const DASH_PX = 4

function ParcelSwatch({
  token,
  state,
}: {
  token: string
  state: keyof typeof PARCEL_FILL_OPACITY
}) {
  const width = PARCEL_LINE_WIDTH[state]
  return (
    <svg
      width={SWATCH_SIZE}
      height={SWATCH_SIZE}
      aria-hidden="true"
      className="shrink-0 rounded-4 bg-surface-neutral"
    >
      <rect
        x={SWATCH_INSET}
        y={SWATCH_INSET}
        width={SWATCH_SIZE - 2 * SWATCH_INSET}
        height={SWATCH_SIZE - 2 * SWATCH_INSET}
        fill={`var(${token})`}
        fillOpacity={PARCEL_FILL_OPACITY[state]}
        stroke="var(--ds-text-primary)"
        strokeWidth={width}
        strokeDasharray={state === 'inactive' ? `${DASH_PX} ${DASH_PX}` : undefined}
      />
    </svg>
  )
}

const percent = (value: number) => `${Math.round(value * 100)}%`

function StylingReferenceSheet() {
  const groups: { title: string; statuses: ParcelStatus[] }[] = [
    { title: 'Campaign', statuses: CAMPAIGN },
    { title: 'Carbon potential', statuses: POTENTIAL },
  ]
  const states: { state: keyof typeof PARCEL_FILL_OPACITY; label: string; rule: string }[] = [
    {
      state: 'active',
      label: 'Active',
      rule: `Fill ${percent(PARCEL_FILL_OPACITY.active)}, solid ${PARCEL_LINE_WIDTH.active}px outline, name card`,
    },
    {
      state: 'selected',
      label: 'Selected',
      rule: `Fill ${percent(PARCEL_FILL_OPACITY.selected)}, solid ${PARCEL_LINE_WIDTH.selected}px outline, its card is never hidden`,
    },
    {
      state: 'inactive',
      label: 'Inactive',
      rule: `Fill ${percent(PARCEL_FILL_OPACITY.inactive)}, dashed ${PARCEL_LINE_WIDTH.inactive}px outline, no name card`,
    },
  ]

  return (
    <div className="flex max-w-[720px] flex-col gap-32 text-text-primary">
      <section className="flex flex-col gap-12">
        <h3 className="text-h4">Status colours</h3>
        <p className="text-body-s text-text-secondary">
          Colour carries status. {INACTIVE_STATUSES.map((s) => STATUS_LABEL[s]).join(' and ')}{' '}
          parcels are drawn as inactive.
        </p>
        <div className="grid grid-cols-1 gap-24 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-8">
              <p className="text-label-input text-text-secondary">{group.title}</p>
              <ul className="flex flex-col gap-8">
                {group.statuses.map((status) => (
                  <li key={status} className="flex items-center gap-12">
                    <ParcelSwatch
                      token={PARCEL_STATUS_TOKENS[status]}
                      state={INACTIVE_STATUSES.includes(status) ? 'inactive' : 'active'}
                    />
                    <span className="flex flex-col">
                      <span className="text-body-s font-medium">{STATUS_LABEL[status]}</span>
                      <code className="text-xxs text-text-secondary">
                        {PARCEL_STATUS_TOKENS[status]}
                      </code>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h3 className="text-h4">Parcel states</h3>
        <ul className="flex flex-col gap-8">
          {states.map(({ state, label, rule }) => (
            <li key={state} className="flex items-center gap-12">
              <ParcelSwatch token={PARCEL_STATUS_TOKENS.enrolled} state={state} />
              <span className="flex flex-col">
                <span className="text-body-s font-medium">{label}</span>
                <span className="text-body-s text-text-secondary">{rule}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-12">
        <h3 className="text-h4">Basemaps and labels</h3>
        <ul className="flex list-disc flex-col gap-6 pl-24 text-body-s">
          <li>Satellite is the default basemap; outlines are white over the imagery.</li>
          <li>On Minimal, outlines switch to dark navy (text primary).</li>
          <li>
            Name cards show the field name and area from zoom {LABEL_MIN_ZOOM}. Overlapping cards
            are hidden, the selected field&apos;s card first in line.
          </li>
          <li>
            At supply-shed zoom each farm is a dot in its status colour, fading out as its fields
            become legible.
          </li>
        </ul>
      </section>
    </div>
  )
}
