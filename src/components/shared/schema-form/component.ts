import type { ComponentProps as ReactComponentProps } from 'react'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { RadioGroup } from '~/components/ui/radio-group'
import { Select } from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'
import { DatePicker } from './date-picker'

export const componentMap = {
  Input,
  Select,
  Textarea,
  Radio: RadioGroup,
  Checkbox,
  Switch,
  DatePicker,
}

type ComponentMapType = typeof componentMap

export type ComponentType = keyof ComponentMapType

export type Option = {
  label: string
  value: Key
  description?: string
}

export type ComponentProps<K extends ComponentType> = ReactComponentProps<ComponentMapType[K]> & {
  className?: string
  placeholder?: string
  options?: Option[]
}

export type AllComponentProps = {
  [K in ComponentType]: ComponentProps<K>
}[ComponentType]
