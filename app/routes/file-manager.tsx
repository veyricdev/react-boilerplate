import FileManagerPage from '~/pages/file-manager'

import type { Route } from './+types/file-manager'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'File Manager' }]
}

export default function FileManager() {
  return <FileManagerPage />
}
