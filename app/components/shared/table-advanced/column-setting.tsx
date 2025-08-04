import { arrayMove } from '@dnd-kit/sortable'
import { GripVertical, Settings2 } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'

import SortableVertical from '../sortable-vertical'

import { useTableAdvanced } from '.'

import type { DragEndEvent, DraggableAttributes } from '@dnd-kit/core'
import type { Column } from '@tanstack/react-table'

export default function ColumnSetting() {
  const { table, columnOrder, setColumnOrder } = useTableAdvanced()

  const columns =
    table?.getAllColumns()?.filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()) ?? []

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id.toString())
        const newIndex = items.indexOf(over.id.toString())
        const newOrder = arrayMove(items, oldIndex, newIndex)

        return newOrder
      })
    }
  }

  const sortedColumns = [...columns].sort((a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='ml-auto flex items-center justify-center has-[>svg]:px-2'
          title='Setting columns'
        >
          <Settings2 size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[250px] overflow-hidden'>
        <DropdownMenuLabel>Setting columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <SortableVertical items={sortedColumns} sortableItem={SortableItem} onDragEnd={handleDragEnd} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SortableItem<TData>(column: Column<TData, unknown>, attrs: DraggableAttributes) {
  return (
    <div className={cn('relative flex items-center')}>
      <DropdownMenuCheckboxItem
        key={column.id}
        className='flex-1 capitalize'
        checked={column.getIsVisible()}
        onCheckedChange={(value) => column.toggleVisibility(!!value)}
      >
        {column.columnDef.header?.toString() ?? column.id}
      </DropdownMenuCheckboxItem>
      <div {...attrs} className='hover:text-primary cursor-grab p-2 active:cursor-grabbing'>
        <GripVertical size={16} />
      </div>
    </div>
  )
}
