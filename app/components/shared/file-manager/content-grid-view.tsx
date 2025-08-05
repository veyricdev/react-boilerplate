import { FolderOpen } from 'lucide-react'

import { cn } from '~/lib/utils'
import { formatBytes } from '~/utils/helpers'

import { useFileManager } from '.'
import { getFilePreview, getKey } from './helpers'

export default function ContentGridView() {
  const { files } = useFileManager()

  const { openFolder, fileSelected, setFileSelected } = useFileManager()

  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(125px,1fr))]'>
      {files?.map((file) => (
        <div
          className={cn(
            'flex flex-col items-center rounded-lg border p-4 transition-colors',
            fileSelected?.id === file.id ? 'bg-ring/25' : 'hover:bg-accent/10'
          )}
          title={file.name}
          onClick={() => setFileSelected(file)}
          onDoubleClick={() => file.isFolder && openFolder(file)}
          key={getKey(file)}
        >
          <div className='mb-2 flex h-12 w-12 items-center justify-center'>
            {file.isFolder ? (
              <FolderOpen className='h-10 w-10 text-blue-500' />
            ) : (
              getFilePreview({ file: { type: file.type!, name: file.name, url: file.url } })
            )}
          </div>
          <span className='w-full truncate text-center text-sm font-medium'>{file.name}</span>
          <span className='text-muted-foreground text-xs'>{file.isFolder ? '' : formatBytes(file.size!)}</span>
        </div>
      ))}
    </div>
  )
}
