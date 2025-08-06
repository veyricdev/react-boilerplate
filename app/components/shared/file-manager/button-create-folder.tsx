import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'

import { useFileManager } from '.'

import type { FileItem } from './type'

export default function ButtonCreateFolder() {
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const { setFiles } = useFileManager()

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const folder = {
        id: Math.random().toString(36).substring(2, 9),
        name: newFolderName,
        isFolder: true,
        path: newFolderName,
        lastModified: Date.now().toLocaleString(),
      } as FileItem

      setFiles((files: FileItem[]) => [...files, folder])
      setNewFolderName('')
      setIsCreateFolderOpen(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsCreateFolderOpen(true)}
        size='icon'
        className='bg-primary hover:bg-primary/50 size-10 rounded-full shadow-lg'
        title='New Folder'
      >
        <Plus className='size-4' />
        <span className='sr-only'>New Folder</span>
      </Button>

      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent className='text-foreground'>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <Input
              placeholder='Folder name'
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              autoFocus
            />
            <Button onClick={handleCreateFolder}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
