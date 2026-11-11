---
"@majistudio/ogcr-design-system": minor
---

`Map`: the Minimal basemap is now OpenFreeMap Positron (vector tiles, sharp at every zoom, no key or usage limits) instead of Esri Light Gray Canvas, which stopped at z16. The map waits up to 5s for the Positron style; if it can't load, Minimal falls back to Esri Light Gray Canvas and Satellite is unaffected. The map now also fetches `tiles.openfreemap.org`, so a strict Content-Security-Policy must allow it.
