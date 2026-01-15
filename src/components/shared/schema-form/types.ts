import type { AnyFieldApi } from '@tanstack/react-form'
import type { ComponentType as ReactComponentType, ReactNode } from 'react'
import type { ZodType } from 'zod'
import type { AllComponentProps, ComponentProps, ComponentType } from './component'

export type GetFieldKeys<T> = Exclude<keyof T, symbol | number>

// Props passed to a custom component
export type CustomComponentProps<T extends object = Recordable> = {
  // We'll pass the field API from tanstack-form
  formModel?: AnyFieldApi
  // And the schema definition itself
  field?: FormSchemaItem<T>
}

export type FormSchemaItem<T extends object = Recordable> = {
  field: GetFieldKeys<T>
  label: ReactNode | ReactComponentType<CustomComponentProps<T>>
  defaultValue?: any

  // Zod rule for validation
  rule?: ZodType<any>
  description?: string
  className?: string
} & ComponentSchema<T>

type ComponentSchema<T extends object = Recordable> =
  | {
      [K in ComponentType]: {
        component: K
        componentProps?: ComponentProps<K> | ((props?: CustomComponentProps<T>) => ComponentProps<K>)
      }
    }[ComponentType]
  | {
      component: ReactComponentType<CustomComponentProps<T>>
      componentProps?: AllComponentProps | ((props?: CustomComponentProps<T>) => AllComponentProps)
    }

export interface SchemaFormProps<T extends object = Recordable> {
  schemas: FormSchemaItem<T>[]
  onSubmit: (data: Partial<T>) => void | Promise<void>
  defaultValues?: Partial<T>
  className?: string
}
