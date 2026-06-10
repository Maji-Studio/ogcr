---
"@ogcr/design-system": minor
---

Add a copy seam — every default user-facing string is now an overridable prop (Phase 5).

- **One table for default copy.** A new internal `src/lib/strings.ts` holds every default string the components ship (close/dismiss/clear labels, placeholders, empty states, pagination labels, stepper labels). Each component sources its default from this table.
- **New overridable props** for strings that were previously hardcoded inline:
  - `Dialog` / `Sidesheet` — `closeLabel`
  - `Toast` / `Message` — `dismissLabel`
  - `DatePicker` — `clearLabel`
  - `NumberField` — `decrementLabel`, `incrementLabel`
  - `Pagination` — `navLabel`, `previousLabel`, `nextLabel`, and `pageLabel(page)` (a function, for localized numbered-page labels)
- **Existing defaults re-sourced from the table** (no API change): `AlertDialog` `confirmLabel`/`cancelLabel`, `Select`/`Combobox`/`DatePicker` placeholders, `Combobox` `emptyMessage`, `Table` empty-state fallback.
- **No provider/context** — overriding is per-prop, keeping the seam explicit and tree-shakeable. Localizing globally is done by wrapping components (or a future provider over this same table). Third-party copy (react-day-picker month/weekday/nav labels, Base UI internals) is out of scope and localized through those libraries.
