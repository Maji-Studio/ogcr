// Shared field wiring — the one place id generation, aria-describedby merging, aria-invalid
// resolution, and error/helper precedence live. Used by the form controls (Input, Textarea,
// NumberField, Select, Combobox) and provided by `FormField`.
//
// Internal only: not a published `exports` subpath. Two usage modes, both via `useField`:
//   1. Standalone — `<Input label helperText errorText />` owns its own label/helper chrome.
//   2. Inside a `FormField` — the FormField publishes a FieldContext that owns the control id and
//      the label/helper chrome; the control adopts that wiring and suppresses its own chrome, so
//      there is never a duplicate <label>.
//
// History: before this module, Input/Textarea OVERWROTE a caller-passed aria-describedby,
// NumberField MERGED it, and Select/Combobox only passed it through. `useField` makes the merge
// behavior uniform (caller ids are preserved, never dropped).

import { createContext, useContext, useId } from 'react'
import type { ReactNode } from 'react'

export type FieldAriaInvalid = boolean | 'true' | 'false'

/**
 * Published by a field wrapper (FormField) that already renders the label + helper/error chrome
 * and owns the control id. A descendant control reads it to adopt the id/aria wiring and skip
 * rendering its own chrome. `null` (no provider) means the control is standalone.
 */
export interface FieldContextValue {
  /** id assigned to the control element and referenced by the wrapper's `<label htmlFor>`. */
  controlId: string
  /** id(s) of the wrapper's helper/error element, to merge into the control's aria-describedby. */
  describedBy: string | undefined
  /** Error state published by the wrapper. */
  invalid: FieldAriaInvalid | undefined
  /** Whether the wrapper marked the field required (drives its own label asterisk). */
  required: boolean | undefined
}

const FieldContext = createContext<FieldContextValue | null>(null)

/** Provider a field wrapper (FormField) mounts around its control. */
export const FieldProvider = FieldContext.Provider

/** Read the ambient field wrapper context, or `null` when the control is standalone. */
export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext)
}

/**
 * Dedup-safe merge of space-separated id token lists (aria-describedby / aria-labelledby).
 * Splits on whitespace, de-duplicates, and drops empties; returns `undefined` when nothing's left.
 */
export function mergeIds(...ids: Array<string | undefined>): string | undefined {
  const set = new Set<string>()
  for (const id of ids) {
    if (!id) continue
    for (const part of id.split(/\s+/).filter(Boolean)) set.add(part)
  }
  return set.size ? Array.from(set).join(' ') : undefined
}

export interface UseFieldProps {
  id?: string
  label?: ReactNode
  helperText?: ReactNode
  errorText?: ReactNode
  /** Explicit error state. Also implied whenever `errorText` is present. */
  error?: boolean
  required?: boolean
  'aria-describedby'?: string
  'aria-invalid'?: FieldAriaInvalid
}

export interface UseFieldResult {
  /** True when an ancestor FormField owns the label/helper chrome and the control id. */
  controlledByField: boolean
  /** Render the control's OWN label/helper chrome (false when controlledByField). */
  renderChrome: boolean
  /** id for the control element and the label's `htmlFor`. */
  fieldId: string
  /** id of the helper/error element, or undefined (no description, or chrome is the wrapper's). */
  descriptionId: string | undefined
  /** Text for the helper/error element: `errorText ?? helperText`. */
  descriptionText: ReactNode
  /** Resolved error state. */
  isError: boolean
  /** Label surfaced for chrome rendering (null when the wrapper owns it). */
  label: ReactNode
  required: boolean | undefined
  /** Spread onto the control element (`<input>`, Base UI trigger/input, …). */
  controlProps: {
    id: string
    'aria-describedby': string | undefined
    'aria-invalid': FieldAriaInvalid | undefined
  }
}

/**
 * Resolve the a11y wiring for one field control. Call it unconditionally at the top of the
 * control; spread `result.controlProps` onto the control element (after `...rest`, so a stray
 * caller aria-* in rest can't clobber the merged values). When `result.renderChrome` is true and
 * there is a `label`/`descriptionText`, render the control's own label + helper/error elements
 * (using `fieldId` for `htmlFor`/`id` and `descriptionId` for the helper element id).
 */
export function useField(props: UseFieldProps): UseFieldResult {
  const {
    id,
    label,
    helperText,
    errorText,
    error,
    required,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
  } = props

  // Hooks run unconditionally before any branch (rules of hooks).
  const generatedId = useId()
  const ctx = useFieldContext()

  const ownError = Boolean(error) || Boolean(errorText)
  const descriptionText = errorText ?? helperText

  if (ctx) {
    // Inside a FormField: adopt its id/aria, let it own the label + helper chrome.
    const ctxInvalid = ctx.invalid === true || ctx.invalid === 'true'
    return {
      controlledByField: true,
      renderChrome: false,
      fieldId: ctx.controlId,
      descriptionId: undefined,
      descriptionText: null,
      isError: ownError || ctxInvalid,
      label: null,
      required: ctx.required,
      controlProps: {
        id: ctx.controlId,
        'aria-describedby': mergeIds(ariaDescribedby, ctx.describedBy),
        'aria-invalid': ariaInvalid ?? ctx.invalid ?? (ownError || undefined),
      },
    }
  }

  const fieldId = id ?? generatedId
  const descriptionId = descriptionText ? `${fieldId}-helper` : undefined
  return {
    controlledByField: false,
    renderChrome: true,
    fieldId,
    descriptionId,
    descriptionText,
    isError: ownError,
    label,
    required,
    controlProps: {
      id: fieldId,
      'aria-describedby': mergeIds(ariaDescribedby, descriptionId),
      'aria-invalid': ariaInvalid ?? (ownError || undefined),
    },
  }
}
