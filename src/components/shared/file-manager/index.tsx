import React, { useRef, useState } from 'react'
import { cn } from '~/lib/utils'
import { FileList } from './file-list'
import { FileSidebar } from './file-sidebar'
import { FileToolbar } from './file-toolbar'
import type { FileSystemItem } from './types'
import { useFileManager } from './use-file-manager'

interface FileManagerProps {
  className?: string
  onSelectionChange?: (items: FileSystemItem[]) => void
  onFileOpen?: (item: FileSystemItem) => void
}

export default function FileManager({ className, onSelectionChange, onFileOpen }: FileManagerProps) {
  const {
    items, // Need all items to map selection
    currentItems,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,

    // Actions
    navigateTo,
    navigateUp,
    createFolder,
    deleteItems,
    renameItem,
    handleUpload,
    moveItem,

    // Selection
    selectedItemIds,
    toggleSelection,

    // State
    currentFolder,
    breadcrumbs,
  } = useFileManager()

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      const selected = items.filter((i) => selectedItemIds.has(i.id))
      onSelectionChange(selected)
    }
  }, [selectedItemIds, items, onSelectionChange])

  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Ignore internal drags
    if (Array.from(e.dataTransfer.types).includes('app/file-manager-id')) {
      return
    }

    dragCounter.current += 1
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Ignore internal drags
    if (Array.from(e.dataTransfer.types).includes('app/file-manager-id')) {
      return
    }

    dragCounter.current -= 1
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    // Only handle OS files here
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const isInternalDrag = Array.from(e.dataTransfer.types).includes('app/file-manager-id')
      if (!isInternalDrag) {
        // If we are dropping on the container (not a folder), handleUpload
        handleUpload(e.dataTransfer.files)
      }
    }
  }

  return (
    <div
      className={cn('flex bg-background h-[calc(100vh-4rem)] border rounded-lg overflow-hidden shadow-sm', className)}
    >
      <FileSidebar />

      <div
        className='flex-1 flex flex-col min-w-0 relative'
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <FileToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          breadcrumbs={breadcrumbs}
          onNavigate={navigateTo}
          onNavigateUp={navigateUp}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onDelete={() => deleteItems(Array.from(selectedItemIds))}
          onCreateFolder={() => {
            const name = prompt('Folder name?')
            if (name) createFolder(name)
          }}
          onRename={() => {
            if (selectedItemIds.size !== 1) return
            const id = Array.from(selectedItemIds)[0]
            const item = currentItems.find((i) => i.id === id)
            if (!item) return
            const newName = prompt('New name?', item.name)
            if (newName && newName !== item.name) {
              renameItem(id, newName)
            }
          }}
          onUpload={handleUpload}
          canGoUp={!!currentFolder.parentId}
          selectedCount={selectedItemIds.size}
        />

        <div
          className={cn(
            'flex-1 overflow-auto bg-muted/5 relative transition-colors',
            isDragging && 'bg-primary/5 ring-2 ring-inset ring-primary'
          )}
        >
          <FileList
            items={currentItems}
            viewMode={viewMode}
            selectedIds={selectedItemIds}
            onSelect={toggleSelection}
            onNavigate={navigateTo}
            onMove={moveItem}
            onUpload={handleUpload}
            onOpen={onFileOpen}
          />
        </div>
      </div>
    </div>
  )
}
