import { createFileRoute } from '@tanstack/react-router'
import FileManager from '~/components/shared/file-manager'

export const Route = createFileRoute('/(app)/file-manager')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <FileManager />
    </div>
  )
}
