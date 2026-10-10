import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'
import AdminSidebar from '../components/admin/AdminSidebar'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex min-h-[calc(100vh-72px)]">
        <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout