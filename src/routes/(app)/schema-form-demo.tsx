import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SchemaForm } from '~/components/shared/schema-form'
import type { FormSchemaItem } from '~/components/shared/schema-form/types'
import { Input } from '~/components/ui/input'

export const Route = createFileRoute('/(app)/schema-form-demo')({
  component: RouteComponent,
})

const typeOptions = [
  { label: 'Banner Main', value: 'main' },
  { label: 'Banner Sub', value: 'sub' },
  { label: 'Popup', value: 'popup' },
]

const formSchemas: FormSchemaItem<{
  title: string
  imageUrl: File | null
  linkUrl: string
  bannerType: string
  startDate: Date
  endDate: Date
  sortOrder: string
  isActive: string
}>[] = [
  {
    field: 'title',
    label: 'Title',
    component: 'Input',
    defaultValue: '',
    componentProps: { placeholder: 'Enter title...' },
    rule: z.string().min(1),
  },
  {
    field: 'imageUrl',
    label: 'Image/Video',
    // Custom component for file input
    component: ({ formModel }) => {
      return (
        <Input
          type='file'
          accept='image/*,video/*'
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              formModel?.handleChange(file)
            }
          }}
        />
      )
    },
    defaultValue: null,
    componentProps: { placeholder: 'Select image/video...' },
    rule: z.any().optional(), // Relax schema for file object
  },
  {
    field: 'linkUrl',
    label: 'Link',
    component: 'Input',
    defaultValue: '',
    componentProps: { placeholder: 'https://example.com' },
    rule: z.url().optional().or(z.literal('')),
  },
  {
    field: 'bannerType',
    label: 'Banner Type',
    component: 'Select',
    defaultValue: typeOptions[0].value,
    componentProps: {
      options: typeOptions,
      placeholder: 'Select banner type',
    },
    rule: z.string(),
  },
  {
    field: 'startDate',
    label: 'Start Date',
    component: 'DatePicker',
    defaultValue: undefined,
    rule: z.date(),
  },
  {
    field: 'endDate',
    label: 'End Date',
    component: 'DatePicker',
    defaultValue: undefined,
    rule: z.date().optional(),
  },
  {
    field: 'sortOrder',
    label: 'Sort Order',
    component: 'Input',
    defaultValue: '1',
    componentProps: { type: 'number', min: 0 },
    rule: z
      .string()
      .transform((val) => Number(val))
      .pipe(z.number().min(0)),
  },
  {
    field: 'isActive',
    label: 'Status',
    component: 'Select',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: 'Active', value: '1' },
        { label: 'Inactive', value: '0' },
      ],
    },
    rule: z.string(),
  },
]

function RouteComponent() {
  return (
    <div className='container mx-auto py-10 max-w-2xl'>
      <h1 className='text-2xl font-bold mb-6'>Demo Schema Form</h1>
      <div className='border p-6 rounded-lg bg-card text-card-foreground shadow-sm'>
        <SchemaForm
          schemas={formSchemas}
          defaultValues={{
            title: '',
            bannerType: 'main',
            sortOrder: '1',
            isActive: '1',
          }}
          onSubmit={(values: any) => {
            console.log('Form Submitted:', values)
          }}
        />
      </div>
    </div>
  )
}
