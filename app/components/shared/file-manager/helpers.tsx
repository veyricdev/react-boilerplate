import {
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  VideoIcon,
} from 'lucide-react'

import type { FileItem, SortConfig } from './type'

export const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type
  const fileName = file.file instanceof File ? file.file.name : file.file.name

  const iconMap = {
    pdf: {
      icon: FileTextIcon,
      conditions: (type: string, name: string) =>
        type.includes('pdf') ||
        name.endsWith('.pdf') ||
        type.includes('word') ||
        name.endsWith('.doc') ||
        name.endsWith('.docx'),
    },
    archive: {
      icon: FileArchiveIcon,
      conditions: (type: string, name: string) =>
        type.includes('zip') || type.includes('archive') || name.endsWith('.zip') || name.endsWith('.rar'),
    },
    excel: {
      icon: FileSpreadsheetIcon,
      conditions: (type: string, name: string) =>
        type.includes('excel') || name.endsWith('.xls') || name.endsWith('.xlsx'),
    },
    video: {
      icon: VideoIcon,
      conditions: (type: string) => type.includes('video/'),
    },
    audio: {
      icon: HeadphonesIcon,
      conditions: (type: string) => type.includes('audio/'),
    },
    image: {
      icon: ImageIcon,
      conditions: (type: string) => type.startsWith('image/'),
    },
  }

  for (const { icon: Icon, conditions } of Object.values(iconMap)) {
    if (conditions(fileType, fileName)) {
      return <Icon className='size-5 opacity-60' />
    }
  }

  return <FileIcon className='size-5 opacity-60' />
}

export const getFilePreview = (file: { file: File | { type: string; name: string; url?: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type
  const fileName = file.file instanceof File ? file.file.name : file.file.name

  const renderImage = (src: string) => (
    <img src={src} alt={fileName} className='size-full rounded-t-[inherit] object-cover' />
  )

  return (
    <div className='bg-accent flex aspect-square items-center justify-center overflow-hidden rounded-t-[inherit]'>
      {fileType.startsWith('image/') ? (
        file.file instanceof File ? (
          (() => {
            const previewUrl = URL.createObjectURL(file.file)
            return renderImage(previewUrl)
          })()
        ) : file.file.url ? (
          renderImage(file.file.url)
        ) : (
          <ImageIcon className='size-5 opacity-60' />
        )
      ) : (
        getFileIcon(file)
      )}
    </div>
  )
}

export const getKey = (file?: FileItem | null) => (file ? `${file.isFolder ? 1 : 0}[_]${file.path}[_]${file.name}` : '')

export const prefixPath = (path?: string | null) => {
  const _path = path || '/'

  if (!_path.startsWith('/')) return `/${_path}`
  if (_path.endsWith('/') && !_path.startsWith('/')) return _path.slice(0, -1)

  return _path
}

export const sortFiles = (files: FileItem[], sortConfig: SortConfig) => {
  return [...files].sort((a, b) => {
    const sortMap = {
      name: () => {
        if (a.isFolder !== b.isFolder) {
          // Folders always come first
          return a.isFolder ? -1 : 1
        }
        const nameCompare = a.name.localeCompare(b.name)
        return sortConfig.direction === 'asc' ? nameCompare : -nameCompare
      },
      size: () => {
        if (a.isFolder !== b.isFolder) {
          // Folders always come first
          return a.isFolder ? -1 : 1
        }
        const sizeCompare = a.size! - b.size!
        return sortConfig.direction === 'asc' ? sizeCompare : -sizeCompare
      },
      modified: () => {
        if (a.isFolder !== b.isFolder) {
          // Folders always come first
          return a.isFolder ? -1 : 1
        }

        if (!a.lastModified || !b.lastModified) return -1

        const dateA = new Date(a.lastModified).getTime()
        const dateB = new Date(b.lastModified).getTime()
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA
      },
    }
    return sortMap[sortConfig.field]?.() ?? 0
  })
}
