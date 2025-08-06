import { Search } from 'lucide-react'
import { useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { Input } from '~/components/ui/input'

export default function FileSearch() {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const openSearch = () => {
    if (searchInputRef.current) searchInputRef.current.focus()
  }

  useHotkeys('ctrl+k', openSearch, {
    preventDefault: true,
    enableOnFormTags: true,
  })

  return (
    <div className='sm:w-36 md:w-52 relative shrink-0'>
      <Search className='absolute top-1/2 -translate-y-1/2 left-[0.3rem] size-5' />
      <Input ref={searchInputRef} className='px-8 size-full text-sm py-1' placeholder='Search files...' />
      <kbd className='bg-muted pointer-events-none absolute top-1/2 right-[0.3rem] hidden h-5 -translate-y-1/2 items-center gap-0.5 rounded border px-1 font-mono text-[10px] font-medium opacity-100 select-none sm:flex'>
        ⌘K
      </kbd>
    </div>
  )
}
