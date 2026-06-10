import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FieldProvider, mergeIds, useField, type UseFieldProps } from '.'

// Minimal control that exercises useField the way a real form control does: spread controlProps
// on the input, render label/helper only when the hook says to own the chrome.
function FieldHarness(props: UseFieldProps) {
  const field = useField(props)
  return (
    <div>
      {field.renderChrome && field.label && <label htmlFor={field.fieldId}>{field.label}</label>}
      <input data-testid="control" data-error={field.isError} {...field.controlProps} />
      {field.renderChrome && field.descriptionText && (
        <p id={field.descriptionId}>{field.descriptionText}</p>
      )}
    </div>
  )
}

describe('mergeIds', () => {
  it('dedupes and drops empties, preserving order', () => {
    expect(mergeIds('a b', undefined, 'b c', '')).toBe('a b c')
  })

  it('returns undefined when nothing remains', () => {
    expect(mergeIds(undefined, '', '   ')).toBeUndefined()
  })
})

describe('useField (standalone)', () => {
  it('generates an id and associates the label with the control', () => {
    render(<FieldHarness label="Email" />)
    const input = screen.getByLabelText('Email')
    expect(input).toBe(screen.getByTestId('control'))
    expect(input.id).toBeTruthy()
  })

  it('honors a caller-supplied id', () => {
    render(<FieldHarness label="Email" id="my-id" />)
    expect(screen.getByTestId('control')).toHaveAttribute('id', 'my-id')
  })

  it('prefers errorText over helperText and marks the field invalid', () => {
    render(<FieldHarness label="Email" helperText="optional" errorText="Required" />)
    const input = screen.getByTestId('control')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.queryByText('optional')).toBeNull()
  })

  it('sets no aria-invalid when there is no error and no caller value', () => {
    render(<FieldHarness label="Email" helperText="optional" />)
    expect(screen.getByTestId('control')).not.toHaveAttribute('aria-invalid')
  })

  it('lets a caller aria-invalid win over the derived state (aria and error styling agree)', () => {
    render(<FieldHarness label="Email" error aria-invalid="false" />)
    const input = screen.getByTestId('control')
    expect(input).toHaveAttribute('aria-invalid', 'false')
    // Error styling follows the resolved aria state, so the two can't diverge.
    expect(input).toHaveAttribute('data-error', 'false')
  })

  it('MERGES a caller aria-describedby with the generated helper id (never drops it)', () => {
    render(<FieldHarness label="Email" helperText="We never share it" aria-describedby="caller-1" />)
    const input = screen.getByTestId('control')
    const describedBy = input.getAttribute('aria-describedby') ?? ''
    expect(describedBy.split(' ')).toContain('caller-1')
    const helperId = describedBy.split(' ').find((token) => token !== 'caller-1')
    expect(helperId).toBeTruthy()
    expect(document.getElementById(helperId!)).toHaveTextContent('We never share it')
  })
})

describe('useField (inside a FormField context)', () => {
  it('adopts the context id/aria and suppresses its own label/helper chrome', () => {
    render(
      <FieldProvider
        value={{ controlId: 'ctl', describedBy: 'ext-help', invalid: true, required: true }}
      >
        <FieldHarness label="Inner label" helperText="inner help" aria-describedby="caller-2" />
      </FieldProvider>,
    )
    const input = screen.getByTestId('control')
    // Adopts the wrapper's id and invalid state.
    expect(input).toHaveAttribute('id', 'ctl')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    // Merges the wrapper's helper id with the caller's, keeping both.
    const describedBy = input.getAttribute('aria-describedby') ?? ''
    expect(describedBy.split(' ')).toEqual(expect.arrayContaining(['caller-2', 'ext-help']))
    // Chrome is the wrapper's job — the control renders neither its own label nor helper.
    expect(screen.queryByText('Inner label')).toBeNull()
    expect(screen.queryByText('inner help')).toBeNull()
  })
})
