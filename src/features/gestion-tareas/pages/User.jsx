import { UserLayout } from '../components/user/UserLayout'
import { Outlet } from 'react-router-dom'

export function User() {
  return (
    <UserLayout>
      <Outlet />
    </UserLayout>
  )
}
