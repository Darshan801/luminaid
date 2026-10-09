import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Truck, ThumbsUp, Shield } from 'lucide-react'
import { get } from '../../services/api';

// ============================================================================
// CONSTANTS
// ============================================================================

const GUIDES = [
  {
    id: 1,
    title: 'Getting Started: The PackLite Titan',
    description: 'Getting started, learn how to inflate the Titan, buttons and indicator lights, how to recharge the Titan, how to change a phone. The Titan is compatible with all USB phones with an output cord. Using this Titan USB output port, you can see your next cable plug. It will also charge tablets, cameras, and other small electronics that charge by USB.',
    image: '/images/products/0196-150_Max_QI_product_image.jpg',
    link: '/guides/packlite-titan'
  },
  {
    id: 2,
    title: 'Print the Getting Started Guide',
    description: 'Using LuminAID as a gift? Not everyone may have a copy of our Getting Started guide on-hands in their package.',
    image: '/images/products/0196-150_Max_QI_product_image.jpg',
    link: '/guides/print-guide',
    featured: true
  },
  {
    id: 3,
    title: 'Tips - Phone Charging',
    description: 'How to Charge Your Phone Using a LuminAID 2-in-1 Phone Charger. Plug the USB end of your phone\'s charging cable into the USB charging port on the LuminAID Phone Charger.',
    image: '/images/products/0196-150_Max_QI_product_image.jpg',
    link: '/guides/phone-charging'
  },
  {
    id: 4,
    title: 'Getting Started With Your Bloomio Lights',
    description: 'Set Up, Playing Bloom: getting started, turn on Bluetooth on your Lights by pressing and holding the power button for 5 seconds.',
    image: '/images/products/StringLightatSunset.jpg',
    link: '/guides/bloomio-lights'
  },
  {
    id: 5,
    title: 'Bloomio Tips - Connecting with the App',
    description: 'Connecting to Bloomio with Its App To download our app, just search "LuminAID" in the App Store or Google Play. Need help?',
    image: '/images/products/StringLightatSunset.jpg',
    link: '/guides/bloomio-app'
  }
]

// ============================================================================
// TRUST BADGES COMPONENT
// ============================================================================

const TrustBadges = () => (
  <section className="trust-badges py-12 px-8 bg-white border-t border-gray-200">
    <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
      <div className="trust-badge flex flex-col items-center gap-3">
        <Truck size={36} className="text-black" />
        <p className="trust-badge__text font-bold text-black text-[15px]">FREE US SHIPPING RS 99+</p>
      </div>
      <div className="trust-badge flex flex-col items-center gap-3">
        <ThumbsUp size={36} className="text-black" />
        <p className="trust-badge__text font-bold text-black text-[15px]">10,000+ REVIEWS</p>
      </div>
      <div className="trust-badge flex flex-col items-center gap-3">
        <Shield size={36} className="text-black" />
        <p className="trust-badge__text font-bold text-black text-[15px]">OFF-GRID GUARANTEE</p>
      </div>
    </div>
  </section>
)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await get('/support/guides');
        if (response.success) {
          setGuides(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch guides:', error);
        // Fallback to static guides if API fails
        setGuides(GUIDES);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading guides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guides-page w-full bg-white">

      {/* Breadcrumb */}
      <section className="breadcrumb py-4 px-8 bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto">
          <nav className="breadcrumb__nav text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/support/guides" className="hover:text-black">Support</Link>
            <span className="mx-2">/</span>
            <span className="text-black">getstarted</span>
          </nav>
        </div>
      </section>

      {/* Page Title */}
      <section className="page-title py-16 px-8 text-center">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-[48px] font-heading font-bold text-black tracking-tight">
            Product Support
          </h1>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="guides-grid py-12 px-8">
        <div className="max-w-[1280px] mx-auto">
          
          {/* First Row - 3 Guides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {guides.slice(0, 3).map((guide) => (
              <a 
                key={guide.id}
                href={guide.link}
                className="guide-card group block bg-white hover:shadow-lg transition-shadow"
              >
                <div className="guide-card__image-wrapper relative bg-gray-100 overflow-hidden mb-4">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {guide.featured && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/95 px-8 py-6 text-center max-w-[80%]">
                        <div className="text-primary-red text-[20px] font-bold mb-2">Ready to Shine?</div>
                        <div className="text-[13px] text-gray-dark leading-snug">
                          Print our Getting Started guide to include in their package
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="guide-card__content">
                  <h3 className="guide-card__title text-[20px] font-bold text-black mb-3 group-hover:text-primary-red transition-colors">
                    {guide.title}
                  </h3>
                  <p className="guide-card__description text-[14px] text-gray-dark leading-relaxed line-clamp-4">
                    {guide.description}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Second Row - Remaining Guides */}
          {guides.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[880px]">
              {guides.slice(3).map((guide) => (
              <a 
                key={guide.id}
                href={guide.link}
                className="guide-card group block bg-white hover:shadow-lg transition-shadow"
              >
                <div className="guide-card__image-wrapper relative bg-gray-100 overflow-hidden mb-4">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="guide-card__content">
                  <h3 className="guide-card__title text-[20px] font-bold text-black mb-3 group-hover:text-primary-red transition-colors">
                    {guide.title}
                  </h3>
                  <p className="guide-card__description text-[14px] text-gray-dark leading-relaxed line-clamp-4">
                    {guide.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
          )}

        </div>
      </section>

      <TrustBadges />

    </div>
  );
};

export default Guides;
