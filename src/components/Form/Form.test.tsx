import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, FormFieldset, FormFooter, FormSection } from '.'
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
