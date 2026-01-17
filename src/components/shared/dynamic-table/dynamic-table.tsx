import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { cn } from '~/lib/utils'
import { TablePagination } from './table-pagination'
import { DynamicTableToolbar } from './table-toolbar'
import { useDynamicTable } from './use-dynamic-table'

/**
 * Feature configuration for DynamicTable
 */
export interface TableFeatures {
  /** Enable sorting functionality */
  enableSorting?: boolean
  /** Enable column filtering */
  enableFiltering?: boolean
  /** Enable column visibility toggle */
  enableColumnVisibility?: boolean
  /** Enable row selection */
  enableRowSelection?: boolean
  /** Enable pagination */
  enablePagination?: boolean
  /** Enable multi-row selection (requires enableRowSelection) */
  enableMultiRowSelection?: boolean
}

/**
 * Initial state configuration for DynamicTable
 */
export interface TableInitialState {
  /** Initial sorting state */
  sorting?: SortingState
  /** Initial column filters */
  columnFilters?: ColumnFiltersState
  /** Initial column visibility */
  columnVisibility?: VisibilityState
  /** Initial row selection */
  rowSelection?: RowSelectionState
  /** Initial pagination state */
  pagination?: PaginationState
}

/**
 * Controlled state handlers for external state management
 */
export interface TableStateHandlers {
  /** Controlled sorting state */
  sorting?: SortingState
  /** Callback when sorting changes */
  onSortingChange?: (sorting: SortingState) => void
  /** Controlled column filters state */
  columnFilters?: ColumnFiltersState
  /** Callback when column filters change */
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  /** Controlled column visibility state */
  columnVisibility?: VisibilityState
  /** Callback when column visibility changes */
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  /** Controlled row selection state */
  rowSelection?: RowSelectionState
  /** Callback when row selection changes */
  onRowSelectionChange?: (selection: RowSelectionState) => void
  /** Controlled pagination state */
  pagination?: PaginationState
  /** Callback when pagination changes */
  onPaginationChange?: (pagination: PaginationState) => void
}

/**
 * Customization options for table appearance and behavior
 */
export interface TableCustomization {
  /** Custom empty state message */
  emptyMessage?: string
  /** Custom empty state component */
  emptyComponent?: React.ReactNode
  /** Custom class names */
  classNames?: {
    container?: string
    toolbar?: string
    table?: string
    header?: string
    headerRow?: string
    headerCell?: string
    body?: string
    row?: string
    cell?: string
  }
  /** Show toolbar (column visibility, etc.) */
  showToolbar?: boolean
  /** Custom toolbar content (left side) */
  toolbarContent?: React.ReactNode
  /** Page size options for pagination */
  pageSizeOptions?: number[]
}

export interface DynamicTableProps<TData, TValue> {
  /** Column definitions */
  columns: ColumnDef<TData, TValue>[]
  /** Table data */
  data: TData[]
  /** Feature flags */
  features?: TableFeatures
  /** Initial state */
  initialState?: TableInitialState
  /** Controlled state handlers */
  stateHandlers?: TableStateHandlers
  /** Customization options */
  customization?: TableCustomization
  /** Unique row ID accessor (for row selection) */
  getRowId?: (row: TData, index: number) => string
}

const defaultFeatures: TableFeatures = {
  enableSorting: true,
  enableFiltering: true,
  enableColumnVisibility: true,
  enableRowSelection: false,
  enablePagination: true,
  enableMultiRowSelection: true,
}

const defaultCustomization: TableCustomization = {
  emptyMessage: 'No results.',
  showToolbar: true,
  pageSizeOptions: [10, 20, 30, 40, 50],
}

export function DynamicTable<TData, TValue>({
  columns,
  data,
  features: featuresProp,
  initialState,
  stateHandlers,
  customization: customizationProp,
  getRowId,
}: DynamicTableProps<TData, TValue>) {
  const features = { ...defaultFeatures, ...featuresProp }
  const customization = { ...defaultCustomization, ...customizationProp }

  const table = useDynamicTable({
    data,
    columns,
    features,
    initialState: {
      ...initialState,
      pagination: {
        pageIndex: 0,
        pageSize: customization.pageSizeOptions?.[0] ?? 10,
        ...initialState?.pagination,
      },
    },
    stateHandlers,
    getRowId,
  })

  const showToolbar = !!(customization.showToolbar && (features.enableColumnVisibility || customization.toolbarContent))

  return (
    <div className={cn('overflow-hidden rounded-md border py-4', customization.classNames?.container)}>
      <DynamicTableToolbar
        table={table}
        showToolbar={showToolbar}
        enableColumnVisibility={features.enableColumnVisibility}
        className={customization.classNames?.toolbar}
      >
        {customization.toolbarContent}
      </DynamicTableToolbar>

      {/* Table */}
      <Table className={customization.classNames?.table}>
        <TableHeader className={customization.classNames?.header}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className={customization.classNames?.headerRow}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className={customization.classNames?.headerCell}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={customization.classNames?.body}>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={customization.classNames?.row}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={customization.classNames?.cell}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                {customization.emptyComponent ?? customization.emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {features.enablePagination && <TablePagination table={table} pageSizeOptions={customization.pageSizeOptions} />}
    </div>
  )
}
