import { Clock, Cloud, HardDrive, Star, Trash } from 'lucide-react'
import { cn } from '~/lib/utils'

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  active?: boolean
  onClick?: () => void
}

function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
        active ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
      )}
      type='button'
    >
      <Icon className='w-4 h-4' />
      {label}
    </button>
  )
}

export function FileSidebar() {
  return (
    <div className='w-64 border-r bg-muted/10 flex-col p-4 gap-6 hidden lg:flex h-full shrink-0 overflow-y-auto'>
      <div>
        <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3'>Locations</h3>
        <div className='space-y-1'>
          <SidebarItem icon={HardDrive} label='My Files' active />
          <SidebarItem icon={Cloud} label='Cloud' />
          <SidebarItem icon={Trash} label='Trash' />
        </div>
      </div>

      <div>
        <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3'>Favorites</h3>
        <div className='space-y-1'>
          <SidebarItem icon={Clock} label='Recent' />
          <SidebarItem icon={Star} label='Starred' />
        </div>
      </div>

      <div className='mt-auto'>
        <div className='bg-secondary/50 rounded-lg p-4'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-xs font-medium'>Storage</span>
            <span className='text-xs text-muted-foreground'>75%</span>
          </div>
          <div className='h-2 w-full bg-secondary rounded-full overflow-hidden'>
            <div className='h-full bg-blue-500 w-3/4' />
          </div>
          <p className='text-xs text-muted-foreground mt-2'>7.5 GB used of 10 GB</p>
        </div>
      </div>
    </div>
  )
}
