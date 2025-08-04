import type { Columns } from '~/components/shared/table-advanced/type'

import TableColumnAction from './table-column-action'

export type User = {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export const columns: Columns<User> = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return row.original.id
    },
    minSize: 50,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return row.original.name
    },
    minSize: 150,
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => {
      return row.original.username
    },
    minSize: 150,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return row.original.email
    },
    minSize: 150,
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => {
      return row.original.phone
    },
    minSize: 150,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      return `${row.original.address.city}, ${row.original.address.street}`
    },
    minSize: 150,
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 40,
    cell: ({ row }) => <TableColumnAction id={row.original.id} />,
  },
]
