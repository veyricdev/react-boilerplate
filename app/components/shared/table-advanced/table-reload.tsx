import { RotateCcw } from 'lucide-react'

import { Button } from '~/components/ui/button'

import { useTableAdvanced } from '.'

export default function TableReload() {
  const { reload } = useTableAdvanced()

  return (
    <Button
      onClick={reload}
      variant='ghost'
      size='sm'
      className='ml-auto flex items-center justify-center has-[>svg]:px-2'
      title='Reload'
    >
      <RotateCcw size={16} />
    </Button>
  )
}
