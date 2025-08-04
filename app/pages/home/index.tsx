import { Link } from 'react-router'

import { Button } from '~/components/ui/button'

export default function HomePage() {
  return (
    <div className='flex h-screen items-center justify-center flex-col bg-card'>
      <h1 className='text-primary'>
        Welcome To React Router Boilerplate By <i>Veyric</i>
      </h1>
      <Link to={'/about'}>
        <Button className='mt-4' variant={'outline'}>
          Go to About Page
        </Button>
      </Link>
    </div>
  )
}
