import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Truck, ThumbsUp, Shield, Minus, Plus, ChevronDown } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { get } from '../../services/api'
import giveLightBg from '../../assets/images/givelightbackground.jpg'

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
  <section className="trust-badges py-12 px-8 bg-gray-100">
    <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
      <div className="trust-badge flex flex-col items-center gap-4">
        <Truck size={40} className="text-black" />
        <p className="trust-badge__text font-bold text-black text-base uppercase tracking-wide">Free US Shipping RS 99+</p>
      </div>
      <div className="trust-badge flex flex-col items-center gap-4">
        <ThumbsUp size={40} className="text-black" />
        <p className="trust-badge__text font-bold text-black text-base uppercase tracking-wide">10,000+ Reviews</p>
      </div>
      <div className="trust-badge flex flex-col items-center gap-4">
        <Shield size={40} className="text-black" />
        <p className="trust-badge__text font-bold text-black text-base uppercase tracking-wide">Off-Grid Guarantee</p>
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
    `px-5 py-2.5 text-sm border transition-all duration-300 ease-in-out transform ${
      active ? 'border-black border-2 text-black font-semibold scale-105 shadow-md' : 'border-gray-300 text-black hover:border-black hover:scale-102 hover:shadow-sm'
    }`

  return (
    <div className="give-light-page w-full bg-white">

      {/* Breadcrumb + Page Title */}
      <section className="page-title pt-8 pb-10 px-8 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <nav className="text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:underline">Home</Link> / <span className="text-black">Give Light</span>
          </nav>
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-black tracking-tight text-center">
            Give Light
          </h1>
        </div>
      </section>

      {/* Hero Banner with Background */}
      <section className="hero-banner relative w-full overflow-hidden" style={{ minHeight: '500px' }}>
        <div className="hero-banner__background absolute inset-0">
          <img
            src="/images/givelightbackground.jpg"
            alt="Give Light Program"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="hero-banner__content relative max-w-[1280px] mx-auto h-full flex items-center justify-end px-8" style={{ minHeight: '500px' }}>
          <div className="bg-white text-black py-12 px-12 text-center w-full max-w-[400px] mr-0 md:mr-[8%]">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6 leading-tight uppercase">
              How we give light<br />and why it matters
            </h2>
            <a 
              href="#programs"
              className="bg-primary-red text-white font-bold px-8 py-3.5 hover:bg-dark-red transition-all duration-300 transform hover:scale-105 text-base inline-block"
            >
              Get Involved
            </a>
          </div>
        </div>
      </section>

      {/* Give Light Section Title */}
      <section className="section-title pt-16 pb-10 px-8 text-center bg-white">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-black">
            Give Light
          </h2>
        </div>
      </section>

      {/* Give Light Product Widget */}
      <section className="product-widget pb-20 px-8 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Left - Product Images */}
            <div>
              <div className="aspect-square bg-gray-200 flex items-center justify-center mb-6 overflow-hidden rounded-sm">
                <img 
                  src={donationImages[selectedImageIndex]} 
                  alt="Give Light Donation" 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {donationImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-14 h-14 bg-gray-200 overflow-hidden rounded-sm transition-all ${
                      selectedImageIndex === index ? 'ring-2 ring-black scale-105' : 'opacity-60 hover:opacity-100'
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
            <div>
              <p className="text-xs font-bold uppercase text-gray-500 mb-4">Give Light Program</p>
              <h3 className="text-3xl font-heading font-bold text-black mb-4">Give Light</h3>
              <p className="text-xl text-black pb-6 mb-6 border-b border-gray-200">RS 20.00</p>

              <div className="mb-6">
                <p className="text-base mb-3 font-semibold">
                  Cause: <span className="text-primary-red transition-all duration-300">{cause}</span>
                </p>
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

              <div className="mb-6">
                <p className="text-base mb-3 font-semibold">
                  Amount: <span className="text-primary-red transition-all duration-300">{amount}</span>
                </p>
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

              <div className="mb-6">
                <p className="text-base mb-3 font-semibold">Quantity:</p>
                <div className="inline-flex items-center border border-gray-300">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-14 text-center text-base font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleAddToCart}
                disabled={loading}
                className="w-full bg-primary-red text-white font-bold py-4 hover:bg-dark-red transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg mb-5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : `Add ${quantity} ${quantity === 1 ? 'Donation' : 'Donations'} to Cart`}
              </button>

              {showSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-5 text-center">
                  <p className="font-semibold">Added to cart!</p>
                </div>
              )}

              <p className="text-sm text-gray-500 mb-5 flex items-center justify-center gap-2">
                <span>Share:</span>
                <button 
                  type="button"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="text-black hover:text-primary-red transition-colors underline"
                >
                  Copy Link
                </button>
              </p>

              {/* Accordions */}
              <div className="border-t border-gray-200">
                {ACCORDIONS.map((item, index) => (
                  <details key={index} className="group border-b border-gray-200">
                    <summary className="flex items-center justify-between py-5 px-3 cursor-pointer list-none text-base font-bold text-black hover:text-primary-red transition-colors">
                      {item.title}
                      <ChevronDown size={18} className="transition-transform group-open:rotate-180 text-primary-red" />
                    </summary>
                    <p className="px-3 pb-5 text-sm text-gray-dark leading-relaxed">{item.body}</p>
                  </details>
                ))}
              </div>

              <p className="text-center text-sm font-bold text-black mt-8 bg-gray-50 py-3 px-4 rounded-sm">
                ✨ FREE U.S. Shipping over RS 99!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Programs */}
      <section id="programs" className="programs py-20 px-8 bg-white scroll-mt-20">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-black text-center mb-16">
            Our Programs
          </h2>

          <div className="space-y-24">
            {PROGRAMS.map((program, index) => (
              <div 
                key={program.id} 
                className={`grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-16 items-center ${
                  index % 2 === 1 ? 'md:grid-flow-dense' : ''
                }`}
              >
                <div className={`overflow-hidden rounded-sm ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-black mb-5">
                    {program.title}
                  </h3>
                  {program.description.map((text, i) => (
                    <p key={i} className="text-base text-gray-dark leading-relaxed mb-5">
                      {text}
                    </p>
                  ))}
                  <Link
                    to={program.link}
                    className="inline-block bg-primary-red text-white font-bold px-8 py-3.5 hover:bg-dark-red transition-all duration-300 transform hover:scale-105 text-base"
                  >
                    {program.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact pt-12 pb-20 px-8 bg-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <img
            src={WORLD_MAP}
            alt="Map of countries reached"
            className="mx-auto w-full max-w-[500px] h-auto mb-10"
          />
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-black mb-14 leading-tight max-w-[900px] mx-auto">
            LuminAID solar lights have been distributed in over 100 countries around the world.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {IMPACT_STORIES.map((story) => (
              <div key={story.title} className="impact-card">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-[200px] object-cover mb-4"
                />
                <p className="text-lg font-bold text-black leading-snug">
                  {story.title}
                </p>
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