// Parcel geometry for the supply shed, as GeoJSON the real MapLibre map can draw.
//
// Polygons are generated from each farm's actual hectares rather than hand-drawn, so a farm's
// footprint on the map is proportional to the area it contributes to the campaign. Shapes are
// deterministic (a fixed hash, no Math.random) so the map is stable across renders and reloads.

import type { Feature, FeatureCollection, Geometry, Polygon } from "geojson";
import { farms, lindenhofParcels, LINDENHOF_ID, type Farm } from "./farms";

/** Metres per degree at the Plattling supply shed (48.78° N). */
const M_PER_DEG_LAT = 111_320;
const M_PER_DEG_LNG = 73_400;
const M2_PER_HA = 10_000;

export type ParcelStatus = "enrolled" | "awaiting" | "dropped";

export interface ParcelProperties {
  farmId: string;
  /** Farm name — never sent to the buyer view. See `generalisedParcels`. */
  name: string;
  status: ParcelStatus;
  practice: string;
  area: number;
}

/** Deterministic pseudo-jitter in [-1, 1], stable for a given seed. */
function jitter(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/** A field-shaped irregular quadrilateral of roughly `area` hectares around `center`. */
function fieldPolygon(center: [number, number], area: number, seed: number): Polygon {
  const side = Math.sqrt(area * M2_PER_HA);
  const dLat = side / M_PER_DEG_LAT / 2;
  const dLng = side / M_PER_DEG_LNG / 2;
  const [lng, lat] = center;

  // Corners, each nudged so fields read as land parcels rather than identical squares.
  const corners: [number, number][] = [
    [lng - dLng * (1 + 0.25 * jitter(seed + 1)), lat - dLat * (1 + 0.25 * jitter(seed + 2))],
    [lng + dLng * (1 + 0.25 * jitter(seed + 3)), lat - dLat * (1 + 0.25 * jitter(seed + 4))],
    [lng + dLng * (1 + 0.25 * jitter(seed + 5)), lat + dLat * (1 + 0.25 * jitter(seed + 6))],
    [lng - dLng * (1 + 0.25 * jitter(seed + 7)), lat + dLat * (1 + 0.25 * jitter(seed + 8))],
  ];

  return { type: "Polygon", coordinates: [[...corners, corners[0]]] };
}

function feature(geometry: Geometry, properties: ParcelProperties, id: string): Feature<Geometry, ParcelProperties> {
  return { type: "Feature", id, geometry, properties };
}

function farmStatus(farm: Farm, lindenhofApproved: boolean): ParcelStatus {
  if (farm.id === LINDENHOF_ID) return lindenhofApproved ? "enrolled" : "awaiting";
  return farm.completes ? "enrolled" : "dropped";
}

/**
 * Every farm in the supply shed, one polygon each. Lindenhof's status follows the approval gate,
 * which is what makes the operator's map move when the farmer approves.
 */
export function supplyShedParcels(lindenhofApproved: boolean): FeatureCollection<Geometry, ParcelProperties> {
  const features: Feature<Geometry, ParcelProperties>[] = [];

  farms.forEach((farm, index) => {
    const properties: ParcelProperties = {
      farmId: farm.id,
      name: farm.name,
      status: farmStatus(farm, lindenhofApproved),
      practice: farm.practice,
      area: farm.area,
    };

    features.push(feature(fieldPolygon(farm.center, farm.area, index * 17), properties, farm.id));
    // A locator point for the same farm — the map draws it at shed zoom, where the true parcel
    // geometry is far too small to see, and fades it out once you zoom into the field itself.
    features.push({
      type: "Feature",
      id: `${farm.id}-point`,
      geometry: { type: "Point", coordinates: farm.center },
      properties,
    });
  });

  return { type: "FeatureCollection", features };
}

/** Lindenhof's three real parcels, laid out around the farmstead. This is the farmer's own view. */
export function lindenhofFields(approved: boolean): FeatureCollection<Geometry, ParcelProperties> {
  const lindenhof = farms.find((farm) => farm.id === LINDENHOF_ID)!;
  const [lng, lat] = lindenhof.center;
  // Fan the three parcels out around the farmstead so they read as distinct fields.
  const offsets: [number, number][] = [
    [lng - 0.011, lat + 0.004],
    [lng + 0.010, lat + 0.006],
    [lng - 0.002, lat - 0.008],
  ];

  return {
    type: "FeatureCollection",
    features: lindenhofParcels.map((parcel, index) =>
      feature(
        fieldPolygon(offsets[index], parcel.area, 100 + index * 23),
        {
          farmId: LINDENHOF_ID,
          name: parcel.name,
          status: approved ? "enrolled" : "awaiting",
          practice: parcel.practice,
          area: parcel.area,
        },
        parcel.id,
      ),
    ),
  };
}

/**
 * The buyer's view: generalised geography only. Farm names are stripped and each polygon is grown
 * into a coarse blob, so provenance is visible but exact boundaries and identities are not — the
 * visibility model the flow spec requires.
 */
export function generalisedParcels(): FeatureCollection<Geometry, ParcelProperties> {
  return {
    type: "FeatureCollection",
    features: farms
      .filter((farm) => farm.completes)
      .map((farm, index) =>
        feature(
          // 2.2× the true extent: enough to show where the shed is, too coarse to be a boundary.
          fieldPolygon(farm.center, farm.area * 2.2, index * 31),
          {
            farmId: "redacted",
            name: "Participating farm",
            status: "enrolled",
            practice: farm.practice,
            area: farm.area,
          },
          `generalised-${index}`,
        ),
      ),
  };
}
