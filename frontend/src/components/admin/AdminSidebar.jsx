import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
} from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

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

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Still navigate to login even if logout request fails
      navigate('/login')
    }
  }

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed bottom-0 top-[72px] z-50 flex w-[260px] shrink-0 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:left-0 lg:w-[220px] lg:translate-x-0 ${
          isOpen ? 'left-0 translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1 overflow-y-auto px-4 py-6">
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
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
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

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-black transition-colors hover:bg-gray-light hover:text-primary-red"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar