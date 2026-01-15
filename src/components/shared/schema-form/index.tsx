import { type FormValidateOrFn, useForm } from '@tanstack/react-form'
import { useId } from 'react'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { cn } from '~/lib/utils'
import { DynamicRender, SchemaField } from './schema-field'
import type { FormSchemaItem, SchemaFormProps } from './types'

export function SchemaForm<T extends Recordable>({ schemas, onSubmit, defaultValues, className }: SchemaFormProps<T>) {
  const formId = useId()
  // Generate Zod Schema dynamically
  const formSchema = z.object(
    schemas.reduce((acc, item) => {
      if (item.rule) acc[item.field as string] = item.rule

      return acc
    }, {} as Recordable)
  ) as FormValidateOrFn<Partial<T>>

  const form = useForm({
    defaultValues: defaultValues || ({} as T),
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <form
      id={formId}
      className={className}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        {schemas.map((schema: FormSchemaItem<T>) => (
          <form.Field key={schema.field} name={schema.field}>
            {(field) => {
              // Checking for errors
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              const fieldId = `${formId}-${schema.field}`
              return (
                <Field data-invalid={isInvalid} className={cn('space-y-2', schema.className)}>
                  {schema.component !== 'Checkbox' && schema.component !== 'Switch' && (
                    <FieldLabel htmlFor={fieldId}>
                      <DynamicRender value={schema.label} />
                    </FieldLabel>
                  )}

                  <SchemaField fieldId={fieldId} field={field} schema={schema} isInvalid={isInvalid} />

                  {schema.description && <FieldDescription>{schema.description}</FieldDescription>}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        ))}
      </FieldGroup>

      <Field orientation='horizontal'>
        <Button type='button' variant='outline' onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type='submit' form={formId}>
          Save
        </Button>
      </Field>
    </form>
  )
}
