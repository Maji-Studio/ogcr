import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, FormField, FormFieldset, FormFooter, FormSection } from '.'
import { Input } from '../Input'
import { Button } from '../Button'

describe('Form', () => {
  it('renders sections, fieldsets and footer', () => {
    render(
      <Form>
        <FormSection title="Section" description="desc">
          <FormFieldset legend="Group">
            <Input label="Name" />
          </FormFieldset>
        </FormSection>
        <FormFooter>
          <Button type="submit">Send</Button>
        </FormFooter>
      </Form>,
    )
    expect(screen.getByText('Section')).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Group' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
  })

  it('wires a FormField label + error to its control via context (one label, not two)', () => {
    render(
      <Form>
        <FormField label="Email" errorText="Required">
          <Input />
        </FormField>
      </Form>,
    )
    // FormField owns the label; the control adopts its id and suppresses its own chrome.
    const input = screen.getByLabelText('Email')
    // Exactly one "Email" label (FormField's) — the control did not render a duplicate.
    expect(screen.getAllByText('Email')).toHaveLength(1)
    // Error state and message flow from the FormField to the control.
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!)).toHaveTextContent('Required')
    // Only one error message rendered (the FormField's), not one per layer.
    expect(screen.getAllByText('Required')).toHaveLength(1)
  })

  it('fires onSubmit when the submit button is clicked', async () => {
    const onSubmit = vi.fn((e) => e.preventDefault())
    render(
      <Form onSubmit={onSubmit}>
        <FormFooter>
          <Button type="submit">Send</Button>
        </FormFooter>
      </Form>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(onSubmit).toHaveBeenCalled()
  })
})
