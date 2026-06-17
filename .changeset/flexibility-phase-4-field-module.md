---
"@majistudio/ogcr-design-system": minor
---

Centralize form-field a11y wiring behind a shared Field module (Phase 4).

- **One source of truth for field wiring.** A new internal `useField` hook owns id generation, `aria-describedby` merging, `aria-invalid` resolution (caller value wins), and error/helper precedence (`errorText` over `helperText`). `Input`, `Textarea`, `NumberField`, `Select`, and `Combobox` all consume it instead of each hand-rolling the logic.
- **Consistent `aria-describedby` merging.** Previously `Input`/`Textarea` **overwrote** a caller-supplied `aria-describedby` (dropping it), while `NumberField` merged it. Now every control merges — a caller-passed description id is always preserved alongside the control's own helper id.
- **`Select` and `Combobox` gain `label` / `helperText` / `errorText`.** They can now render their own associated label + helper/error chrome standalone, matching the other inputs. When these props are omitted the rendered output is unchanged.
- **`FormField` publishes a Field context.** Our controls nested in a `FormField` adopt its control id, `aria-describedby`, and error state from context and suppress their own label/helper — so there is never a duplicate `<label>`. `FormField` still clones the child as a fallback for opaque (non-context) children, and now shares the same dedup-safe `mergeIds` helper.
