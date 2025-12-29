import { createFileRoute, Outlet } from '@tanstack/react-router'
import AppFooter from '~/components/shared/app-footer'
import AppHeader from '~/components/shared/app-header'

export const Route = createFileRoute('/(app)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <AppHeader />
      <Outlet />
      <AppFooter />
    </>
  )
}
