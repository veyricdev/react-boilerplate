import TableAdvanced from '~/components/shared/table-advanced'
import type { TableAdvancedProps } from '~/components/shared/table-advanced/type'
import axiosClient from '~/lib/axios'

import { columns, type User } from './columns'

const getUsers = async (): Promise<User[]> => {
  return await axiosClient.get('https://jsonplaceholder.typicode.com/users')
}

export default function TableAdvancedPage() {
  const loadData: TableAdvancedProps<User>['dataRequest'] = async () => {
    const data = await getUsers()
    return { list: data }
  }
  return <TableAdvanced headerTitle='Users' columns={columns} dataRequest={loadData}></TableAdvanced>
}
