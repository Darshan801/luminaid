import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Book, ChevronRight } from 'lucide-react'
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
      <div className="w-full min-h-screen flex items-center justify-center bg-warm-paper">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 
                        border-4 border-brand-orange border-t-transparent mb-4"></div>
          <p className="text-body-md text-muted-neutral">Loading guides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guides-page w-full bg-white">

      {/* Breadcrumb */}
      <section className="breadcrumb py-4 px-6 md:px-8 bg-white border-b border-gray-100">
        <div className="container max-w-content mx-auto">
          <nav className="text-body-sm text-muted-neutral">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-fast">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/support/guides" className="hover:text-brand-orange transition-colors duration-fast">Support</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal font-medium">Product Guides</span>
          </nav>
        </div>
      </section>

      {/* Page Title */}
      <section className="section-py bg-gradient-to-b from-warm-paper to-white text-center">
        <div className="container max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center">
              <Book size={32} className="text-brand-orange" />
            </div>
          </div>
          <h1 className="text-heading-lg md:text-heading-xl font-display font-bold text-charcoal mb-4">
            Product Support Guides
          </h1>
          <p className="text-body-lg text-muted-neutral max-w-2xl mx-auto">
            Everything you need to get the most out of your LuminAID products
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="section-py-lg bg-white">
        <div className="container max-w-content mx-auto">
          
          {/* First Row - 3 Guides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
            {guides.slice(0, 3).map((guide) => (
              <a 
                key={guide.id}
                href={guide.link}
                className="guide-card group block bg-white border border-gray-100 rounded-soft 
                         overflow-hidden hover:border-brand-orange hover:shadow-medium 
                         transition-all duration-normal"
              >
                <div className="guide-card__image-wrapper relative bg-gray-100 overflow-hidden aspect-[4/3]">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 
                             transition-transform duration-slow"
                  />
                  {guide.featured && (
                    <div className="absolute inset-0 flex items-center justify-center bg-charcoal/80">
                      <div className="bg-white/95 px-8 py-6 text-center max-w-[85%] rounded-soft">
                        <div className="text-brand-orange text-title-lg font-bold mb-2">
                          Ready to Shine?
                        </div>
                        <div className="text-body-sm text-charcoal leading-snug">
                          Print our Getting Started guide to include in their package
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="guide-card__content p-6">
                  <h3 className="text-title-lg font-bold text-charcoal mb-3 
                               group-hover:text-brand-orange transition-colors duration-fast">
                    {guide.title}
                  </h3>
                  <p className="text-body-sm text-muted-neutral leading-relaxed line-clamp-3 mb-4">
                    {guide.description}
                  </p>
                  <div className="flex items-center gap-2 text-brand-orange text-body-sm font-bold 
                                group-hover:gap-3 transition-all duration-fast">
                    <span>Read Guide</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Second Row - Remaining Guides */}
          {guides.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              {guides.slice(3).map((guide) => (
                <a 
                  key={guide.id}
                  href={guide.link}
                  className="guide-card group block bg-white border border-gray-100 rounded-soft 
                           overflow-hidden hover:border-brand-orange hover:shadow-medium 
                           transition-all duration-normal"
                >
                  <div className="guide-card__image-wrapper relative bg-gray-100 overflow-hidden aspect-[4/3]">
                    <img 
                      src={guide.image} 
                      alt={guide.title}
                      className="w-full h-full object-cover group-hover:scale-105 
                               transition-transform duration-slow"
                    />
                  </div>

                  <div className="guide-card__content p-6">
                    <h3 className="text-title-lg font-bold text-charcoal mb-3 
                                 group-hover:text-brand-orange transition-colors duration-fast">
                      {guide.title}
                    </h3>
                    <p className="text-body-sm text-muted-neutral leading-relaxed line-clamp-3 mb-4">
                      {guide.description}
                    </p>
                    <div className="flex items-center gap-2 text-brand-orange text-body-sm font-bold 
                                  group-hover:gap-3 transition-all duration-fast">
                      <span>Read Guide</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Help CTA */}
      <section className="section-py bg-warm-paper text-center">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-heading-md font-display font-bold text-charcoal mb-4">
            Need More Help?
          </h2>
          <p className="text-body-lg text-muted-neutral mb-8">
            Can't find what you're looking for? Our support team is here to assist you.
          </p>
          <Link
            to="/support/contact"
            className="inline-flex items-center justify-center gap-2
                     bg-brand-orange text-white font-bold 
                     px-10 py-4 text-body-md
                     rounded-soft shadow-medium
                     hover:bg-brand-red hover:shadow-glow-md
                     active:scale-[0.98]
                     transition-all duration-normal"
          >
            Contact Support
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Guides;
