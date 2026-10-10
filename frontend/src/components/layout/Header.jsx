import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, ShoppingCart, ChevronDown, LogOut } from 'lucide-react'
import logoImage from '../../assets/images/logo.png?url'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import Modal from '../common/Modal'

const Header = () => {
  const [activeDropdown , setActiveDropdown] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogoutClick = () => {
    setShowUserMenu(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    {
      label : 'SHOP',
      links : [
        { text: 'Shop All Products' , href:'/products'},
        { text: 'Shop Power Lanterns', href: '/products/power-lanterns' },
        { text: 'Shop Accessories', href: '/products/accessories' },
        { text: 'Shop Gift Guide', href: '/products/gifts' },
      ]
    },
    {
      label:'BUNDLES',
      links: [
        { text: 'Titan 4-Pack', href: '/bundles/titan' },
        { text: 'Solar String Light 4-Pack', href: '/bundles/string-lights' },
        { text: 'Backyard Bundle', href: '/bundles/backyard' },
        { text: 'Find Your LuminAID: Take the Quiz', href: '/bundles/LuminAidd-quiz' },
      ]
    },
    {
      label: 'OUR STORY',
      links: [
        { text: 'About LuminAID', href: '/about' },
        { text: 'Give Light', href: '/give-light' },
      ]
    },
    {
      label: 'SUPPORT',
      links: [
        // { text: 'Shipping', href: '/support/shipping' },
        { text: 'Getting Started Guides', href: '/support/guides' },
        { text: 'Returns & Warranty', href: '/support/returns' },
        { text: 'Accessibility', href: '/support/accessibility' },
        { text: 'Contact Us', href: '/support/contact' },

      ]
    }
  ];
  
  return (
    <header className="relative z-50 w-full bg-white shadow-sm">
      <div className="relative max-w-[1280px] mx-auto px-8 h-[72px] flex items-center justify-between">

        {/* logo  */}
        <Link to="/" className="flex items-center">
          <img 
            src={logoImage} 
            alt="LuminAID" 
            className="h-10 w-auto"
          />
        </Link>

        {/* navigations (centered) */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-0 h-full -translate-x-1/2">
        {navItems.map((item) => {
          const isOpen = activeDropdown === item.label
          return (
            <div
              key={item.label}
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
              onFocus={() => setActiveDropdown(item.label)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setActiveDropdown(null)
              }}
            >
              <button
                aria-haspopup="true"
                aria-expanded={isOpen}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isOpen ? 'text-primary-red' : 'text-black hover:text-primary-red'
                }`}
              >
                {item.label}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown (always mounted so it can animate) */}
              <div
                className={`absolute top-full -left-6 w-max min-w-[160px] bg-white border border-gray-100 shadow-lg py-3 transition-all duration-200 ease-out ${
                  isOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                }`}
              >
                {item.links.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    className="block px-6 py-1 text-sm text-black hover:text-primary-red transition-colors"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          )
        })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-black hover:text-primary-red transition-colors">
            <Search size={18} />
          </button>
          
          {/* User Menu */}
          <div className="relative">
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onMouseEnter={() => setShowUserMenu(true)}
                  className="flex items-center gap-2 text-black hover:text-primary-red transition-colors"
                >
                  <User size={18} />
                  <span className="hidden lg:inline text-sm font-medium">
                    {user?.firstName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`hidden lg:block transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {/* User Dropdown */}
                {showUserMenu && (
                  <>
                    {/* Invisible bridge to prevent menu from closing */}
                    <div className="absolute right-0 top-full w-48 h-2" 
                      onMouseEnter={() => setShowUserMenu(true)}
                    />
                    <div 
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-lg py-2 rounded-md z-50"
                      onMouseEnter={() => setShowUserMenu(true)}
                      onMouseLeave={() => setShowUserMenu(false)}
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-primary-red transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-primary-red transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-primary-red transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 text-black hover:text-primary-red transition-colors"
              >
                <User size={18} />
                <span className="hidden lg:inline text-sm font-medium">Login</span>
              </Link>
            )}
          </div>
          
          <Link to="/cart" className="relative text-black hover:text-primary-red transition-colors">
            <ShoppingCart size={18} />
            {/* Cart badge */}
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-red text-white text-[10px] rounded-full h-[18px] w-[18px] flex items-center justify-center font-semibold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        type="confirm"
        showCancel={true}
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogoutConfirm}
      />
    </header>
  );
};

        
export default Header;