import { useCallback, useMemo, useState } from 'react'
import { mockFileSystem } from './data'
import type { FileSystemItem, FileType, SortConfig, ViewMode } from './types'

export const useFileManager = () => {
  const [items, setItems] = useState<FileSystemItem[]>(mockFileSystem)
  const [currentFolderId, setCurrentFolderId] = useState<string>('root')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', order: 'asc' })
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set())

  // Safe find with fallback
  const currentFolder = useMemo(() => {
    return (
      items.find((item) => item.id === currentFolderId) ||
      ({ id: 'root', name: 'Root', type: 'folder', parentId: null, updatedAt: new Date() } as FileSystemItem)
    )
  }, [items, currentFolderId])

  const getBreadcrumbs = useCallback(
    (folderId: string): FileSystemItem[] => {
      const breadcrumbs: FileSystemItem[] = []
      let current = items.find((i) => i.id === folderId)
      while (current) {
        breadcrumbs.unshift(current)
        if (!current.parentId) break
        const parentId = current.parentId
        current = items.find((i) => i.id === parentId)
      }
      return breadcrumbs
    },
    [items]
  )

  const filteredItems = useMemo(() => {
    const result = items.filter((item) => {
      if (!searchQuery) {
        return item.parentId === currentFolderId
      }
      return item.name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    result.sort((a, b) => {
      // Folders always first
      if (a.type === 'folder' && b.type !== 'folder') return -1
      if (a.type !== 'folder' && b.type === 'folder') return 1

      let comparison = 0
      switch (sortConfig.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'size':
          comparison = (a.size || 0) - (b.size || 0)
          break
        case 'date':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
          break
      }
      return sortConfig.order === 'asc' ? comparison : -comparison
    })

    return result
  }, [items, currentFolderId, searchQuery, sortConfig])

  const navigateTo = (folderId: string) => {
    setCurrentFolderId(folderId)
    setSearchQuery('')
    setSelectedItemIds(new Set())
  }

  const navigateUp = () => {
    if (currentFolder.parentId) {
      navigateTo(currentFolder.parentId)
    }
  }

  const deleteItems = (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} items?`)) {
      setItems((prev) => prev.filter((item) => !ids.includes(item.id)))
      setSelectedItemIds(new Set())
    }
  }

  const createFolder = (name: string) => {
    const newFolder: FileSystemItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: 'folder',
      updatedAt: new Date(),
      parentId: currentFolderId,
    }
    setItems((prev) => [...prev, newFolder])
  }

  const renameItem = (id: string, newName: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, name: newName } : item)))
  }

  const toggleSelection = (id: string, multi: boolean) => {
    if (multi) {
      setSelectedItemIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    } else {
      setSelectedItemIds(new Set([id]))
    }
  }

  const handleUpload = (files: FileList | null, targetId?: string) => {
    if (!files || files.length === 0) return

    const newItems: FileSystemItem[] = Array.from(files).map((file) => {
      const type = getFileType(file.name)
      let thumbnailUrl: string | undefined

      if (type === 'image') {
        thumbnailUrl = URL.createObjectURL(file)
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type,
        size: file.size,
        updatedAt: new Date(file.lastModified),
        parentId: targetId || currentFolderId,
        thumbnailUrl,
      }
    })

    setItems((prev) => [...prev, ...newItems])
  }

  const moveItem = (itemId: string, targetFolderId: string | null) => {
    // If moving the currently dragged item, and it is part of the selection, move ALL selected items.
    // If it is NOT part of the selection (which shouldn't happen due to onDragStart logic), just move it.

    const itemsToMoveIds = selectedItemIds.has(itemId) ? Array.from(selectedItemIds) : [itemId]

    // Verify target is valid for all
    if (itemsToMoveIds.includes(targetFolderId || '')) return

    setItems((prev) => {
      return prev.map((item) => {
        if (itemsToMoveIds.includes(item.id)) {
          return { ...item, parentId: targetFolderId }
        }
        return item
      })
    })
    setSelectedItemIds(new Set())
  }

  return {
    items,
    currentFolder,
    currentItems: filteredItems,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    sortConfig,
    setSortConfig,
    selectedItemIds,
    toggleSelection,
    navigateTo,
    navigateUp,
    deleteItems,
    createFolder,
    renameItem,
    handleUpload,
    moveItem,

    breadcrumbs: getBreadcrumbs(currentFolderId),
  }
}

function getFileType(fileName: string): FileType {
  const ext = fileName.split('.').pop()?.toLowerCase()

  if (!ext) return 'unknown'

  const map: Record<string, FileType> = {
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    svg: 'image',
    webp: 'image',
    mp4: 'video',
    mov: 'video',
    avi: 'video',
    mkv: 'video',
    mp3: 'audio',
    wav: 'audio',
    pdf: 'document',
    doc: 'document',
    docx: 'document',
    txt: 'document',
    xls: 'document',
    xlsx: 'document',
    ppt: 'document',
    pptx: 'document',
    zip: 'archive',
    rar: 'archive',
    tar: 'archive',
    '7z': 'archive',
  }

  return map[ext] || 'unknown'
}
