import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react'
import { useTransition } from 'react'

import { useFileUpload, type FileUploadOptions } from '~/hooks/use-file-upload'
import { formatBytes } from '~/utils/helpers'

import { Button } from '../ui/button'

import { getFilePreview } from './file-manager/helpers'

type FileUploadProps = Readonly<{
  options?: FileUploadOptions
  onUpload?: (files: File[]) => unknown | Promise<unknown>
}>

export default function FileUpload({
  options = { maxSize: 5 * 1024 * 1024, maxFiles: 6, multiple: true },
  onUpload,
}: FileUploadProps) {
  const [pending, startTransition] = useTransition()

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload(options)

  const handleUpload = () => {
    if (pending || !onUpload) return

    startTransition(async () => {
      await onUpload(files.map((file) => file.file as File))
    })
  }

  return (
    <div className='flex flex-col gap-2'>
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className='border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]'
      >
        <input {...getInputProps()} className='sr-only' aria-label='Upload image file' />
        <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
          <div
            className='bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border'
            aria-hidden='true'
          >
            <ImageIcon className='size-4 opacity-60' />
          </div>
          <p className='mb-1.5 text-sm font-medium'>Drop your files here</p>
          <p className='text-muted-foreground text-xs'>
            Max {options.maxFiles} files ∙ Up to {options.maxSize && formatBytes(options.maxSize)}
          </p>
          <Button variant='outline' className='mt-4' onClick={openFileDialog}>
            <UploadIcon className='-ms-1 opacity-60' aria-hidden='true' />
            Select files
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className='text-destructive flex items-center gap-1 text-xs' role='alert'>
          <AlertCircleIcon className='size-3 shrink-0' />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className='space-y-2'>
          {files.map((file) => (
            <div
              key={file.id}
              className='bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3'
            >
              <div className='flex items-center gap-3 overflow-hidden'>
                <div className='flex aspect-square size-10 shrink-0 items-center justify-center rounded border'>
                  {getFilePreview(file)}
                </div>
                <div className='flex min-w-0 flex-col gap-0.5'>
                  <p className='truncate text-[13px] font-medium'>{file.file.name}</p>
                  <p className='text-muted-foreground text-xs'>{formatBytes(file.file.size)}</p>
                </div>
              </div>

              <Button
                size='icon'
                variant='ghost'
                className='text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent'
                onClick={() => removeFile(file.id)}
                aria-label='Remove file'
              >
                <XIcon aria-hidden='true' />
              </Button>
            </div>
          ))}

          <div className='space-x-2 pt-2'>
            <Button size='sm' variant='default' onClick={handleUpload} disabled={pending}>
              Upload
            </Button>
            {/* Remove all files button */}
            {files.length > 1 && (
              <Button size='sm' variant='outline' onClick={clearFiles} disabled={pending}>
                Remove all files
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
