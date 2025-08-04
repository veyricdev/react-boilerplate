import { t } from '~/locales/i18n'
import HomePage from '~/pages/home'

import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [{ title: t('common.home') }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Home() {
  return <HomePage />
}
