import HomePage from '~/pages/home'

import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Home Page' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Home() {
  return <HomePage />
}
