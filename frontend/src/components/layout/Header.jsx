import { useState } from 'react'
import { Search, User, ShoppingCart, ChevronDown } from 'lucide-react'
import logoImage from '../../assets/images/logo.png?url'

const Header = () => {
  const [activeDropdown , setActiveDropdown] = useState(null)
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
        { text: 'Shipping', href: '/support/shipping' },
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
        <a href="/" className="flex items-center">
          <img 
            src={logoImage} 
            alt="LuminAID" 
            className="h-10 w-auto"
          />
        </a>

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
          <button className="text-black hover:text-primary-red transition-colors">
            <User size={18} />
          </button>
          <button className="relative text-black hover:text-primary-red transition-colors">
            <ShoppingCart size={18} />
            {/* Cart badge - you can make this dynamic later */}
            <span className="absolute -top-2 -right-2 bg-primary-red text-white text-[10px] rounded-full h-[18px] w-[18px] flex items-center justify-center font-semibold">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

        
export default Header;