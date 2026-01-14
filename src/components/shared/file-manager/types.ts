export type FileType = 'folder' | 'image' | 'video' | 'audio' | 'document' | 'archive' | 'unknown'

export interface FileSystemItem {
  id: string
  name: string
  type: FileType
  size?: number // in bytes
  updatedAt: Date
  parentId: string | null
  thumbnailUrl?: string
}

export type ViewMode = 'grid' | 'list'

export type SortField = 'name' | 'size' | 'date'
export type SortOrder = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  order: SortOrder
}
