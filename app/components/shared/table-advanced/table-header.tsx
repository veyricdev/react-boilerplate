import { flexRender } from '@tanstack/react-table'

import { TableHead, TableHeader as TableHeaderUi, TableRow } from '~/components/ui/table'

import { useTableAdvanced } from '.'

export function TableHeader() {
  const { table } = useTableAdvanced()

  const headerGroups = table?.getHeaderGroups()

  return (
    <TableHeaderUi className='bg-muted sticky top-0 z-10'>
      {headerGroups?.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                style={{
                  width: header.column.columnDef.size,
                  minWidth: header.column.columnDef.minSize,
                  maxWidth:
                    Number.MAX_SAFE_INTEGER === header.column.columnDef.maxSize
                      ? undefined
                      : header.column.columnDef.maxSize,
                }}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeaderUi>
  )
}
