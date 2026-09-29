import { useState } from 'react'
import { Truck, ThumbsUp, Shield, Minus, Plus, ChevronDown } from 'lucide-react'
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
const AMOUNTS = ['$20', '$10', '$50', '$100']

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

// Replace with your dotted world-map asset
const WORLD_MAP = '/images/about/world-map.png'

// ============================================================================
// TRUST BADGES COMPONENT
// ============================================================================

const TrustBadges = () => (
  <section className="trust-badges py-12 px-8 bg-gray-100">
    <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
      <div className="trust-badge flex flex-col items-center gap-4">
        <Truck size={40} className="text-black" />
        <p className="trust-badge__text font-bold text-black text-base uppercase tracking-wide">Free US Shipping $99+</p>
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
  const [cause, setCause] = useState(CAUSES[0])
  const [amount, setAmount] = useState(AMOUNTS[0])
  const [quantity, setQuantity] = useState(1)

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
            <a href="/" className="hover:underline">Home</a> / <span className="text-black">Give Light</span>
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
            <button className="bg-primary-red text-white font-bold px-8 py-3.5 hover:bg-dark-red transition-colors text-base">
              Get Involved
            </button>
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
              <div className="aspect-square bg-gray-200 flex items-center justify-center mb-6">
                <span className="text-gray-400 text-lg">Product Image Gallery</span>
              </div>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`w-14 h-14 bg-gray-200 ${i === 1 ? 'border-2 border-black' : ''}`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Right - Product Details */}
            <div>
              <p className="text-xs font-bold uppercase text-gray-500 mb-4">Give Light Program</p>
              <h3 className="text-3xl font-heading font-bold text-black mb-4">Give Light</h3>
              <p className="text-xl text-black pb-6 mb-6 border-b border-gray-200">$20.00 USD</p>

              <div className="mb-6">
                <p className="text-base mb-3 font-semibold">Cause: <span className="text-primary-red transition-all duration-300">{cause}</span></p>
                <div className="flex flex-wrap gap-3">
                  {CAUSES.map((c) => (
                    <button key={c} onClick={() => setCause(c)} className={optionBtn(cause === c)}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-base mb-3 font-semibold">Amount: <span className="text-primary-red transition-all duration-300">{amount}</span></p>
                <div className="flex flex-wrap gap-3">
                  {AMOUNTS.map((a) => (
                    <button key={a} onClick={() => setAmount(a)} className={optionBtn(amount === a)}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-base mb-3 font-semibold">Quantity:</p>
                <div className="inline-flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-14 text-center text-base font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button className="w-full bg-primary-red text-white font-bold py-4 hover:bg-dark-red transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg mb-5 text-base">
                Add to Cart
              </button>

              <p className="text-sm text-gray-500 mb-5">Share</p>

              {/* Accordions */}
              <div className="border-t border-gray-200">
                {ACCORDIONS.map((item) => (
                  <details key={item.title} className="group border-b border-gray-200">
                    <summary className="flex items-center justify-between py-5 px-3 cursor-pointer list-none text-base font-bold text-black">
                      {item.title}
                      <ChevronDown size={18} className="transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="px-3 pb-5 text-sm text-gray-dark leading-relaxed">{item.body}</p>
                  </details>
                ))}
              </div>

              <p className="text-center text-sm font-bold text-black mt-8">
                FREE U.S. Shipping over $99!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Programs */}
      <section className="programs py-20 px-8 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-black text-center mb-16">
            Our Programs
          </h2>

          <div className="space-y-24">
            {PROGRAMS.map((program) => (
              <div key={program.id} className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-16 items-center">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-auto object-cover"
                />
                <div>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-black mb-5">
                    {program.title}
                  </h3>
                  {program.description.map((text, i) => (
                    <p key={i} className="text-base text-gray-dark leading-relaxed mb-5">
                      {text}
                    </p>
                  ))}
                  <a
                    href={program.link}
                    className="inline-block bg-primary-red text-white font-bold px-8 py-3.5 hover:bg-dark-red transition-colors text-base"
                  >
                    {program.cta}
                  </a>
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