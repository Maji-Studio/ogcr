import {
  cloneElement,
  isValidElement,
  useId,
  type ComponentPropsWithoutRef,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import { FieldProvider, mergeIds } from '../../lib/field'
import { cn } from '../../lib/cn'

type WiredFieldChildProps = {
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
}

export type FormProps = FormHTMLAttributes<HTMLFormElement>

export function Form({ className, ...rest }: FormProps) {
  return <form data-slot="form" className={cn('flex flex-col w-full m-0 p-0', className)} {...rest} />
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type FormSectionProps = HTMLAttributes<HTMLElement> & {
  step?: string
  title: ReactNode
  description?: ReactNode
  /** Heading level rendered for the section title. Defaults to 3. */
  headingLevel?: HeadingLevel
}

export function FormSection({
  step,
  title,
  description,
  headingLevel = 3,
  children,
  className,
  ...rest
}: FormSectionProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <section
      {...rest}
      data-slot="form-section"
      className={cn(
        'flex flex-col gap-16 py-32 border-t border-border-light first:border-t-0 first:pt-0',
        className,
      )}
    >
      <header data-slot="form-section-head" className="flex flex-col gap-4 mb-8">
        {step && (
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-interaction-primary-default">
            {step}
          </span>
        )}
        <Heading className="m-0 font-standard font-medium text-m leading-[1.2] tracking-[-0.01em] text-text-primary">
          {title}
        </Heading>
        {description && (
          <p className="m-0 max-w-[60ch] font-standard font-normal text-s leading-[1.45] text-text-secondary">
            {description}
          </p>
        )}
      </header>
      <div data-slot="form-section-body" className="flex flex-col gap-16 min-w-0">
        {children}
      </div>
    </section>
  )
}

export function FormRow({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="form-row"
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 gap-16',
        className,
      )}
      {...rest}
    />
  )
}

export type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
  label?: ReactNode
  helperText?: ReactNode
  errorText?: ReactNode
  required?: boolean
  /** Override the generated control id. Useful when the child needs an externally-pinned id. */
  htmlFor?: string
  children: ReactNode
}

export function FormField({
  label,
  helperText,
  errorText,
  required,
  htmlFor,
  children,
  className,
  ...rest
}: FormFieldProps) {
  const generatedId = useId()
  // Prefer an explicit htmlFor, then the child's own id, then a generated id —
  // so the <label htmlFor> always matches the id injected into the cloned child.
  const childId = isValidElement(children)
    ? (children as ReactElement<WiredFieldChildProps>).props.id
    : undefined
  const controlId = htmlFor ?? childId ?? generatedId
  const helperId = helperText || errorText ? `${controlId}-helper` : undefined
  const error = Boolean(errorText)

  // Our own controls (Input, Select, …) read the FieldContext below and wire themselves. The
  // cloneElement here is the fallback path for opaque children (a raw <input>, a third-party
  // control) that don't consume the context — it injects the same id/aria so they still associate.
  // Both paths agree (same controlId/helperId/error), and mergeIds dedups any overlap.
  const wiredChild =
    isValidElement(children)
      ? cloneElement(children as ReactElement<WiredFieldChildProps>, {
          id: controlId,
          'aria-describedby': mergeIds(
            (children as ReactElement<WiredFieldChildProps>).props['aria-describedby'],
            helperId,
          ),
          'aria-invalid':
            (children as ReactElement<WiredFieldChildProps>).props['aria-invalid'] ??
            (error || undefined),
        })
      : children

  return (
    <div
      {...rest}
      data-slot="form-field"
      className={cn('flex flex-col gap-4 min-w-0', className)}
    >
      {label && (
        <label
          htmlFor={controlId}
          className="font-standard font-normal text-s leading-[1.4] text-text-secondary"
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 font-medium text-text-negative">
              *
            </span>
          )}
        </label>
      )}
      <FieldProvider
        value={{
          controlId,
          describedBy: helperId,
          invalid: error || undefined,
          required,
        }}
      >
        {wiredChild}
      </FieldProvider>
      {(errorText || helperText) && (
        <p
          id={helperId}
          className={cn(
            'm-0 font-standard font-normal text-s leading-[1.4]',
            error ? 'text-text-negative' : 'text-text-secondary',
          )}
        >
          {errorText ?? helperText}
        </p>
      )}
    </div>
  )
}

export type FormFieldsetProps = ComponentPropsWithoutRef<'fieldset'> & {
  legend: ReactNode
  helperText?: ReactNode
  errorText?: ReactNode
  required?: boolean
  inline?: boolean
  children: ReactNode
}

export function FormFieldset({
  legend,
  helperText,
  errorText,
  required,
  inline = false,
  children,
  className,
  ...rest
}: FormFieldsetProps) {
  const id = useId()
  const helperId = helperText || errorText ? `${id}-helper` : undefined
  const error = Boolean(errorText)
  return (
    <fieldset
      {...rest}
      data-slot="form-fieldset"
      aria-describedby={helperId}
      className={cn('flex flex-col gap-8 min-w-0 m-0 p-0 border-0', className)}
    >
      <legend className="p-0 font-standard font-normal text-s leading-[1.4] text-text-secondary">
        {legend}
        {required && (
          <span aria-hidden="true" className="ml-1 font-medium text-text-negative">
            *
          </span>
        )}
      </legend>
      <div
        data-slot="form-fieldset-body"
        className={cn(
          inline
            ? 'grid grid-cols-1 sm:grid-flow-col sm:auto-cols-fr gap-12 [&>*]:w-full [&>*]:max-w-none'
            : 'flex flex-col gap-8',
        )}
      >
        {children}
      </div>
      {(errorText || helperText) && (
        <p
          id={helperId}
          className={cn(
            'm-0 font-standard font-normal text-s leading-[1.4]',
            error ? 'text-text-negative' : 'text-text-secondary',
          )}
        >
          {errorText ?? helperText}
        </p>
      )}
    </fieldset>
  )
}

export type FormFooterProps = HTMLAttributes<HTMLElement> & {
  note?: ReactNode
  children: ReactNode
}

export function FormFooter({ note, children, className, ...rest }: FormFooterProps) {
  return (
    <footer
      {...rest}
      data-slot="form-footer"
      className={cn(
        'flex flex-col gap-16 pt-24 mt-8 border-t border-border-light',
        'sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      {note && (
        <p className="m-0 sm:order-last font-mono text-[11px] uppercase tracking-[0.08em] text-text-secondary">
          {note}
        </p>
      )}
      <div className="flex items-center gap-8 flex-wrap justify-start">{children}</div>
    </footer>
  )
}
