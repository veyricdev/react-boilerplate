import { Folder } from 'lucide-react'
import { createContext, use, useState, type DragEvent } from 'react'
import { useSearchParams } from 'react-router'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { ContextMenu, ContextMenuTrigger } from '~/components/ui/context-menu'

import ActionDock from './action-dock'
import ContentGridView from './content-grid-view'
import ContentListView from './content-list-view'
import ContextMenuContent from './context-menu-content'
import FileSearch from './file-search'
import Footer from './footer'
import { prefixPath } from './helpers'
import PathBreadcrumb from './path-breadcrumb'

import type { DragUploadState, FileItem, FileManagerContextProps, ViewMode } from './type'

const FileManagerContext = createContext<FileManagerContextProps>({} as FileManagerContextProps)

const initialFiles = [
  {
    name: 'test',
    path: '',
    isFolder: true,
    id: 'image-00-123456789',
  },
  {
    name: 'image-01.jpg',
    size: 1528737,
    type: 'image/jpeg',
    path: '',
    url: 'https://picsum.photos/1000/800?grayscale&random=1',
    id: 'image-01-123456789',
  },
  {
    name: 'image-02.jpg',
    size: 2345678,
    type: 'image/jpeg',
    path: '',
    url: 'https://picsum.photos/1000/800?grayscale&random=2',
    id: 'image-02-123456789',
  },
  {
    name: 'image-03.jpg',
    size: 3456789,
    type: 'image/jpeg',
    path: '',
    url: 'https://picsum.photos/1000/800?grayscale&random=3',
    id: 'image-03-123456789',
  },
]

export function FileManager() {
  const [searchParams, setSearchParams] = useSearchParams()
  const viewMode = (searchParams.get('mode') as ViewMode) ?? 'grid'
  const currentPath = prefixPath(searchParams.get('path'))
  const currentPathArr = currentPath.split('/').filter((path) => path) ?? []

  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const [fileSelected, setFileSelected] = useState<FileItem | null>(null)
  const [dragUploadState, setDragUploadState] = useState<DragUploadState>({
    isDragging: false,
    path: null,
    isMove: false,
    id: '',
  })

  const changeSearchParams = (name: string, value: string) => {
    setSearchParams((searchParams) => {
      if (value) searchParams.set(name, value)
      else searchParams.delete(name)
      return searchParams
    })
  }

  const openFolder = (file: FileItem) => {
    changeSearchParams('path', `${currentPath === '/' ? '' : currentPath}/${file.name}`)
  }

  const handleDragEnter = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragUploadState((prev) => ({ ...prev, isDragging: true }))
  }

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const itemDrag = document.querySelector('[data-item-id]')
    if (itemDrag) {
      const path = itemDrag.getAttribute('data-item-path')
      if (path && currentPath === path) e.dataTransfer.dropEffect = 'none'
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget.contains(e.relatedTarget as Node)) return

    setDragUploadState((prev) => ({ ...prev, isDragging: false }))
  }

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('drag drop')
  }

  return (
    <FileManagerContext.Provider
      value={{
        files,
        setFiles,
        openFolder,
        currentPath,
        currentPathArr,
        changeSearchParams,
        fileSelected,
        setFileSelected,
        dragUploadState,
        setDragUploadState,
      }}
    >
      <Card className='pt-4 pb-3 h-svh rounded-none text-sm gap-4 z-10 relative min-h-96'>
        <CardHeader className='px-4'>
          <CardTitle className='text-lg text-primary font-semibold'>File Management</CardTitle>
          <CardDescription className='flex gap-2 flex-col sm:flex-row'>
            <PathBreadcrumb />
            <FileSearch />
          </CardDescription>
          <ActionDock />
        </CardHeader>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <CardContent
              className='px-4 py-4 flex-1 scroll-smooth [scrollbar-width:thin] overflow-y-auto border-t data-[dragging=true]:bg-accent/25'
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={(dragUploadState.isDragging && !dragUploadState.isMove) || undefined}
            >
              {files.length ? (
                <>
                  {viewMode === 'grid' && <ContentGridView />}
                  {viewMode === 'list' && <ContentListView />}
                </>
              ) : (
                <div className='flex h-full flex-col items-center justify-center text-center'>
                  <Folder className='text-muted-foreground mb-4 h-16 w-16' />
                  <h3 className='text-lg font-medium'>No files found</h3>
                  <p className='text-muted-foreground'>Upload files or create a folder to get started</p>
                  <p className='text-muted-foreground mt-2'>Drag and drop files here to upload</p>
                </div>
              )}
            </CardContent>
          </ContextMenuTrigger>
          <ContextMenuContent container />
        </ContextMenu>
        <Footer />
      </Card>
    </FileManagerContext.Provider>
  )
}

export const useFileManager = () => {
  const context = use(FileManagerContext)

  if (!context) throw new Error('useFileManager must be used within a FileManagerProvider')

  return context
}
