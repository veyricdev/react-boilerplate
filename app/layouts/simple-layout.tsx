import { Link, Outlet } from 'react-router'

export default function SimpleLayout() {
  return (
    <div className='relative'>
      <Outlet />
      <div className='container px-2 sm:px-4 left-1/2 -translate-x-1/2 fixed bottom-0'>
        <hr className='border-t-foreground/50' />
        <footer className='flex items-center justify-between py-2 sm:py-4 gap-2'>
          <small className='text-xs'>
            Copyright 2025 ©
            <Link className='hover:underline' target='_blank' to='https://github.com/veyricdev'>
              Veyric
            </Link>
            . All rights Reserved.
          </small>
        </footer>
      </div>
    </div>
  )
}
