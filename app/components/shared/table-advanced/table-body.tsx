import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'

import { TableBody as TableBodyUi, TableCell, TableRow } from '~/components/ui/table'

import { useTableAdvanced } from '.'

export function TableBody() {
  const { isPending, isLoading, columns, table } = useTableAdvanced()

  const rows = table?.getRowModel()

  return (
    <TableBodyUi
      className={clsx('relative', isPending && 'after:select-none after:absolute after:inset-0 after:bg-accent/25')}
    >
      {isLoading ? (
        <TableRow>
          <TableCell colSpan={columns?.length} className='h-60 text-center'>
            Loading...
          </TableCell>
        </TableRow>
      ) : (
        <>
          {rows?.rows?.length ? (
            rows.rows.map((row) => (
              <TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      width: cell.column.columnDef.size,
                      minWidth: cell.column.columnDef.minSize,
                      maxWidth:
                        Number.MAX_SAFE_INTEGER === cell.column.columnDef.maxSize
                          ? undefined
                          : cell.column.columnDef.maxSize,
                    }}
                    className='whitespace-break-spaces'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns?.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </>
      )}
    </TableBodyUi>
  )
}
