import { Archive, FileQuestion, FileText, Folder, Image, Music, Video } from 'lucide-react'
import type { FileType } from './types'

export function getFileIcon(type: FileType, className?: string) {
  const props = { className }
  switch (type) {
    case 'folder':
      return <Folder {...props} className={`text-blue-500 fill-blue-500/20 ${className}`} />
    case 'image':
      return <Image {...props} className={`text-purple-500 ${className}`} />
    case 'video':
      return <Video {...props} className={`text-red-500 ${className}`} />
    case 'audio':
      return <Music {...props} className={`text-yellow-500 ${className}`} />
    case 'document':
      return <FileText {...props} className={`text-blue-400 ${className}`} />
    case 'archive':
      return <Archive {...props} className={`text-orange-500 ${className}`} />
    default:
      return <FileQuestion {...props} className={`text-gray-400 ${className}`} />
  }
}
