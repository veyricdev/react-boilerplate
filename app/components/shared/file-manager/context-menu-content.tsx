import { Clipboard, ClipboardCopy, Copy, Download, Edit, Eye, RotateCcw, Scissors, Trash2 } from 'lucide-react'

import {
  ContextMenuContent as ContextMenuContentUi,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '~/components/ui/context-menu'
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import { cn } from '~/lib/utils'

import type { FileItem } from './type'
import type { ComponentProps } from 'react'

type ContextMenuContentProps = ComponentProps<typeof ContextMenuContentUi> & {
  container?: boolean
  item?: FileItem
}

export default function ContextMenuContent({ container, item, className, ...props }: ContextMenuContentProps) {
  const [_, copy] = useCopyToClipboard()

  return (
    <ContextMenuContentUi className={cn('w-52', className)} {...props}>
      {container && (
        <ContextMenuItem>
          <RotateCcw className='mr-2 h-4 w-4' />
          Reload
        </ContextMenuItem>
      )}

      {container || (
        <>
          <ContextMenuItem>
            <Eye className='mr-2 h-4 w-4' />
            Preview
            <ContextMenuShortcut className='ml-auto'>⌘O</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <Edit className='mr-2 h-4 w-4' />
            Rename
            <ContextMenuShortcut className='ml-auto'>F2</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <Copy className='mr-2 h-4 w-4' />
            Copy
            <ContextMenuShortcut className='ml-auto'>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          {item?.url && (
            <ContextMenuItem onClick={() => copy(item.url!, true)}>
              <ClipboardCopy className='mr-2 h-4 w-4' />
              Copy URL
            </ContextMenuItem>
          )}
          <ContextMenuItem>
            <Scissors className='mr-2 h-4 w-4' />
            Cut
            <ContextMenuShortcut className='ml-auto'>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
        </>
      )}
      <ContextMenuItem>
        <Clipboard className='mr-2 h-4 w-4' />
        Paste
        <ContextMenuShortcut className='ml-auto'>⌘V</ContextMenuShortcut>
      </ContextMenuItem>
      {container || (
        <>
          {item?.url && (
            <ContextMenuItem asChild>
              <a href={item.url} target='_blank' download rel='noopener noreferrer'>
                <Download className='mr-2 h-4 w-4' />
                Download
              </a>
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem className='text-destructive focus:text-destructive'>
            <Trash2 className='mr-2 h-4 w-4 text-inherit' />
            Delete
            <ContextMenuShortcut className='ml-auto'>Del</ContextMenuShortcut>
          </ContextMenuItem>
        </>
      )}
    </ContextMenuContentUi>
  )
}
