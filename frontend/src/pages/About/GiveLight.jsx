import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Truck, ThumbsUp, Shield, Minus, Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { get } from '../../services/api'

// ============================================================================
// CONSTANTS
// ============================================================================

const PROGRAMS = [
  {
    id: 1,
    title: 'Give Light, Get Light Program',
    description: [
      'Through our website, consumers can sponsor light for a family in need, to be distributed by our charitable partners.',
      'More than 50,000 solar lights have been sent to families through the Give Light, Get Light Program.'
    ],
    image: '/images/about/Give_Light_IMage_600x_600x_ecd10507-0713-4923-8679-9b4659179ffe_600x.jpg',
    link: '/give-light/get-light',
    cta: 'Give Light'
  },
  {
    id: 2,
    title: 'Nonprofit Subsidy Program',
    description: [
      'Charitable organizations are able to gather more supplies for their cause through our subsidy program. LuminAID works with these humanitarian groups to get higher quantities of solar aid.',
      'Our subsidy partners work within disaster relief, education, rural development, women\'s empowerment and beyond.'
    ],
    image: '/images/about/Homepage_Our_Founders_1400x.png',
    link: '/give-light/nonprofit',
    cta: 'Apply To Program'
  },
  {
    id: 3,
    title: 'Corporate Giving',
    description: [
      'Give the gift of light in honor of your clients or employees. You can even customize our solar lanterns with your company\'s logo.',
      'Request a quote for more information on how your company can get involved in our Give Light, Get Light program.'
    ],
    image: '/images/products/StringLightatSunset.jpg',
    link: '/give-light/corporate',
    cta: 'Request a Quote'
  }
]

const CAUSES = ['Disaster Relief', 'Allocate as Needed', 'Refugee Relief']
const AMOUNTS = ['RS 20', 'RS 10', 'RS 50', 'RS 100']

const ACCORDIONS = [
  { title: 'Disaster Relief', body: 'Your light will be sent to families affected by natural disasters around the world.' },
  { title: 'Refugee Relief (Ukraine)', body: 'Your light will support displaced families and refugees from the conflict in Ukraine.' },
  { title: 'Allocate as Needed', body: 'We will send your light to where it is needed most.' }
]

const IMPACT_STORIES = [
  {
    title: 'Notes from the Field: An Update from buildOn\'s Adult Literacy Program',
    image: '/images/about/Give_Light_IMage_600x_600x_ecd10507-0713-4923-8679-9b4659179ffe_600x.jpg'
  },
  {
    title: 'Hope Connection: Serving the Homeless During COVID-19',
    image: '/images/about/Homepage_Our_Founders_1400x.png'
  },
  {
    title: 'Breaking Down Barriers to Education During COVID-19',
    image: '/images/products/StringLightatSunset.jpg'
  }
]

// Using local SVG placeholder to avoid external requests
const createPlaceholderSVG = (text, width, height) => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#f5f5f5"/>
      <circle cx="400" cy="200" r="150" fill="#e0e0e0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#999">World Map Placeholder</text>
    </svg>
  `)}`
}

const WORLD_MAP = createPlaceholderSVG('World Map', 800, 400)

// ============================================================================
// TRUST BADGES COMPONENT
// ============================================================================

const TrustBadges = () => (
  <section className="w-full bg-gradient-to-br from-orange-50 via-warm-paper to-red-50 py-12 md:py-16">
    <div className="max-w-[1440px] mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-soft">
            <Truck size={32} className="text-brand-orange" />
          </div>
          <p className="font-bold text-gray-900 text-sm uppercase tracking-wider">
            FREE SHIPPING RS 99+
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-soft">
            <ThumbsUp size={32} className="text-brand-orange" />
          </div>
          <p className="font-bold text-gray-900 text-sm uppercase tracking-wider">
            10,000+ Reviews
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-soft">
            <Shield size={32} className="text-brand-orange" />
          </div>
          <p className="font-bold text-gray-900 text-sm uppercase tracking-wider">
            Off-Grid Guarantee
          </p>
        </div>

      </div>
    </div>
  </section>
)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const GiveLight = () => {
  const navigate = useNavigate();
  const { addToCart, refreshCart } = useCart();
  const [cause, setCause] = useState(CAUSES[0])
  const [amount, setAmount] = useState(AMOUNTS[0])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [donationProducts, setDonationProducts] = useState({});

  // Dynamic images for the donation product
  const donationImages = [
    '/images/about/Give_Light_IMage_600x_600x_ecd10507-0713-4923-8679-9b4659179ffe_600x.jpg',
    '/images/about/Consumer_Use_Cases_600x_600x_74f78713-261e-4a82-81cc-b35f6283092b_600x.jpg',
    '/images/about/Homepage_Our_Founders_1400x.png',
    '/images/products/0196-150_Max_QI_product_image.jpg',
    '/images/products/PLTNRProductImage_sizerelative_withphone_lightgraybackground.jpg',
    '/images/about/Crowdfunding_Image_600x_600x_db9b920c-daf8-4c06-bb3d-aa6e64769622_600x.jpg'
  ];

  // Fetch donation products from backend
  useEffect(() => {
    const fetchDonationProducts = async () => {
      try {
        const response = await get('/products?category=Donation');
        if (response.success) {
          // Map products by amount for easy lookup
          const productsMap = {};
          response.data.forEach(product => {
            productsMap[`RS ${product.price}`] = product;
          });
          setDonationProducts(productsMap);
        }
      } catch (error) {
        console.error('Failed to fetch donation products:', error);
      }
    };

    fetchDonationProducts();
  }, []);

  const handleAddToCart = async () => {
    setLoading(true);
    
    try {
      // Get the product ID for the selected donation amount
      const donationProduct = donationProducts[amount];
      
      if (!donationProduct) {
        throw new Error('Donation product not found');
      }

      // Add to cart using the actual product ID
      const result = await addToCart(donationProduct._id, quantity);
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Failed to add donation:', error);
      alert('Failed to add donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const optionBtn = (active) =>
    `px-5 py-2.5 text-sm rounded-soft border transition-all duration-fast ${
      active 
        ? 'border-brand-orange bg-brand-orange text-white font-bold shadow-glow-sm' 
        : 'border-gray-300 text-gray-700 bg-white hover:border-brand-orange hover:text-brand-orange'
    }`

  return (
    <div className="w-full bg-warm-paper">

      {/* Breadcrumb */}
      <section className="w-full bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-fast">
              Home
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">Give Light</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full relative overflow-hidden" style={{ minHeight: '500px' }}>
        <div className="absolute inset-0">
          <img
            src="/images/givelightbackground.jpg"
            alt="Give Light Program"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 h-full flex items-center" style={{ minHeight: '500px' }}>
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Give Light
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
              Help us bring safe, sustainable light to communities around the world
            </p>
            <a 
              href="#donate"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-soft
                       text-sm font-bold tracking-wide uppercase
                       hover:bg-brand-orange-dark active:scale-95
                       transition-all duration-fast
                       shadow-glow-md hover:shadow-glow-lg"
            >
              DONATE NOW
              <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Give Light Donation Widget */}
      <section id="donate" className="w-full bg-white py-16 md:py-20 scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Make a Donation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your donation helps bring safe, solar-powered light to families in need around the world
            </p>
          </div>

          <div className="max-w-6xl mx-auto bg-white rounded-soft border border-gray-200 shadow-medium overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              {/* Left - Product Images */}
              <div className="bg-gray-50 p-8 md:p-12">
                <div className="aspect-square bg-white rounded-soft overflow-hidden mb-6 shadow-soft">
                  <img 
                    src={donationImages[selectedImageIndex]} 
                    alt="Give Light Donation" 
                    className="w-full h-full object-cover transition-opacity duration-normal"
                  />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {donationImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 bg-white rounded-soft overflow-hidden
                               border-2 transition-all duration-fast ${
                        selectedImageIndex === index 
                          ? 'border-brand-orange scale-105 shadow-soft' 
                          : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right - Product Details */}
              <div className="p-8 md:p-12">
                <div className="mb-6">
                  <span className="inline-block bg-brand-orange/10 text-brand-orange text-xs font-bold 
                                 uppercase tracking-wider px-3 py-1 rounded-subtle mb-4">
                    Give Light Program
                  </span>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">
                    Give Light
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">RS 20.00</p>
                </div>

                <div className="space-y-6">
                  
                  {/* Cause Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Cause: <span className="text-brand-orange">{cause}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {CAUSES.map((c) => (
                        <button 
                          key={c} 
                          onClick={() => setCause(c)} 
                          className={optionBtn(cause === c)}
                          type="button"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Amount: <span className="text-brand-orange">{amount}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {AMOUNTS.map((a) => (
                        <button 
                          key={a} 
                          onClick={() => setAmount(a)} 
                          className={optionBtn(amount === a)}
                          type="button"
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Quantity:
                    </label>
                    <div className="inline-flex items-center bg-gray-50 rounded-soft border border-gray-300">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-3 hover:bg-gray-100 transition-colors duration-fast"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={18} className="text-gray-700" />
                      </button>
                      <span className="w-16 text-center text-base font-bold text-gray-900">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-3 hover:bg-gray-100 transition-colors duration-fast"
                        aria-label="Increase quantity"
                      >
                        <Plus size={18} className="text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    type="button"
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="w-full bg-brand-orange text-white font-bold py-4 rounded-soft
                             text-base uppercase tracking-wide
                             hover:bg-brand-orange-dark active:scale-95
                             transition-all duration-fast
                             shadow-glow-sm hover:shadow-glow-md
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Adding...' : `Add ${quantity} ${quantity === 1 ? 'Donation' : 'Donations'} to Cart`}
                  </button>

                  {/* Success Message */}
                  {showSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-soft text-center">
                      <p className="font-semibold">✓ Added to cart!</p>
                    </div>
                  )}

                  {/* Accordions */}
                  <div className="border-t border-gray-200 pt-6">
                    {ACCORDIONS.map((item, index) => (
                      <details key={index} className="group border-b border-gray-200 last:border-b-0">
                        <summary className="flex items-center justify-between py-4 cursor-pointer list-none
                                          text-sm font-bold text-gray-900 hover:text-brand-orange
                                          transition-colors duration-fast">
                          {item.title}
                          <ChevronDown size={18} className="transition-transform duration-fast group-open:rotate-180 text-brand-orange" />
                        </summary>
                        <p className="pb-4 text-sm text-gray-700 leading-relaxed">{item.body}</p>
                      </details>
                    ))}
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Our Programs */}
      <section id="programs" className="w-full bg-gradient-to-br from-orange-50 via-warm-paper to-red-50 py-16 md:py-20 scroll-mt-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 text-center mb-16">
            Our Programs
          </h2>

          <div className="space-y-20">
            {PROGRAMS.map((program, index) => (
              <div 
                key={program.id} 
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                <div className={`overflow-hidden rounded-soft shadow-medium ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-auto object-cover transition-transform duration-slow hover:scale-105"
                  />
                </div>
                <div className={`max-w-xl ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-5">
                    {program.title}
                  </h3>
                  <div className="space-y-4 mb-8">
                    {program.description.map((text, i) => (
                      <p key={i} className="text-base md:text-lg text-gray-700 leading-relaxed">
                        {text}
                      </p>
                    ))}
                  </div>
                  <Link
                    to={program.link}
                    className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3.5 rounded-soft
                             text-sm font-bold tracking-wide uppercase
                             hover:bg-brand-orange-dark active:scale-95
                             transition-all duration-fast
                             shadow-glow-sm hover:shadow-glow-md"
                  >
                    {program.cta}
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          
          {/* World Map */}
          <div className="text-center mb-12">
            <img
              src={WORLD_MAP}
              alt="Map of countries reached"
              className="mx-auto w-full max-w-3xl h-auto mb-10 rounded-soft"
            />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-gray-900 leading-tight max-w-4xl mx-auto mb-4">
              LuminAID solar lights have been distributed in over 100 countries around the world.
            </h2>
          </div>

          {/* Impact Stories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {IMPACT_STORIES.map((story) => (
              <div key={story.title} className="group">
                <div className="overflow-hidden rounded-soft shadow-soft mb-5 
                              transition-shadow duration-normal group-hover:shadow-medium">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-64 object-cover transition-transform duration-slow 
                             group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-brand-orange
                             transition-colors duration-fast">
                  {story.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustBadges />

    </div>
  );
};

export default GiveLight;