import { FolderOpen } from 'lucide-react'
import { useState, type DragEvent } from 'react'

import { ContextMenu, ContextMenuTrigger } from '~/components/ui/context-menu'
import { cn } from '~/lib/utils'
import { formatBytes } from '~/utils/helpers'

import { useFileManager } from '.'
import ContextMenuContent from './context-menu-content'
import { getFilePreview, getKey, prefixPath } from './helpers'

import type { FileItem } from './type'

export default function ContentGridView() {
  const { files } = useFileManager()

  const { openFolder, fileSelected, setFileSelected, dragUploadState, setDragUploadState } = useFileManager()
  const [itemDrag, setItemDrag] = useState<FileItem | null>(null)

  const handleItemDragStart = (e: DragEvent<HTMLElement>, file: FileItem) => {
    setItemDrag(file)

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', file.id)
    }
  }

  const handleItemDragEnd = () => {
    setItemDrag(null)
  }

  const handleItemDragEnter = (e: DragEvent<HTMLElement>, file: FileItem) => {
    e.preventDefault()
    e.stopPropagation()

    setDragUploadState((prev) => ({
      ...prev,
      isDragging: true,
      isMove: true,
      id: file.id,
      path: prefixPath(file.path),
    }))
  }

  const handleItemDragOver = (e: DragEvent<HTMLElement>, file: FileItem) => {
    e.preventDefault()
    e.stopPropagation()
    const itemDrag = document.querySelector('[data-item-id]')

    if (!file.isFolder) e.dataTransfer.dropEffect = 'none'

    if (itemDrag) {
      const itemDragId = itemDrag.getAttribute('data-item-id')
      if (itemDragId === file.id) e.dataTransfer.dropEffect = 'none'
    }
  }

  const handleItemDragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget.contains(e.relatedTarget as Node)) return

    setDragUploadState((prev) => ({ ...prev, isMove: false, id: '', path: null }))
  }

  const handleItemDrop = (e: DragEvent<HTMLElement>, file: FileItem) => {
    e.preventDefault()
    e.stopPropagation()

    console.log(itemDrag, file)
    setDragUploadState((prev) => ({ ...prev, isDragging: false, isMove: false, id: '', path: null }))
  }

  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(125px,1fr))]'>
      {files?.map((file) => (
        <ContextMenu key={getKey(file)}>
          <ContextMenuTrigger asChild>
            <div
              className={cn(
                'flex flex-col items-center rounded-lg border p-4 transition-colors data-[file=true]:cursor-not-allowed data-[dragging=true]:border-dashed data-[dragging=true]:border-ring data-[file=true]:border-destructive data-[item-id]:border-destructive',
                fileSelected?.id === file.id ? 'bg-ring/25' : 'hover:bg-accent/10'
              )}
              title={file.name}
              onClick={() => setFileSelected(file)}
              onDoubleClick={() => file.isFolder && openFolder(file)}
              onDragEnter={(e) => handleItemDragEnter(e, file)}
              onDragLeave={handleItemDragLeave}
              onDragOver={(e) => handleItemDragOver(e, file)}
              onDrop={(e) => handleItemDrop(e, file)}
              onDragStart={(e) => handleItemDragStart(e, file)}
              onDragEnd={handleItemDragEnd}
              data-item-id={itemDrag?.id === file.id ? itemDrag.id : undefined}
              data-item-path={itemDrag?.id === file.id ? prefixPath(itemDrag.path) : undefined}
              data-dragging={
                (dragUploadState.isDragging && dragUploadState.isMove && file.id === dragUploadState.id) || undefined
              }
              data-file={
                (dragUploadState.isDragging &&
                  dragUploadState.isMove &&
                  !file.isFolder &&
                  file.id === dragUploadState.id) ||
                undefined
              }
              draggable
            >
              <div className='mb-2 flex h-12 w-12 items-center justify-center'>
                {file.isFolder ? (
                  <FolderOpen className='h-10 w-10 text-blue-500' />
                ) : (
                  getFilePreview({ file: { type: file.type!, name: file.name, url: file.url } })
                )}
              </div>
              <span className='w-full truncate text-center text-sm font-medium'>{file.name}</span>
              <span className='text-muted-foreground text-xs'>{file.isFolder ? '' : formatBytes(file.size!)}</span>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent item={file} />
        </ContextMenu>
      ))}
    </div>
  )
}
