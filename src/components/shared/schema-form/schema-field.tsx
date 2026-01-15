import type { AnyFieldApi } from '@tanstack/react-form'
import type { ComponentType as ReactComponentType, ReactNode } from 'react'
import { Checkbox } from '~/components/ui/checkbox'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'
import { isFunction } from '~/utils/is'
import { DatePicker } from './date-picker'
import type { CustomComponentProps, FormSchemaItem } from './types'

interface SchemaFieldProps<T extends object = Recordable> {
  fieldId: string
  isInvalid?: boolean
  field: AnyFieldApi
  schema: FormSchemaItem<T>
}

export function SchemaField<T extends object = Recordable>({ field, schema, fieldId, isInvalid }: SchemaFieldProps<T>) {
  const { component: Component, componentProps, label } = schema

  // Handling Custom Components
  if (typeof Component !== 'string') {
    return <Component formModel={field} field={schema} />
  }

  // Standard fields rendering
  // We need to bind the field.state.value and field.handleChange / field.handleBlur

  const commonProps = {
    id: fieldId,
    name: field.name,
    onBlur: field.handleBlur,
    'aria-invalid': field.state.meta.isTouched && field.state.meta.errors.length > 0,
  }

  switch (Component) {
    case 'Input': {
      const cmpProps = isFunction(componentProps) ? componentProps({ field: schema, formModel: field }) : componentProps
      return (
        <Input
          {...commonProps}
          {...cmpProps}
          value={field.state.value ?? ''}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
        />
      )
    }

    case 'Textarea': {
      const cmpProps = isFunction(componentProps) ? componentProps({ field: schema, formModel: field }) : componentProps
      return (
        <Textarea
          {...commonProps}
          {...cmpProps}
          value={field.state.value ?? ''}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
        />
      )
    }

    case 'Select': {
      const cmpProps = isFunction(componentProps) ? componentProps({ field: schema, formModel: field }) : componentProps
      return (
        <Select value={String(field.state.value ?? '')} onValueChange={(val) => field.handleChange(val)}>
          <SelectTrigger className={cn('w-full', cmpProps?.className)} aria-invalid={isInvalid}>
            <SelectValue placeholder={cmpProps?.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {cmpProps?.options?.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    case 'Radio': {
      const cmpProps = isFunction(componentProps) ? componentProps({ field: schema, formModel: field }) : componentProps
      return (
        <RadioGroup name={field.name} value={field.state.value} onValueChange={field.handleChange}>
          {cmpProps?.options?.map((otp) => (
            <FieldLabel key={otp.value} htmlFor={`${fieldId}-${otp.value}`}>
              <Field orientation='horizontal' data-invalid={isInvalid}>
                <FieldContent>
                  <FieldTitle>{otp.label}</FieldTitle>
                  {otp.description && <FieldDescription>{otp.description}</FieldDescription>}
                </FieldContent>
                <RadioGroupItem value={String(otp.value)} id={`${fieldId}-${otp.value}`} aria-invalid={isInvalid} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      )
    }

    case 'Switch': {
      const cmpProps = isFunction(componentProps) ? componentProps({ field: schema, formModel: field }) : componentProps
      return (
        <div className={cn('flex items-center space-x-2', cmpProps?.className)}>
          <Switch
            id={schema.field}
            checked={!!field.state.value}
            onCheckedChange={field.handleChange}
            aria-invalid={isInvalid}
          />
          <FieldLabel htmlFor={schema.field}>
            <DynamicRender value={label} formModel={field} field={schema} />
          </FieldLabel>
        </div>
      )
    }

    case 'Checkbox': {
      const cmpProps = isFunction(componentProps) ? componentProps({ field: schema, formModel: field }) : componentProps
      return (
        <div className={cn('flex items-center space-x-2', cmpProps?.className)}>
          <Checkbox
            id={schema.field}
            checked={!!field.state.value}
            onCheckedChange={field.handleChange}
            aria-invalid={isInvalid}
          />
          <FieldLabel htmlFor={schema.field}>
            <DynamicRender value={label} formModel={field} field={schema} />
          </FieldLabel>
        </div>
      )
    }

    case 'DatePicker': {
      const cmpProps = isFunction(componentProps) ? componentProps({ field: schema, formModel: field }) : componentProps
      return (
        <DatePicker
          value={field.state.value}
          onChange={field.handleChange}
          placeholder={cmpProps?.placeholder}
          className={cmpProps?.className}
          aria-invalid={isInvalid}
        />
      )
    }

    default:
      return null
  }
}

export function DynamicRender<T extends object = Recordable>({
  value,
  field,
  formModel,
}: {
  value: ReactNode | ReactComponentType<CustomComponentProps<T>>
  formModel?: AnyFieldApi
  field?: FormSchemaItem<T>
}) {
  if (isFunction(value)) {
    const Component = value
    return <Component formModel={formModel} field={field} />
  }
  return value
}
