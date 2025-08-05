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
}

type FileItem = {
  id: string
  path: string
  name: string
  type?: string
  isFolder?: boolean
  url?: string
  size?: number
  lastModified?: string
}

type ViewMode = 'list' | 'grid'

type SortField = 'name' | 'size' | 'modified'
type SortDirection = 'asc' | 'desc'
type SortConfig = {
  field: SortField
  direction: SortDirection
}
