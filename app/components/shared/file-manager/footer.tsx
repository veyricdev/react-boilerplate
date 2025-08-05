import { Grid, List } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { Button } from '~/components/ui/button'
import { CardFooter } from '~/components/ui/card'
import { formatBytes } from '~/utils/helpers'

import { useFileManager } from '.'

export default function Footer() {
  const [searchParams, setSearchParams] = useSearchParams()

  const { files } = useFileManager()

  const viewMode = (searchParams.get('mode') as ViewMode) ?? 'grid'
  const sizes = files?.filter((file) => !file.isFolder).reduce((acc, file) => acc + (file.size ?? 0), 0)

  return (
    <CardFooter className='px-4 text-muted-foreground border-t [.border-t]:pt-3'>
      <span className='flex-auto text-sm'>
        <span>{files?.length ?? 0} items</span>
        <span>{sizes ? ` / ${formatBytes(sizes)}` : ''}</span>
      </span>
      <div className='shrink-0 rounded-md border overflow-hidden'>
        {['grid', 'list'].map((mode) => (
          <Button
            key={mode}
            variant={viewMode === mode ? 'default' : 'ghost'}
            size='icon'
            disabled={viewMode === mode}
            className='rounded-none size-7'
            onClick={() =>
              setSearchParams((searchParams) => {
                searchParams.set('mode', mode)
                return searchParams
              })
            }
          >
            {mode === 'grid' ? <Grid className='size-4' /> : <List className='size-4' />}
          </Button>
        ))}
      </div>
    </CardFooter>
  )
}
