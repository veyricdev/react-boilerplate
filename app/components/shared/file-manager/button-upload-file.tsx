import { Upload } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

import FileUpload from '../file-upload'

export default function ButtonUploadFile() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsUploadOpen(true)}
        size='icon'
        className='bg-primary hover:bg-primary/50 size-10 rounded-full shadow-lg'
        title='Upload File'
      >
        <Upload className='size-4' />
        <span className='sr-only'>Upload</span>
      </Button>
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className='text-foreground sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <FileUpload
            options={{
              maxSize: 5 * 1024 * 1024,
              maxFiles: 6,
              multiple: true,
            }}
            onUpload={(files) => {
              console.log('files', files)
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
