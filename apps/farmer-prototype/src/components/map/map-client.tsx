"use client";

// The DS map plus its two stylesheets, MapLibre's first so the DS chrome restyle wins. Kept in
// its own module so both the stylesheets and the ~250 kB MapLibre bundle load only with the map.
import "maplibre-gl/dist/maplibre-gl.css";
import "@majistudio/ogcr-design-system/map.css";

export { MapView } from "@majistudio/ogcr-design-system/Map";
