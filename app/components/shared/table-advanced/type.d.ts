import { ColumnDef, RowSelectionState, Table } from '@tanstack/react-table'
import { ReactNode } from 'react'
import { AnyZodObject } from 'zod'

export type PaginationResult = {
  page: number
  size: number
  total: number
}

export type LoadDataParams = { page?: number; limit?: number }
export type OnChangeCallbackParams<T> = Parameters<NonNullable<(val: T) => void>>

export type Columns<TData> = ColumnDef<TData, unknown>[] | ColumnDef<TData, unknown>[]

export type Toolbar<TData> = (table: Table<TData>, reload: () => void, rowSelection: RowSelectionState) => ReactNode

export type TableAdvancedProps<TData extends Recordable> = Readonly<{
  headerTitle?: string
  initialData?: TData[]
  columns: Columns<TData>
  pageSize?: number
  pageSizes?: number[]
  totalPage?: number
  rowKey?: keyof TData
  enablePagination?: boolean
  enableSelectionRow?: boolean
  columnsVisibility?: Partial<Record<keyof TData, boolean>>
  dataRequest?: (
    params?: LoadDataParams,
    onChangeParams?: OnChangeCallbackParams<TData>
  ) => Promise<{
    list: TData[]
    pagination?: PaginationResult
  }>
  toolbar?: Toolbar<TData>
  searchSchema?: AnyZodObject
}>
