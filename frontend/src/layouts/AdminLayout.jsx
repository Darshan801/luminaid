import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'
import AdminSidebar from '../components/admin/AdminSidebar'

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      <div className="flex min-h-[calc(100vh-72px)]">
        <AdminSidebar />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout