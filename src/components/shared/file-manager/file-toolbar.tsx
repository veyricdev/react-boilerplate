import { ArrowUp, ChevronRight, Edit2, FolderPlus, Grid, LayoutList, Search, Trash2, Upload } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import type { FileSystemItem, ViewMode } from './types'

interface FileToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  breadcrumbs: FileSystemItem[]
  onNavigate: (id: string) => void
  onNavigateUp: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onDelete: () => void
  onCreateFolder: () => void
  onRename: () => void
  onUpload: (files: FileList | null) => void
  canGoUp: boolean
  selectedCount: number
}

export function FileToolbar({
  viewMode,
  onViewModeChange,
  breadcrumbs,
  onNavigate,
  onNavigateUp,
  searchQuery,
  onSearchChange,
  onDelete,
  onCreateFolder,
  onRename,
  onUpload,
  canGoUp,
  selectedCount,
}: FileToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='flex flex-col gap-4 border-b p-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2 flex-1'>
          <Button
            variant='ghost'
            size='icon'
            onClick={onNavigateUp}
            disabled={!canGoUp}
            title='Go up'
            className='shrink-0'
          >
            <ArrowUp className='w-4 h-4' />
          </Button>

          <div className='flex items-center text-sm breadcrumbs overflow-hidden min-w-0'>
            {breadcrumbs.length > 0 ? (
              breadcrumbs.map((item, index) => (
                <div key={item.id} className='flex items-center whitespace-nowrap overflow-hidden'>
                  {index > 0 && <ChevronRight className='w-4 h-4 text-muted-foreground mx-1 shrink-0' />}
                  <span
                    className={`cursor-pointer hover:underline truncate ${index === breadcrumbs.length - 1 ? 'font-semibold' : 'text-muted-foreground'}`}
                    onClick={() => onNavigate(item.id)}
                  >
                    {item.name}
                  </span>
                </div>
              ))
            ) : (
              <span className='font-semibold'>Root</span>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2 shrink-0'>
          <div className='relative w-full max-w-sm hidden md:block'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search...'
              className='pl-8 h-9'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className='h-6 w-px bg-border mx-2' />

          <div className='flex items-center border rounded-md p-1'>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size='icon'
              className='h-7 w-7'
              onClick={() => onViewModeChange('grid')}
              title='Grid View'
            >
              <Grid className='w-4 h-4' />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size='icon'
              className='h-7 w-7'
              onClick={() => onViewModeChange('list')}
              title='List View'
            >
              <LayoutList className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between gap-2 flex-wrap pb-1'>
        <div className='flex items-center gap-2 shrink-0'>
          <Button variant='outline' size='sm' onClick={onCreateFolder}>
            <FolderPlus className='w-4 h-4 mr-2' />
            New Folder
          </Button>
          <Button variant='outline' size='sm' onClick={() => fileInputRef.current?.click()}>
            <Upload className='w-4 h-4 mr-2' />
            Upload
          </Button>
          <input
            type='file'
            className='hidden'
            ref={fileInputRef}
            multiple
            onChange={(e) => {
              onUpload(e.target.files)
              e.target.value = '' // Reset so onChange triggers again for same file
            }}
          />
        </div>

        {selectedCount > 0 && (
          <div className='flex items-center gap-2 animate-in fade-in slide-in-from-right-5 duration-300 shrink-0'>
            <span className='text-sm text-muted-foreground mr-2'>{selectedCount} selected</span>
            {selectedCount === 1 && (
              <Button variant='outline' size='sm' onClick={onRename}>
                <Edit2 className='w-4 h-4 mr-2' />
                Rename
              </Button>
            )}
            <Button variant='destructive' size='sm' onClick={onDelete}>
              <Trash2 className='w-4 h-4 mr-2' />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
