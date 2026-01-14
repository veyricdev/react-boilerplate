import { useState } from 'react'
import { Card } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import { getFileIcon } from './file-icon'
import type { FileSystemItem } from './types'

interface FileCardProps {
  item: FileSystemItem
  selected: boolean
  selectedItems: FileSystemItem[]
  onSelect: (multi: boolean) => void
  onNavigate: () => void
  onMove: (itemId: string, targetFolderId: string) => void
  onUpload: (files: FileList | null, targetId?: string) => void
  onOpen?: (item: FileSystemItem) => void
}

export function FileCard({
  item,
  selected,
  selectedItems,
  onSelect,
  onNavigate,
  onMove,
  onUpload,
  onOpen,
}: FileCardProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    if (item.type === 'folder') {
      e.preventDefault() // Allow drop
      e.stopPropagation()
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    // Check if dropping a file or an internal item
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (item.type === 'folder') {
        onUpload(e.dataTransfer.files, item.id)
      }
    } else {
      const sourceId = e.dataTransfer.getData('app/file-manager-id')
      if (sourceId && item.type === 'folder' && sourceId !== item.id) {
        onMove(sourceId, item.id)
      }
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (!selected) {
      onSelect(false)
    }

    const currentSelectedItems = selected
      ? selectedItems
      : // If not selected yet (but currently being selected by drag start), we treat it as single item list for now
        // because selectedItems prop is from previous render.
        // However, we just called onSelect(false), so intent is single item.
        [item]

    const count = currentSelectedItems.length

    if (count > 0) {
      const container = document.createElement('div')
      // Container needs to be large enough to hold the stack
      container.style.width = '200px'
      container.style.height = '200px'
      container.style.position = 'absolute'
      container.style.top = '-1000px'
      container.style.zIndex = '9999'

      // We will stack up to 3 items
      // The last item in the list should be on top (visually), or the first?
      // Usually the dragged item is on top. Since we don't know easily which one is "dragged" within the set (it's 'item'),
      // let's put 'item' on top, and others behind.

      const itemsToShow = [item, ...currentSelectedItems.filter((i) => i.id !== item.id)].slice(0, 3).reverse()

      itemsToShow.forEach((stackItem, index) => {
        const offset = index * 4 // visual offset
        const div = document.createElement('div')
        div.className =
          'flex flex-col items-center bg-background border border-border shadow-2xl rounded-lg p-2 w-32 h-32 absolute'
        div.style.bottom = `${offset}px`
        div.style.left = `${offset}px` // Stack diagonally
        div.style.zIndex = (index + 1).toString()

        const iconDiv = document.createElement('div')
        iconDiv.className = 'w-16 h-16 mb-2 flex items-center justify-center'
        const isImage = stackItem.type === 'image' && stackItem.thumbnailUrl
        if (isImage) {
          iconDiv.innerHTML = `<img src="${stackItem.thumbnailUrl}" class="w-16 h-16 object-cover rounded-md shadow-sm" />`
        } else {
          iconDiv.innerHTML = `<span style="font-size: 32px">📄</span>`
        }
        div.appendChild(iconDiv)

        // Only show text on the top card to simplify
        if (index === itemsToShow.length - 1) {
          const text = document.createElement('p')
          text.className = 'text-xs font-medium text-center truncate w-full'
          text.innerText = stackItem.name
          div.appendChild(text)
        }

        container.appendChild(div)
      })

      // Add badge if multiple
      if (count > 1) {
        const badge = document.createElement('div')
        badge.className =
          'absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md border-2 border-white z-50'
        badge.innerText = count.toString()
        container.appendChild(badge)
        // Adjust badge position relative to the stack
        badge.style.right = '40px' // approximated
        badge.style.top = '10px'
      }

      document.body.appendChild(container)
      e.dataTransfer.setDragImage(container, 80, 80)
      setTimeout(() => document.body.removeChild(container), 20)
    }

    e.dataTransfer.setData('app/file-manager-id', item.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'group relative flex flex-col items-center justify-between p-4 cursor-pointer transition-all hover:shadow-md border-transparent hover:border-gray-200 dark:hover:border-gray-700',
        selected &&
          'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-950',
        isDragOver && 'border-primary bg-primary/20 scale-105 shadow-xl ring-2 ring-primary'
      )}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(e.ctrlKey || e.metaKey)
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        if (item.type === 'folder') {
          onNavigate()
        } else {
          onOpen?.(item)
        }
      }}
    >
      <div className='w-16 h-16 mb-3 flex items-center justify-center transition-transform group-hover:scale-110'>
        {item.type === 'image' && item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.name}
            className='w-16 h-16 object-cover rounded-md shadow-sm pointer-events-none'
          />
        ) : (
          getFileIcon(item.type, 'w-12 h-12')
        )}
      </div>

      <div className='text-center w-full'>
        <p className='text-sm font-medium truncate w-full' title={item.name}>
          {item.name}
        </p>
        <p className='text-xs text-muted-foreground mt-1'>
          {item.size ? `${(item.size / 1024).toFixed(1)} KB` : item.type === 'folder' ? 'Folder' : ''}
        </p>
      </div>
    </Card>
  )
}
