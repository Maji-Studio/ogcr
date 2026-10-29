/**
 * Sample parcels for the map playground. Real data is reused where it exists (the Lindenhof farm and
 * the Soil & Sugar program fields); the rest are generated so every parcel status and a crowded map
 * can be looked at without waiting for a real campaign.
 */

import type { Feature, FeatureCollection, Point, Polygon } from "geojson";
import { farm } from "@/components/farmer/data/farm";
import { lindenhofParcelFeatures } from "@/components/farmer/data/geometry";
import { PROGRAMS, parcelFeatures, type ParcelMapStatus } from "@/components/programs/data";

export type DataPresetId = "farm" | "program" | "all-statuses" | "many" | "single" | "none";

export type ParcelStatus = "enrolled" | "awaiting" | "dropped" | "high" | "medium" | "ineligible";

/** Plain-language names for the map's status colours. */
export const STATUS_LABEL: Record<ParcelStatus, string> = {
  enrolled: "Enrolled",
  awaiting: "Included",
  dropped: "Withdrawn",
  high: "High potential",
  medium: "Medium potential",
  ineligible: "Not eligible",
};

const ALL_STATUSES = Object.keys(STATUS_LABEL) as ParcelStatus[];

/** Metres per degree at Plattling (48.79° N), matching the farmer geometry. */
const M_PER_DEG_LAT = 111_320;
const M_PER_DEG_LNG = 73_400;
const M2_PER_HA = 10_000;

/** Generated parcels are plain rectangles on a grid around the farm. */
const CELL_WIDTH_M = 150;
const CELL_DEPTH_M = 110;
const CELL_GAP_M = 14;
const MANY_COLUMNS = 6;
const MANY_ROWS = 4;
const STATUS_COLUMNS = 3;
/** The single-parcel preset reuses the first Lindenhof field, so it matches the real screen. */
const SINGLE_PARCEL_INDEX = 0;

export interface PlaygroundParcel {
  id: string;
  name: string;
}

type ParcelProps = {
  parcelId: string;
  name: string;
  status: string;
  detail: string;
  selected: boolean;
};

function rectangle(
  col: number,
  row: number,
  columns: number,
  rows: number,
): { ring: [number, number][]; areaHa: number } {
  const stepX = CELL_WIDTH_M + CELL_GAP_M;
  const stepY = CELL_DEPTH_M + CELL_GAP_M;
  // Some cells are a little narrower so areas, and shapes, are not all identical.
  const widthM = CELL_WIDTH_M - ((col * 7 + row * 13) % 5) * 12;
  const west = (col - (columns - 1) / 2) * stepX - widthM / 2;
  const north = ((rows - 1) / 2 - row) * stepY + CELL_DEPTH_M / 2;
  const toLngLat = (x: number, y: number): [number, number] => [
    farm.center[0] + x / M_PER_DEG_LNG,
    farm.center[1] + y / M_PER_DEG_LAT,
  ];
  const ring: [number, number][] = [
    toLngLat(west, north),
    toLngLat(west + widthM, north),
    toLngLat(west + widthM, north - CELL_DEPTH_M),
    toLngLat(west, north - CELL_DEPTH_M),
    toLngLat(west, north),
  ];
  return { ring, areaHa: (widthM * CELL_DEPTH_M) / M2_PER_HA };
}

function generated(
  count: number,
  columns: number,
  statusFor: (index: number) => ParcelStatus,
): Feature<Polygon, ParcelProps>[] {
  const rows = Math.ceil(count / columns);
  return Array.from({ length: count }, (_, index) => {
    const { ring, areaHa } = rectangle(index % columns, Math.floor(index / columns), columns, rows);
    const label = String(index + 1).padStart(2, "0");
    return {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [ring] },
      properties: {
        parcelId: `field-${label}`,
        name: `Field ${label}`,
        status: statusFor(index),
        detail: `${areaHa.toFixed(1)} ha`,
        selected: false,
      },
    };
  });
}

/** Polygons for one preset, with stable ids and nothing selected. */
function baseParcels(
  preset: DataPresetId,
  programStatus: ParcelMapStatus,
): Feature<Polygon, ParcelProps>[] {
  switch (preset) {
    case "farm":
      return lindenhofParcelFeatures(farm.center, null).features;
    case "single":
      return lindenhofParcelFeatures(farm.center, null).features.slice(
        SINGLE_PARCEL_INDEX,
        SINGLE_PARCEL_INDEX + 1,
      );
    case "program": {
      const collection = parcelFeatures(PROGRAMS[0], programStatus);
      return collection.features.map((feature, index) => ({
        type: "Feature",
        geometry: feature.geometry as Polygon,
        properties: {
          parcelId: `program-${index + 1}`,
          name: String(feature.properties?.name ?? `Field ${index + 1}`),
          status: String(feature.properties?.status ?? programStatus),
          detail: String(feature.properties?.detail ?? ""),
          selected: false,
        },
      }));
    }
    case "all-statuses":
      return generated(ALL_STATUSES.length, STATUS_COLUMNS, (index) => ALL_STATUSES[index]);
    case "many":
      return generated(
        MANY_COLUMNS * MANY_ROWS,
        MANY_COLUMNS,
        (index) => ALL_STATUSES[(index * 5 + Math.floor(index / 3)) % ALL_STATUSES.length],
      );
    case "none":
      return [];
  }
}

export function presetParcels(
  preset: DataPresetId,
  programStatus: ParcelMapStatus,
): PlaygroundParcel[] {
  return baseParcels(preset, programStatus).map(({ properties }) => ({
    id: properties.parcelId,
    name: properties.name,
  }));
}

function ringCentre(ring: number[][]): [number, number] {
  const points = ring.slice(0, -1);
  const lng = points.reduce((sum, point) => sum + point[0], 0) / points.length;
  const lat = points.reduce((sum, point) => sum + point[1], 0) / points.length;
  return [lng, lat];
}

/** The collection the map draws: selection flag set, plus optional locator dots. */
export function playgroundFeatures(
  preset: DataPresetId,
  programStatus: ParcelMapStatus,
  selectedId: string | null,
  withDots: boolean,
): FeatureCollection {
  const parcels = baseParcels(preset, programStatus).map((feature) => ({
    ...feature,
    properties: { ...feature.properties, selected: feature.properties.parcelId === selectedId },
  }));
  const dots: Feature<Point>[] = withDots
    ? parcels.map((feature) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: ringCentre(feature.geometry.coordinates[0]) },
        properties: { status: feature.properties.status },
      }))
    : [];
  return { type: "FeatureCollection", features: [...parcels, ...dots] };
}

/** Where the "zoom in close" camera lands: the first parcel, or the farm when there are none. */
export function closeUpCentre(
  preset: DataPresetId,
  programStatus: ParcelMapStatus,
): [number, number] {
  const first = baseParcels(preset, programStatus)[0];
  return first ? ringCentre(first.geometry.coordinates[0]) : farm.center;
}
