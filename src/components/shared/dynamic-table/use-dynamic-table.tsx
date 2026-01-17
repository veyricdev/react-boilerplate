import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Table,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { Checkbox } from '~/components/ui/checkbox'
import type { TableFeatures, TableInitialState, TableStateHandlers } from './dynamic-table'

interface UseDynamicTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  features: TableFeatures
  initialState?: TableInitialState
  stateHandlers?: TableStateHandlers
  getRowId?: (row: TData, index: number) => string
}

export function useDynamicTable<TData, TValue>({
  data,
  columns,
  features,
  initialState,
  stateHandlers,
  getRowId,
}: UseDynamicTableProps<TData, TValue>): Table<TData> {
  // Internal state (used when not controlled)
  const [internalSorting, setInternalSorting] = useState<SortingState>(initialState?.sorting ?? [])
  const [internalColumnFilters, setInternalColumnFilters] = useState<ColumnFiltersState>(
    initialState?.columnFilters ?? []
  )
  const [internalColumnVisibility, setInternalColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility ?? {}
  )
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>(initialState?.rowSelection ?? {})
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    initialState?.pagination ?? { pageIndex: 0, pageSize: 10 }
  )

  // Determine if state is controlled or internal
  const sorting = stateHandlers?.sorting ?? internalSorting
  const columnFilters = stateHandlers?.columnFilters ?? internalColumnFilters
  const columnVisibility = stateHandlers?.columnVisibility ?? internalColumnVisibility
  const rowSelection = stateHandlers?.rowSelection ?? internalRowSelection
  const pagination = stateHandlers?.pagination ?? internalPagination

  // Handle state changes
  const handleSortingChange = (updater: SortingState | ((prev: SortingState) => SortingState)) => {
    const newValue = typeof updater === 'function' ? updater(sorting) : updater
    if (stateHandlers?.onSortingChange) {
      stateHandlers.onSortingChange(newValue)
    } else {
      setInternalSorting(newValue)
    }
  }

  const handleColumnFiltersChange = (
    updater: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)
  ) => {
    const newValue = typeof updater === 'function' ? updater(columnFilters) : updater
    if (stateHandlers?.onColumnFiltersChange) {
      stateHandlers.onColumnFiltersChange(newValue)
    } else {
      setInternalColumnFilters(newValue)
    }
  }

  const handleColumnVisibilityChange = (updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => {
    const newValue = typeof updater === 'function' ? updater(columnVisibility) : updater
    if (stateHandlers?.onColumnVisibilityChange) {
      stateHandlers.onColumnVisibilityChange(newValue)
    } else {
      setInternalColumnVisibility(newValue)
    }
  }

  const handleRowSelectionChange = (updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => {
    const newValue = typeof updater === 'function' ? updater(rowSelection) : updater
    if (stateHandlers?.onRowSelectionChange) {
      stateHandlers.onRowSelectionChange(newValue)
    } else {
      setInternalRowSelection(newValue)
    }
  }

  const handlePaginationChange = (updater: PaginationState | ((prev: PaginationState) => PaginationState)) => {
    const newValue = typeof updater === 'function' ? updater(pagination) : updater
    if (stateHandlers?.onPaginationChange) {
      stateHandlers.onPaginationChange(newValue)
    } else {
      setInternalPagination(newValue)
    }
  }

  // Inject selection column if enabled
  const tableColumns = useMemo(() => {
    if (features.enableRowSelection) {
      return [
        {
          id: 'select',
          header: ({ table }) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label='Select all'
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label='Select row'
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        ...columns,
      ] as ColumnDef<TData, TValue>[]
    }
    return columns
  }, [columns, features.enableRowSelection])

  const table = useReactTable({
    data,
    columns: tableColumns,
    getRowId,

    // Feature toggles
    enableSorting: features.enableSorting,
    enableFilters: features.enableFiltering,
    enableHiding: features.enableColumnVisibility,
    enableRowSelection: features.enableRowSelection,
    enableMultiRowSelection: features.enableMultiRowSelection,

    // State handlers
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: handleRowSelectionChange,
    onPaginationChange: handlePaginationChange,

    // Row models
    getCoreRowModel: getCoreRowModel(),
    ...(features.enableSorting && { getSortedRowModel: getSortedRowModel() }),
    ...(features.enableFiltering && { getFilteredRowModel: getFilteredRowModel() }),
    ...(features.enablePagination && { getPaginationRowModel: getPaginationRowModel() }),

    // State
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  return table
}
