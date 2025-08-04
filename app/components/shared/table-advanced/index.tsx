import { createContext, use, useEffect, type Dispatch, type SetStateAction } from 'react'

import { Table } from '~/components/ui/table'

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZES } from './constant'
import { TableBody } from './table-body'
import { TableHeader } from './table-header'
import TablePagination from './table-pagination'
import TableToolbar from './table-toolbar'
import { useTable } from './useTable'

import type { TableAdvancedProps } from './type'
import type { ColumnDef, Table as TableType } from '@tanstack/react-table'

type TableAdvanced<TData> = {
  reload: () => void
  title?: string
  table: TableType<TData>
  columnOrder: string[]
  setColumnOrder: Dispatch<SetStateAction<string[]>>
  isLoading: boolean
  isPending: boolean
  isDisabled: boolean
  columns: ColumnDef<TData>[]
}

const TableContext = createContext<TableAdvanced<any>>({} as TableAdvanced<any>)

export default function TableAdvanced<TData extends Recordable>({
  headerTitle,
  initialData,
  columns,
  pageSize = DEFAULT_PAGE_SIZE,
  pageSizes = DEFAULT_PAGE_SIZES,
  totalPage = DEFAULT_PAGE,
  rowKey = 'id',
  enablePagination = true,
  enableSelectionRow = true,
  dataRequest,
  toolbar,
  searchSchema,
  columnsVisibility,
}: TableAdvancedProps<TData>) {
  const {
    fetchData,
    isDisabled,
    reload,
    table,
    columnsInner,
    isLoading,
    isPending,
    rowSelection,
    columnOrder,
    setColumnOrder,
  } = useTable({
    initialData,
    columns,
    pageSize,
    totalPage,
    rowKey,
    enablePagination,
    enableSelectionRow,
    dataRequest,
    searchSchema,
    columnsVisibility,
  })

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <TableContext.Provider
      value={{
        reload,
        title: headerTitle,
        table,
        columnOrder,
        setColumnOrder,
        isPending,
        isLoading,
        isDisabled,
        columns: columnsInner,
      }}
    >
      <div className='relative'>
        <TableToolbar>{toolbar && toolbar(table, reload, rowSelection)}</TableToolbar>
        <Table className='min-w-4xl'>
          <TableHeader />
          <TableBody />
        </Table>
        <TablePagination pageSizes={pageSizes} enablePagination={enablePagination} />
      </div>
    </TableContext.Provider>
  )
}

export const useTableAdvanced = () => {
  const context = use(TableContext)
  if (!context) throw new Error('useTableAdvanced must be used within a TableAdvanced')

  return context
}
