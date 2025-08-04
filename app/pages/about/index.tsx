import { Link } from 'react-router'

import { Button } from '~/components/ui/button'

export default function AboutPage() {
  return (
    <div className='flex h-screen items-center justify-center flex-col bg-card'>
      <h1 className='text-primary'>About Page</h1>
      <Link to={'/'}>
        <Button className='mt-4' variant={'outline'}>
          Go to Home Page
        </Button>
      </Link>
    </div>
  )
}
