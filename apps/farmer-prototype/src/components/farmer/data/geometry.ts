/**
 * Lindenhof's parcels as GeoJSON the real MapLibre map can draw.
 *
 * The walkthrough scatters each farm as a standalone quadrilateral because it renders 29 farms
 * across a 30 km supply shed. The farmer looks at one farm, so the parcels are laid out here the
 * way a farm actually reads from the air: one contiguous block, split into strips that share their
 * boundaries, rotated off north. Strip depth is proportional to the parcel's hectares, so the map
 * and the parcel list tell the same story.
 *
 * Shapes are deterministic (a fixed trigonometric hash, no Math.random) so the map is stable across
 * renders, reloads and screenshots.
 */

import type { Feature, FeatureCollection, Polygon } from "geojson";
import { formatArea, parcels, type FarmerParcel, type PotentialTier } from "./farm";

/** Metres per degree at Plattling (48.79° N). */
const M_PER_DEG_LAT = 111_320;
const M_PER_DEG_LNG = 73_400;
const M2_PER_HA = 10_000;

/** Width of the block, west to east, in metres. Depth follows from the parcel areas. */
const BLOCK_WIDTH_M = 420;
/** Rotation off north, in radians. Fields almost never sit square to the graticule. */
const BLOCK_BEARING = -0.38;
/** How far a shared boundary is allowed to wander from straight, in metres. */
const BOUNDARY_WAVE_M = 14;
/** How far the west and east edges are allowed to wander, in metres. */
const EDGE_WAVE_M = 20;

/** Properties the map paints from, and the click handler reads back. */
export interface ParcelFeatureProperties {
  parcelId: string;
  name: string;
  /** Consumed by the map's colour ramp. */
  status: PotentialTier;
  area: number;
  /** Second line of the on-map name card, e.g. "6.8 ha". */
  detail: string;
  selected: boolean;
  [key: string]: unknown;
}

/** Deterministic pseudo-jitter in [-1, 1], stable for a given seed. */
function jitter(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

/** Local metres (x east, y north, origin at the block centre) to [lng, lat]. */
function toLngLat(x: number, y: number, center: readonly [number, number]): [number, number] {
  const cos = Math.cos(BLOCK_BEARING);
  const sin = Math.sin(BLOCK_BEARING);
  const east = x * cos - y * sin;
  const north = x * sin + y * cos;
  return [center[0] + east / M_PER_DEG_LNG, center[1] + north / M_PER_DEG_LAT];
}

/** North and south edge depth, in metres, of each parcel measured from the block centre. */
function stripEdges(list: FarmerParcel[]): number[] {
  const depths = list.map((parcel) => (parcel.area * M2_PER_HA) / BLOCK_WIDTH_M);
  const total = depths.reduce((sum, depth) => sum + depth, 0);
  const edges = [total / 2];
  depths.forEach((depth) => edges.push(edges[edges.length - 1] - depth));
  return edges;
}

/**
 * One strip of the block. Boundaries are shared: strip `index` uses edge `index` as its north side
 * and edge `index + 1` as its south side, and both ends of a boundary are nudged by the same
 * deterministic amount for both neighbours, so no gap or overlap can open up between them.
 */
function stripPolygon(
  center: readonly [number, number],
  edges: number[],
  index: number,
): Polygon {
  const halfWidth = BLOCK_WIDTH_M / 2;
  const northEdge = edges[index];
  const southEdge = edges[index + 1];

  const corner = (edge: number, side: -1 | 1, seed: number): [number, number] =>
    toLngLat(
      side * (halfWidth + EDGE_WAVE_M * jitter(seed)),
      edge + BOUNDARY_WAVE_M * jitter(seed + 0.5),
      center,
    );

  // Seeds are derived from the shared edge, not the strip, so neighbours agree on the boundary.
  const northWest = corner(northEdge, -1, index * 2 + 1);
  const northEast = corner(northEdge, 1, index * 2 + 2);
  const southEast = corner(southEdge, 1, index * 2 + 4);
  const southWest = corner(southEdge, -1, index * 2 + 3);

  return {
    type: "Polygon",
    coordinates: [[northWest, northEast, southEast, southWest, northWest]],
  };
}

/**
 * The farmer's own map layer. `selectedId` rides along in the feature properties so selection is a
 * data change the existing map already knows how to repaint, not a second source of truth.
 */
export function lindenhofParcelFeatures(
  center: readonly [number, number],
  selectedId: string | null,
): FeatureCollection<Polygon, ParcelFeatureProperties> {
  const edges = stripEdges(parcels);

  const features: Feature<Polygon, ParcelFeatureProperties>[] = parcels.map((parcel, index) => ({
    type: "Feature",
    id: parcel.id,
    geometry: stripPolygon(center, edges, index),
    properties: {
      parcelId: parcel.id,
      name: parcel.name,
      status: parcel.tier,
      area: parcel.area,
      detail: `${formatArea(parcel.area)} ha`,
      selected: parcel.id === selectedId,
    },
  }));

  return { type: "FeatureCollection", features };
}
