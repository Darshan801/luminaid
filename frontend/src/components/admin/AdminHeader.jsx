import { Menu, X } from 'lucide-react'
import logo from '../../assets/images/logo.png'

const AdminHeader = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="inline-flex items-center justify-center rounded-lg p-2 text-black transition-colors hover:bg-gray-light lg:hidden"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <X size={24} strokeWidth={1.8} />
            ) : (
              <Menu size={24} strokeWidth={1.8} />
            )}
          </button>

          <img
            src={logo}
            alt="LuminAID"
            className="h-8 w-auto sm:h-10"
          />
        </div>

        {/*user profile/notifications here later */}
      </div>
    </header>
  )
}

export default AdminHeader