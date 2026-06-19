// The copy seam — every default user-facing string the components ship, in one table.
//
// Each of these is the DEFAULT for an overridable prop: a component sources its default from
// here (`closeLabel = dsStrings.dialog.closeLabel`), and a caller overrides per-instance by
// passing the prop. There is intentionally NO provider/context — overriding is per-prop, which
// keeps the seam explicit and tree-shakeable. To re-label or localize globally, a consumer wraps
// the components, or (future) we add a provider on top of this same table.
//
// Internal only: not a published `exports` subpath. Lives beside cn/overlay/field as shared lib.
//
// Out of scope: strings owned by third-party libraries — react-day-picker's month/weekday/nav
// labels (Calendar/DatePicker) and Base UI's internal text are localized through those libs.

export const dsStrings = {
  dialog: {
    /** aria-label for the corner close button. */
    closeLabel: 'Close',
  },
  alertDialog: {
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
  sidesheet: {
    /** aria-label for the close button. */
    closeLabel: 'Close',
  },
  toast: {
    /** aria-label for each toast's close button. */
    dismissLabel: 'Dismiss',
  },
  message: {
    /** aria-label for the floating message's dismiss button. */
    dismissLabel: 'Dismiss',
  },
  numberField: {
    /** aria-label for the decrement stepper. */
    decrementLabel: 'Decrease',
    /** aria-label for the increment stepper. */
    incrementLabel: 'Increase',
  },
  select: {
    placeholder: 'Select…',
  },
  combobox: {
    placeholder: 'Search…',
    emptyMessage: 'No matches found.',
  },
  datePicker: {
    placeholder: 'Select date',
    /** aria-label for the clear (✕) button. */
    clearLabel: 'Clear date',
  },
  table: {
    /** Shown when the table has no rows. */
    emptyMessage: 'No records',
  },
  pagination: {
    /** aria-label for the <nav> landmark. */
    navLabel: 'Pagination',
    /** aria-label for the previous-page button. */
    previousLabel: 'Previous page',
    /** aria-label for the next-page button. */
    nextLabel: 'Next page',
    /** aria-label for a numbered page button. */
    pageLabel: (page: number) => `Page ${page}`,
  },
} as const
