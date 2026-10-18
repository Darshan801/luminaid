import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Footer Component - "Light in Motion" Design System
 * 
 * Structured, consistent footer with:
 * - Clear visual hierarchy
 * - Refined newsletter form
 * - Warm hover states
 * - Responsive grid layout
 */

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/api/support/newsletter`, { email });
      
      if (response.data.success) {
        setMessage('Successfully subscribed!');
        setEmail('');
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Subscription failed. Please try again.');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

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

  const quickLinks = [
    { text: 'Getting Started', href: '/support/guides' },
    { text: 'Reviews', href: '/reviews' },
    { text: 'Press Kit', href: '/press' },
    { text: 'Accessibility', href: '/support/accessibility' },
  ];

  const partnerLinks = [
    { text: 'Corporate Gifting', href: '/business' },
    { text: 'Nonprofit Subsidy Program', href: '/nonprofit' },
    { text: 'Affiliate Program', href: '/affiliate' },
    { text: 'More Ways To Partner', href: '/partnership' },
  ];

  const legalLinks = [
    { text: 'Terms of Service', href: '/terms' },
    { text: 'Accessibility', href: '/support/accessibility' },
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Shipping', href: '/support/shipping' },
    { text: 'Patents', href: '/patents' },
  ];

  return (
    <footer className="w-full bg-charcoal text-white">
      
      {/* Main Footer - 3 Columns */}
      <div className="container max-w-content mx-auto px-6 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          
          {/* Column 1: Shop by Collection + Stay Up-to-Date */}
          <div className="space-y-10">
            {/* Shop by Collection */}
            <div>
              <h3 className="text-label-lg font-bold mb-4 tracking-wider uppercase text-warm-paper">
                Shop by Collection
              </h3>
              <div className="flex flex-col gap-3">
                {shopByCollection.map((link) => (
                  <Link
                    key={link.text}
                    to={link.href}
                    className="text-body-sm text-white hover:text-brand-orange 
                             transition-colors duration-fast w-fit"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Stay Up-to-Date */}
            <div>
              <h3 className="text-label-lg font-bold mb-4 tracking-wider uppercase text-warm-paper">
                Stay Up-to-Date
              </h3>
              <div className="flex flex-col gap-3">
                {stayUpToDate.map((link) => (
                  <Link
                    key={link.text}
                    to={link.href}
                    className="text-body-sm text-white hover:text-brand-orange 
                             underline decoration-1 underline-offset-4
                             transition-colors duration-fast w-fit"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>

              {/* Social Icons */}
              <div className="mt-6 flex w-fit border border-white/20 rounded-soft overflow-hidden">
                {socialLinks.map((social, idx) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`w-11 h-11 flex items-center justify-center 
                             text-white hover:bg-brand-orange hover:text-white
                             transition-all duration-fast
                             ${idx < socialLinks.length - 1 ? 'border-r border-white/20' : ''}`}
                  >
                    <svg
                      width="16"
                      height="16"
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
          <div className="space-y-10">
            {/* Quick Links */}
            <div>
              <h3 className="text-label-lg font-bold mb-4 tracking-wider uppercase text-warm-paper">
                Quick Links
              </h3>
              <div className="flex flex-col gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.text}
                    to={link.href}
                    className="text-body-sm text-white hover:text-brand-orange 
                             transition-colors duration-fast w-fit"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Partner with Us */}
            <div>
              <h3 className="text-label-lg font-bold mb-4 tracking-wider uppercase text-warm-paper">
                Partner with Us
              </h3>
              <div className="flex flex-col gap-3">
                {partnerLinks.map((link) => (
                  <Link
                    key={link.text}
                    to={link.href}
                    className="text-body-sm text-white hover:text-brand-orange 
                             transition-colors duration-fast w-fit"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Newsletter + Legal Links + Copyright */}
          <div className="space-y-8">
            {/* Newsletter */}
            <div>
              <h3 className="text-label-lg font-bold mb-4 tracking-wider uppercase text-warm-paper">
                Join Our Email List
              </h3>
              <p className="text-body-sm text-white/90 mb-5 leading-relaxed">
                Get notified of upcoming sales and new product launches.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="relative">
                <input
                  type="email"
                  placeholder="Your e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 text-body-sm 
                           bg-transparent border border-white/30 rounded-soft
                           text-white placeholder:text-white/60
                           hover:border-white/50 focus:border-brand-orange focus:outline-none 
                           transition-colors duration-fast
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Subscribe"
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                           text-white hover:text-brand-orange 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors duration-fast
                           p-1 focus-ring"
                >
                  <ArrowRight size={20} />
                </button>
              </form>
              {message && (
                <p className={`text-label-sm mt-3 font-medium animate-fade-in ${
                  message.includes('Success') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {message}
                </p>
              )}
            </div>

            {/* Legal Links */}
            <div className="text-body-sm leading-relaxed text-white/80">
              {legalLinks.map((link, index) => (
                <span key={link.text}>
                  <Link 
                    to={link.href} 
                    className="hover:text-brand-orange transition-colors duration-fast"
                  >
                    {link.text}
                  </Link>
                  {index < legalLinks.length - 1 && ' | '}
                </span>
              ))}
            </div>

            {/* Copyright & Address */}
            <div className="text-body-sm leading-relaxed text-white/80 pt-4 border-t border-white/10">
              <p className="font-bold text-white">© 2026 LuminAID Lab LLC</p>
              <p className="italic mt-1">944 Industrial Park Rd.</p>
              <p className="italic">Littleton, NH 03561</p>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;