import { Separator } from '~/components/ui/separator'

import { useTableAdvanced } from '.'
import ColumnSetting from './column-setting'
import TableReload from './table-reload'

import type { ComponentProps } from 'react'

export default function TableToolbar({ children, ...props }: ComponentProps<'div'>) {
  const { title } = useTableAdvanced()

  return (
    <div className='flex flex-wrap justify-between gap-y-2 px-0 py-4 max-sm:flex-col sm:p-4' {...props}>
      <div className='flex items-center justify-items-start text-base font-medium'>{title}</div>
      <div className='flex gap-2'>
        {children}
        <div className='flex items-center gap-0.5'>
          <Separator orientation='vertical' />
          <TableReload />
          <ColumnSetting />
        </div>
      </div>
    </div>
  )
}
