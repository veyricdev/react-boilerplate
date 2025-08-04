import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type VisibilityState,
} from '@tanstack/react-table'
import qs from 'qs'
import { useCallback, useMemo, useRef, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router'

import { Checkbox } from '~/components/ui/checkbox'
import { isAsyncFunction, isFunction } from '~/utils/is'

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './constant'

import type { TableAdvancedProps } from './type'

export const useTable = <TData extends Recordable>({
  initialData,
  columns,
  pageSize = DEFAULT_PAGE_SIZE,
  totalPage = DEFAULT_PAGE,
  rowKey = 'id',
  enablePagination = true,
  enableSelectionRow = true,
  dataRequest,
  searchSchema,
  columnsVisibility,
}: TableAdvancedProps<TData>) => {
  const [isPending, startTransition] = useTransition()
  const [searchParams, setSearchParams] = useSearchParams()
  const hasPromised = useRef(false)

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(() => initialData ?? [])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    (columnsVisibility ?? {}) as VisibilityState
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pageCount, setPageCount] = useState(totalPage)

  const page = Number(searchParams.get('page')) || DEFAULT_PAGE
  const limit = Number(searchParams.get('limit')) || pageSize
  const isDisabled = isPending || isLoading

  const isDataRequest = useMemo(
    () => Object.is(initialData, undefined) && (isFunction(dataRequest) || isAsyncFunction(dataRequest)),
    [dataRequest, initialData]
  )

  const fetchData = useCallback(() => {
    if (hasPromised.current) return setIsLoading(false)

    startTransition(async () => {
      if (isDataRequest) {
        hasPromised.current = true
        let queryParams = {
          page,
          limit,
        }
        if (searchSchema) {
          const searchParamsStripped = searchSchema?.safeParse(qs.parse(searchParams.toString()))
          if (searchParamsStripped.success) queryParams = { ...queryParams, ...searchParamsStripped.data }
        }

        const data = await dataRequest!(queryParams).finally(() => {
          if (isLoading) setIsLoading(false)
          hasPromised.current = false
        })

        if (Array.isArray(data?.list)) {
          setData(data!.list)
        } else if (Array.isArray(data)) {
          setData(data)
        } else {
          setData([])
        }

        if (enablePagination && data.pagination) {
          const { size, total } = data.pagination

          setPageCount(Math.ceil(total / size))
        }
      } else {
        if (isLoading) setIsLoading(false)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRequest, enablePagination, initialData, limit, page, searchParams])

  const reload = useCallback(() => {
    if (isDataRequest) {
      fetchData()
    }
  }, [fetchData, isDataRequest])

  const columnsInner: ColumnDef<TData>[] = useMemo(() => {
    try {
      const clm = [...columns]

      if (enableSelectionRow) {
        clm.unshift({
          id: 'select',
          header: ({ table }) => (
            <div className='flex items-center justify-center'>
              <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
              />
            </div>
          ),
          cell: ({ row }) => (
            <div className='flex items-center justify-center'>
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
              />
            </div>
          ),
          size: 40,
          enableSorting: false,
          enableHiding: false,
        })
      }

      return clm
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return []
    }
  }, [columns, enableSelectionRow])

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columnsInner.map((column) => {
      if (typeof column.id === 'string') return column.id
      // @ts-expect-error: accessorKey may exist on some column types
      if (typeof column.accessorKey === 'string') return column.accessorKey
      throw new Error('Each column must have either an id or accessorKey')
    })
  )

  const table = useReactTable({
    data,
    columns: columnsInner,
    state: {
      rowSelection,
      columnVisibility,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
      columnOrder,
    },
    getRowId: (row) => row[rowKey] as string, //required because row indexes will change
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const haveSearchParamsLimit = searchParams.get('limit')
      if (typeof updater === 'function') {
        const newPaginationState = updater({
          pageIndex: page - 1,
          pageSize: limit,
        })
        setSearchParams({
          page: (newPaginationState.pageIndex + 1).toString(),
          limit: (newPaginationState.pageSize === pageSize && !haveSearchParamsLimit
            ? ''
            : newPaginationState.pageSize
          )?.toString(),
        })
      } else {
        // Handle direct state object if needed (less common for pagination change)
        setSearchParams({
          page: (updater.pageIndex + 1).toString(),
          limit: (updater.pageSize === pageSize && !haveSearchParamsLimit ? '' : updater.pageSize).toString(),
        })
      }
    },
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  })

  return {
    isDisabled,
    reload,
    fetchData,
    table,
    columnsInner,
    isLoading,
    isPending,
    rowSelection,
    columnOrder,
    setColumnOrder,
  } as const
}
