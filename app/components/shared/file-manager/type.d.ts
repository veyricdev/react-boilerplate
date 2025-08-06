import type { Dispatch, SetStateAction } from 'react'

type FileManagerContextProps = {
  title?: string
  files?: FileItem[]
  setFiles: Dispatch<SetStateAction<FileItem[]>>
  currentPath: string
  currentPathArr: string[]
  changeSearchParams: (name: string, value: string) => void
  openFolder: (file: FileItem) => void
  fileSelected: FileItem | null
  setFileSelected: Dispatch<SetStateAction<FileItem | null>>
  dragUploadState: DragUploadState
  setDragUploadState: Dispatch<SetStateAction<DragUploadState>>
}

export type FileItem = {
  id: string
  path: string
  name: string
  type?: string
  isFolder?: boolean
  url?: string
  size?: number
  lastModified?: string
}

export type ViewMode = 'list' | 'grid'

export type SortField = 'name' | 'size' | 'modified'
export type SortDirection = 'asc' | 'desc'
export type SortConfig = {
  field: SortField
  direction: SortDirection
}

export type DragUploadState = {
  isDragging?: boolean
  path?: string | null
  isMove?: boolean
  id?: string
}
