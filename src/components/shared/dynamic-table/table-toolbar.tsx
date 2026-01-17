import type { Table } from '@tanstack/react-table'
import { cn } from '~/lib/utils'
import { TableViewOptions } from './table-view-options'

interface DynamicTableToolbarProps<TData> {
  table: Table<TData>
  showToolbar: boolean
  enableColumnVisibility?: boolean
  children?: React.ReactNode
  className?: string
}

export function DynamicTableToolbar<TData>({
  table,
  showToolbar,
  enableColumnVisibility,
  children,
  className,
}: DynamicTableToolbarProps<TData>) {
  if (!showToolbar) return null

  return (
    <div className={cn('flex items-center justify-between gap-2 px-2 mb-4', className)}>
      <div className='flex items-center gap-2'>{children}</div>
      <div className='flex items-center gap-2'>{enableColumnVisibility && <TableViewOptions table={table} />}</div>
    </div>
  )
}
