import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { cn } from '~/lib/utils'

interface DateParams {
  value?: Date
  onChange: (date?: Date) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, placeholder, className }: DateParams) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground', className)}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {value ? format(value, 'PPP') : <span>{placeholder || 'Pick a date'}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
        <Calendar mode='single' captionLayout='dropdown' selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  )
}
