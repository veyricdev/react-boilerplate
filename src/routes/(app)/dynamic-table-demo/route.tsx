import { createFileRoute } from '@tanstack/react-router'
import type { RowSelectionState } from '@tanstack/react-table'
import { useState } from 'react'
import { DynamicTable } from '~/components/shared/dynamic-table'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { columns, type Payment } from './-columns'

export const Route = createFileRoute('/(app)/dynamic-table-demo')({
  component: RouteComponent,
})

const initialData: Payment[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@example.com',
  },
  {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'Abe45@example.com',
  },
  {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    email: 'Silas22@example.com',
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
]

function RouteComponent() {
  const [data, setData] = useState(initialData)
  const [emailFilter, setEmailFilter] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const selectedCount = Object.keys(rowSelection).length

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedCount} selected items?`)) {
      alert('Deleted!')
      setRowSelection({})
      setData(data.filter((item) => !rowSelection[item.id]))
    }
  }

  return (
    <div className='container mx-auto py-10 w-full space-y-12'>
      <h1 className='text-3xl font-bold'>Demo Dynamic Table</h1>

      {/* Example 1: Full featured table */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>1. Full Featured Table</h2>
        <p className='text-muted-foreground'>
          All features enabled: sorting, filtering, pagination, row selection, column visibility
        </p>
        <DynamicTable
          columns={columns}
          data={data}
          features={{
            enableSorting: true,
            enableFiltering: true,
            enableColumnVisibility: true,
            enableRowSelection: true,
            enablePagination: true,
          }}
          stateHandlers={{
            rowSelection,
            onRowSelectionChange: setRowSelection,
          }}
          customization={{
            showToolbar: true,
            toolbarContent: (
              <div className='flex items-center gap-2'>
                <Input
                  placeholder='Filter emails...'
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                  className='max-w-sm h-8'
                />
                {selectedCount > 0 && (
                  <Button variant='destructive' size='sm' onClick={handleDelete} className='h-8'>
                    Delete ({selectedCount})
                  </Button>
                )}
              </div>
            ),
            pageSizeOptions: [5, 10, 20],
          }}
          getRowId={(row) => row.id}
        />
      </section>

      {/* Example 2: Simple table without pagination */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>2. Simple Table (No Pagination)</h2>
        <p className='text-muted-foreground'>Basic table with sorting only, no pagination</p>
        <DynamicTable
          columns={columns}
          data={data}
          features={{
            enableSorting: true,
            enableFiltering: false,
            enableColumnVisibility: false,
            enableRowSelection: false,
            enablePagination: false,
          }}
          customization={{
            showToolbar: false,
          }}
        />
      </section>

      {/* Example 3: Table with custom empty state */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>3. Custom Empty State</h2>
        <p className='text-muted-foreground'>Example with custom empty component</p>
        <DynamicTable
          columns={columns}
          data={[]}
          features={{
            enablePagination: false,
          }}
          customization={{
            showToolbar: false,
            emptyComponent: (
              <div className='flex flex-col items-center gap-2'>
                <span className='text-4xl'>📭</span>
                <span className='text-lg font-medium'>No payments found</span>
                <Button size='sm' variant='outline'>
                  Add your first payment
                </Button>
              </div>
            ),
          }}
        />
      </section>
    </div>
  )
}
