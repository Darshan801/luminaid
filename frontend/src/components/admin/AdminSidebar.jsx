import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
} from 'lucide-react'

const AdminSidebar = () => {
  const navigate = useNavigate()

  const navigation = [
    {
      name: 'Overview',
      path: '/admin',
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: 'Order',
      path: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Product',
      path: '/admin/products',
      icon: Package,
    },
    {
      name: 'User',
      path: '/admin/users',
      icon: Users,
    },
  ]

  const handleLogout = () => {
    // We'll connect this to your auth system later
    navigate('/login')
  }

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-gray-200 bg-white">
      <nav className="px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-medium">
          Admin
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-light font-semibold text-primary-red'
                      : 'text-black hover:bg-gray-light hover:text-primary-red'
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      <div className="mt-auto border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-black transition-colors hover:bg-gray-light hover:text-primary-red"
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar