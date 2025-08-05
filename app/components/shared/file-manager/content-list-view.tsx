import { Clipboard, Copy, Download, Edit, Eye, Folder, MoreVertical, Scissors, Trash2 } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'
import { formatBytes } from '~/utils/helpers'

import { useFileManager } from '.'
import { getFilePreview, getKey } from './helpers'

export default function ContentListView() {
  const { files, openFolder, setFileSelected, fileSelected } = useFileManager()

  return (
    <div className='overflow-hidden rounded-lg border'>
      <table className='w-full'>
        <thead>
          <tr className='bg-muted/50 border-b'>
            <th className='p-3 text-left font-medium'>Name</th>
            <th className='hidden p-3 text-left font-medium sm:table-cell'>Size</th>
            <th className='hidden p-3 text-left font-medium md:table-cell'>Modified</th>
            <th className='p-3 text-right font-medium'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files?.map((file) => {
            return (
              <tr
                onClick={() => setFileSelected(file)}
                onDoubleClick={() => file.isFolder && openFolder(file)}
                className={cn(
                  'border-b transition-colors',
                  fileSelected?.id === file.id ? 'bg-ring/25' : 'hover:bg-accent/10'
                )}
                title={file.name}
                key={getKey(file)}
              >
                <td className='p-3'>
                  <div className='flex items-center gap-2'>
                    <span className='size-12'>
                      {file.isFolder ? (
                        <Folder className='size-12 text-blue-500' />
                      ) : (
                        getFilePreview({ file: { type: file.type!, name: file.name, url: file.url } })
                      )}
                    </span>
                    <span>{file.name}</span>
                  </div>
                </td>
                <td className='text-muted-foreground hidden p-3 sm:table-cell'>
                  {file.isFolder ? '—' : formatBytes(file.size!)}
                </td>
                <td className='text-muted-foreground hidden p-3 md:table-cell'>
                  {file.lastModified && new Date(file.lastModified).toLocaleDateString()}
                </td>
                <td className='p-3 text-right'>
                  <div className='flex justify-end'>
                    <Button variant='ghost' size='icon' className='mr-2 h-8 w-8' title='Preview(⌘O)'>
                      <Eye className='h-4 w-4' />
                    </Button>
                    <ItemActionMenu file={file} />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ItemActionMenu({ file }: { file: FileItem }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <MoreVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end'>
        <DropdownMenuItem>
          <Eye className='mr-2 h-4 w-4' />
          Preview
          <DropdownMenuShortcut className='ml-auto'>⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className='mr-2 h-4 w-4' />
          Rename
          <DropdownMenuShortcut className='ml-auto'>F2</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className='mr-2 h-4 w-4' />
          Copy
          <DropdownMenuShortcut className='ml-auto'>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
        {file.isFolder || (
          <DropdownMenuItem>
            <Copy className='mr-2 h-4 w-4' />
            Copy URL
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Scissors className='mr-2 h-4 w-4' />
          Cut
          <DropdownMenuShortcut className='ml-auto'>⌘X</DropdownMenuShortcut>
        </DropdownMenuItem>
        {file.isFolder && (
          <DropdownMenuItem>
            <Clipboard className='mr-2 h-4 w-4' />
            Paste
            <DropdownMenuShortcut className='ml-auto'>⌘V</DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {file.isFolder || (
          <DropdownMenuItem asChild>
            <Link to={file.url ?? ''} target='_blank' download>
              <Download className='mr-2 h-4 w-4' />
              Download
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className='text-red-500 focus:text-red-500'>
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
          <DropdownMenuShortcut className='ml-auto'>Del</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
