import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { CardAction } from '~/components/ui/card'
import { cn } from '~/lib/utils'

import ButtonCreateFolder from './button-create-folder'
import ButtonUploadFile from './button-upload-file'

export default function ActionDock() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <CardAction className='relative'>
      <Button
        size='icon'
        className={cn(
          'bg-primary hover:bg-primary/50 size-10 rounded-full shadow-lg transition-transform duration-200',
          isExpanded && 'rotate-45 bg-secondary hover:bg-secondary/50'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        title='Toggle Actions'
      >
        <Plus className='size-4' />
        <span className='sr-only'>Toggle Actions</span>
      </Button>
      {/* Action buttons - positioned above the main button */}
      <div
        className={cn(
          'absolute right-0 top-14 flex flex-col-reverse gap-3 transition-all duration-300 ease-in-out',
          isExpanded ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-10 opacity-0'
        )}
      >
        <ButtonUploadFile />
        <ButtonCreateFolder />
      </div>
    </CardAction>
  )
}
