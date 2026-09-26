import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  // Column 1 data
  const shopByCollection = [
    { text: 'Shop Bundles', href: '/bundles' },
    { text: 'Emergency Lanterns', href: '/collections/emergency' },
    { text: 'Camping Lanterns', href: '/collections/camping' },
    { text: 'Gift Guide', href: '/products/gifts' },
    { text: 'Corporate Gifts', href: '/business' },
  ];

  const stayUpToDate = [
    { text: 'Read Our Blogs', href: '/blog' },
  ];

  // Social icons (inline SVG paths, no extra dependency needed)
  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/LuminAID/',
      icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    },
    {
      name: 'Twitter',
      href: 'https://x.com/luminaidlab',
      icon: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/luminaid/',
      icon: (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/user/LuminAIDlab/videos',
      icon: (
        <>
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3z" />
        </>
      ),
    },
  ];

  // Column 2 - Quick Links
  const quickLinks = [
    { text: 'Lumen Rewards', href: '/rewards' },
    { text: 'Getting Started', href: '/support/guides' },
    { text: 'Reviews', href: '/reviews' },
    { text: 'Press Kit', href: '/press' },
    { text: 'Accessibility', href: '/accessibility' },
  ];

  // Column 2 - Partner with Us (below Quick Links)
  const partnerLinks = [
    { text: 'Corporate Gifting', href: '/business' },
    { text: 'Nonprofit Subsidy Program', href: '/nonprofit' },
    { text: 'Affiliate Program', href: '/affiliate' },
    { text: 'More Ways To Partner', href: '/partnership' },
  ];

  // Column 3 - Legal Links
  const legalLinks = [
    { text: 'Terms of Service', href: '/terms' },
    { text: 'Accessibility', href: '/accessibility' },
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Shipping', href: '/shipping' },
    { text: 'Patents', href: '/patents' },
  ];

  return (
    <footer className="w-full bg-[#2b2b2b] text-white">
      
      {/* Main Footer - 3 Columns */}
      <div className="max-w-[1280px] mx-auto px-8 pt-14 pb-7">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
          
          {/* Column 1: Shop by Collection + Stay Up-to-Date */}
          <div className="space-y-8">
            {/* Shop by Collection */}
            <div>
              <h3 className="text-[11px] leading-4 font-bold mb-4 tracking-wider">SHOP BY COLLECTION</h3>
              <div className="flex flex-col gap-2">
                {shopByCollection.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    className="text-sm text-white hover:text-gray-300 transition-colors w-fit"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Stay Up-to-Date */}
            <div>
              <h3 className="text-[11px] leading-4 font-bold mb-4 tracking-wider">STAY UP-TO-DATE</h3>
              <div className="flex flex-col gap-2">
                {stayUpToDate.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    className="text-sm text-white hover:text-gray-300 transition-colors underline underline-offset-2 w-fit"
                  >
                    {link.text}
                  </a>
                ))}
              </div>

              {/* Social Icons */}
              <div className="mt-4 flex w-fit border border-white/20">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-[41px] h-[41px] flex items-center justify-center border-r border-white/20 last:border-r-0 text-white hover:bg-white/10 transition-colors"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {social.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links + Partner with Us */}
          <div className="space-y-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-[11px] leading-4 font-bold mb-4 tracking-wider">QUICK LINKS</h3>
              <div className="flex flex-col gap-2">
                {quickLinks.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    className="text-sm text-white hover:text-gray-300 transition-colors w-fit"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Partner with Us */}
            <div>
              <h3 className="text-[11px] leading-4 font-bold mb-4 tracking-wider">PARTNER WITH US</h3>
              <div className="flex flex-col gap-2">
                {partnerLinks.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    className="text-sm text-white hover:text-gray-300 transition-colors w-fit"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Newsletter + Legal Links + Copyright */}
          <div className="space-y-6">
            {/* Newsletter */}
            <div>
              <h3 className="text-[11px] leading-4 font-bold mb-4 tracking-wider">JOIN OUR EMAIL LIST</h3>
              <p className="text-sm text-white mb-4">
                Get notified of upcoming sales and new product launches.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="relative">
                <input
                  type="email"
                  placeholder="Your e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 pr-10 text-sm bg-transparent border border-white/25 text-white placeholder:text-gray-400 hover:border-white focus:border-white focus:outline-none transition-colors"
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="sm"
                  aria-label="Subscribe"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-primary-red"
                >
                  <ArrowRight size={16} />
                </Button>
              </form>
            </div>

            {/* Legal Links */}
            <div className="pt-16 text-sm leading-6 text-white">
              {legalLinks.map((link, index) => {
                const separator = index < legalLinks.length - 1 ? ' | ' : '';
                return (
                  <span key={link.text} className="inline">
                    <a href={link.href} className="hover:text-gray-300 transition-colors inline">
                      {link.text}
                    </a>
                    {separator}
                  </span>
                );
              })}
            </div>

            {/* Copyright & Address (below legal links) */}
            <div className="text-sm leading-6 text-white">
              <p className="font-bold">© 2026 LuminAID Lab LLC</p>
              <p className="italic">944 Industrial Park Rd.</p>
              <p className="italic">Littleton, NH 03561</p>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;