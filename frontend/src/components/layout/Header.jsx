import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import logoImage from '../../assets/images/logo.png?url';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../common/Modal';
import SearchSidebar from '../search/SearchSidebar';

/**
 * Header Component - "Light in Motion" Design System
 * 
 * Confident, restrained header with:
 * - Sticky behavior with subtle shadow
 * - Refined dropdown animations
 * - Clear active states
 * - Thumb-friendly mobile menu
 * - Accessibility-first focus states
 */

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSearchSidebar, setShowSearchSidebar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      label: 'SHOP',
      links: [
        { text: 'Shop All Products', href: '/products' },
        { text: 'Shop Power Lanterns', href: '/products/power-lanterns' },
        { text: 'Shop Accessories', href: '/products/accessories' },
        // { text: 'Shop Gift Guide', href: '/products/gifts' },
      ]
    },
    {
      label: 'BUNDLES',
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
        { text: 'Getting Started Guides', href: '/support/guides' },
        { text: 'Returns & Warranty', href: '/support/returns' },
        { text: 'Accessibility', href: '/support/accessibility' },
        { text: 'Contact Us', href: '/support/contact' },
      ]
    }
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-soft transition-shadow duration-normal hover:shadow-medium">
      <div className="relative container max-w-content mx-auto px-6 md:px-8 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link 
          to="/" 
          onClick={(e) => {
            // If already on homepage, just scroll to top
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // Otherwise let React Router handle navigation (ScrollToTop will handle scroll)
          }}
          className="flex items-center focus-ring rounded-soft"
        >
          <img 
            src={logoImage} 
            alt="LuminAID" 
            className="h-10 md:h-11 w-auto transition-transform duration-fast hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation (centered) */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 top-0 h-full -translate-x-1/2">
          {navItems.map((item) => {
            const isOpen = activeDropdown === item.label;
            return (
              <div
                key={item.label}
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  className={`flex items-center gap-1.5 text-label-lg font-semibold 
                           tracking-wide transition-colors duration-fast focus-ring rounded-soft px-2 py-1
                           ${isOpen ? 'text-brand-orange' : 'text-charcoal hover:text-brand-orange'}`}
                >
                  {item.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-fast ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Invisible bridge to prevent gap issues */}
                {isOpen && (
                  <div className="absolute top-full left-0 right-0 h-2" />
                )}

                {/* Dropdown */}
                <div
                  className={`absolute top-full left-0 w-max min-w-[220px] 
                           bg-white rounded-soft shadow-medium border border-gray-100
                           py-2 transition-all duration-fast ease-out ${
                    isOpen
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                  }`}
                >
                  {item.links.map((link) => (
                    <a
                      key={link.text}
                      href={link.href}
                      className="block px-4 py-2.5 text-body-sm text-charcoal 
                               hover:text-brand-orange hover:bg-warm-paper
                               transition-colors duration-fast"
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search Button */}
          <button 
            onClick={() => setShowSearchSidebar(true)}
            className="p-2 text-charcoal hover:text-brand-orange 
                     transition-colors duration-fast focus-ring rounded-soft"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          
          {/* User Menu */}
          <div className="relative hidden md:block">
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onMouseEnter={() => setShowUserMenu(true)}
                  className="flex items-center gap-2 p-2 text-charcoal 
                           hover:text-brand-orange transition-colors duration-fast 
                           focus-ring rounded-soft"
                >
                  <User size={20} />
                  <span className="hidden lg:inline text-body-sm font-medium">
                    {user?.firstName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`hidden lg:block transition-transform duration-fast ${
                      showUserMenu ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {/* User Dropdown */}
                {showUserMenu && (
                  <>
                    <div className="absolute right-0 top-full w-48 h-2" 
                      onMouseEnter={() => setShowUserMenu(true)}
                    />
                    <div 
                      className="absolute right-0 top-full mt-2 w-52 
                               bg-white rounded-soft shadow-medium border border-gray-100 
                               py-2 z-50 animate-fade-in"
                      onMouseEnter={() => setShowUserMenu(true)}
                      onMouseLeave={() => setShowUserMenu(false)}
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2.5 text-body-sm text-charcoal 
                                 hover:text-brand-orange hover:bg-warm-paper
                                 transition-colors duration-fast"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2.5 text-body-sm text-charcoal 
                                 hover:text-brand-orange hover:bg-warm-paper
                                 transition-colors duration-fast"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2.5 text-body-sm text-charcoal 
                                 hover:text-brand-red hover:bg-warm-paper
                                 transition-colors duration-fast flex items-center gap-2"
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
                className="flex items-center gap-2 p-2 text-charcoal 
                         hover:text-brand-orange transition-colors duration-fast 
                         focus-ring rounded-soft"
              >
                <User size={20} />
                <span className="hidden lg:inline text-body-sm font-medium">Login</span>
              </Link>
            )}
          </div>
          
          {/* Cart Button */}
          <Link 
            to="/cart" 
            className="relative p-2 text-charcoal hover:text-brand-orange 
                     transition-colors duration-fast focus-ring rounded-soft"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 
                             bg-brand-orange text-white 
                             text-label-sm font-bold
                             rounded-full h-5 w-5 
                             flex items-center justify-center 
                             shadow-glow-sm
                             animate-scale-in">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-charcoal hover:text-brand-orange 
                     transition-colors duration-fast focus-ring rounded-soft"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-medium animate-fade-in">
          <nav className="container max-w-content mx-auto px-6 py-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="text-label-lg font-bold text-charcoal px-4 py-2">
                  {item.label}
                </div>
                {item.links.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    className="block px-8 py-2.5 text-body-sm text-charcoal 
                             hover:text-brand-orange hover:bg-warm-paper
                             transition-colors duration-fast rounded-soft"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            ))}

            {/* Mobile Auth Links */}
            <div className="pt-4 border-t border-gray-100 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-4 py-2.5 text-body-sm text-charcoal 
                             hover:text-brand-orange hover:bg-warm-paper
                             transition-colors duration-fast rounded-soft"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2.5 text-body-sm text-charcoal 
                             hover:text-brand-orange hover:bg-warm-paper
                             transition-colors duration-fast rounded-soft"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogoutClick();
                    }}
                    className="w-full text-left px-4 py-2.5 text-body-sm text-charcoal 
                             hover:text-brand-red hover:bg-warm-paper
                             transition-colors duration-fast rounded-soft flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-2.5 text-body-sm text-charcoal 
                           hover:text-brand-orange hover:bg-warm-paper
                           transition-colors duration-fast rounded-soft"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Search Sidebar */}
      <SearchSidebar 
        isOpen={showSearchSidebar} 
        onClose={() => setShowSearchSidebar(false)} 
      />

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