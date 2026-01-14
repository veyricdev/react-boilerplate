import { FileCard } from './file-card'
import { FileRow } from './file-row'
import type { FileSystemItem, ViewMode } from './types'

interface FileListProps {
  items: FileSystemItem[]
  viewMode: ViewMode
  selectedIds: Set<string>
  onSelect: (id: string, multi: boolean) => void
  onNavigate: (id: string) => void
  onMove: (itemId: string, targetFolderId: string) => void
  onUpload: (files: FileList | null, targetId?: string) => void
  onOpen?: (item: FileSystemItem) => void
}

export function FileList({
  items,
  viewMode,
  selectedIds,
  onSelect,
  onNavigate,
  onMove,
  onUpload,
  onOpen,
}: FileListProps) {
  if (items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-muted-foreground'>
        <p>No files found</p>
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4'>
        {items.map((item) => (
          <FileCard
            key={item.id}
            item={item}
            selected={selectedIds.has(item.id)}
            selectedItems={items.filter((i) => selectedIds.has(i.id))}
            onSelect={(multi) => onSelect(item.id, multi)}
            onNavigate={() => onNavigate(item.id)}
            onMove={onMove}
            onUpload={onUpload}
            onOpen={onOpen}
          />
        ))}
      </div>
    )
  }

  return (
    <div className='flex flex-col p-4 space-y-1'>
      <div className='flex px-2 py-2 text-sm font-medium text-muted-foreground border-b mb-2'>
        <div className='w-10 mr-4'></div>
        <div className='flex-1 grid grid-cols-12 gap-4'>
          <div className='col-span-6'>Name</div>
          <div className='col-span-3'>Date Modified</div>
          <div className='col-span-3 text-right'>Size</div>
        </div>
      </div>
      {items.map((item) => (
        <FileRow
          key={item.id}
          item={item}
          selected={selectedIds.has(item.id)}
          selectedItems={items.filter((i) => selectedIds.has(i.id))}
          onSelect={(multi) => onSelect(item.id, multi)}
          onNavigate={() => onNavigate(item.id)}
          onMove={onMove}
          onUpload={onUpload}
          onOpen={onOpen}
        />
      ))}
    </div>
  )
}
