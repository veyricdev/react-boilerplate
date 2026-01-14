import { useState } from 'react'
import { cn } from '~/lib/utils'
import { getFileIcon } from './file-icon'
import type { FileSystemItem } from './types'

// Using Intl.DateTimeFormat instead.

interface FileRowProps {
  item: FileSystemItem
  selected: boolean
  selectedItems: FileSystemItem[]
  onSelect: (multi: boolean) => void
  onNavigate: () => void
  onMove: (itemId: string, targetFolderId: string) => void
  onUpload: (files: FileList | null, targetId?: string) => void
  onOpen?: (item: FileSystemItem) => void
}

export function FileRow({
  item,
  selected,
  selectedItems,
  onSelect,
  onNavigate,
  onMove,
  onUpload,
  onOpen,
}: FileRowProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  }

  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    if (item.type === 'folder') {
      e.preventDefault() // Allow drop
      e.stopPropagation()
      setIsDragOver(true)
    }
  }

  const handleDragLeave = () => {
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

    const currentSelectedItems = selected ? selectedItems : [item]
    const count = currentSelectedItems.length

    if (count > 0) {
      const container = document.createElement('div')
      container.style.width = '300px'
      container.style.height = '100px' // approximated
      container.style.position = 'absolute'
      container.style.top = '-1000px'
      container.style.zIndex = '9999'

      const itemsToShow = [item, ...currentSelectedItems.filter((i) => i.id !== item.id)].slice(0, 3).reverse()

      itemsToShow.forEach((stackItem, index) => {
        const offset = index * 4
        const div = document.createElement('div')
        div.className =
          'flex items-center bg-background border border-border shadow-2xl rounded-md p-2 w-[300px] absolute'
        div.style.bottom = `${offset}px`
        div.style.left = `${offset}px`
        div.style.zIndex = (index + 1).toString()

        const iconSpan = document.createElement('span')
        iconSpan.style.fontSize = '24px'
        iconSpan.style.marginRight = '12px'
        iconSpan.innerText = '📄'
        div.appendChild(iconSpan)

        // Show name only for top item
        if (index === itemsToShow.length - 1) {
          const text = document.createElement('span')
          text.className = 'text-sm font-medium truncate flex-1'
          text.innerText = stackItem.name
          div.appendChild(text)
        } else {
          // For background items, just empty box or reduced content
          div.style.height = '40px' // Collapsed state?
          div.style.opacity = '0.9'
        }

        container.appendChild(div)
      })

      if (count > 1) {
        const badge = document.createElement('div')
        badge.className =
          'absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md z-50'
        badge.innerText = count.toString()
        container.appendChild(badge)
        badge.style.right = '-10px'
        badge.style.top = '0px'
      }

      document.body.appendChild(container)
      e.dataTransfer.setDragImage(container, 150, 20)
      setTimeout(() => document.body.removeChild(container), 20)
    }

    e.dataTransfer.setData('app/file-manager-id', item.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex items-center p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors group',
        selected && 'bg-accent text-accent-foreground',
        isDragOver && 'border border-primary bg-primary/20'
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
      <div className='shrink-0 mr-4'>{getFileIcon(item.type, 'w-6 h-6')}</div>

      <div className='flex-1 min-w-0 grid grid-cols-12 gap-4 items-center'>
        <div className='col-span-6 font-medium truncate select-none'>{item.name}</div>
        <div className='col-span-3 text-sm text-muted-foreground select-none'>{formatDate(item.updatedAt)}</div>
        <div className='col-span-3 text-sm text-muted-foreground text-right select-none'>
          {item.size ? `${(item.size / 1024).toFixed(1)} KB` : '--'}
        </div>
      </div>
    </div>
  )
}
