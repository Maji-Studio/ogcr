import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, FormFieldset, FormFooter, FormRow, FormSection } from '.'
import { Input } from '../Input'
import { Radio, RadioGroup } from '../Radio'
import { Checkbox } from '../Checkbox'
import { Button } from '../Button'
import { ArrowRightIcon } from '../icons'

const meta = {
  title: 'Components/Form',
  component: Form,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Submission: Story = {
  render: () => (
    <Form noValidate onSubmit={(e) => e.preventDefault()}>
      <FormSection step="I" title="Project" description="Identify the project being submitted.">
        <FormRow>
          <Input label="Project name" defaultValue="Iberian rewilding pilot" />
          <Input label="Project code" defaultValue="OGCR-IBER-001" />
        </FormRow>
      </FormSection>
      <FormSection step="II" title="Verification" description="Reviewer level required.">
        <FormFieldset legend="Verification level" required inline>
          <RadioGroup aria-label="Verification level" name="verify" defaultValue="full" className="flex flex-row gap-12">
            <Radio layout="border-left" value="basic" label="Basic" secondaryText="Document review only" />
            <Radio layout="border-left" value="full" label="Full audit" secondaryText="Field visit + sampling" />
          </RadioGroup>
        </FormFieldset>
      </FormSection>
      <FormSection step="III" title="Confirm" description="Acknowledge before submitting.">
        <Checkbox label="I confirm the data above is accurate and complete." />
      </FormSection>
      <FormFooter note="Required fields are marked *">
        <Button variant="filled" type="submit" iconRight={<ArrowRightIcon />}>Submit for review</Button>
        <Button variant="outlined" type="button">Save draft</Button>
        <Button variant="text" type="button">Cancel</Button>
      </FormFooter>
    </Form>
  ),
}
