// import ComingSoon from '../../components/common/ComingSoon';

// const Gifts = () => {
//   return (
//     <ComingSoon 
//       title="Gift Guide"
//       description="Find the perfect gift for outdoor enthusiasts and eco-conscious friends."
//     />
//   );
// };

// export default Gifts;



import { useEffect, useState } from 'react'

const categories = {
  gifts: 'Gifts',
  camping: 'Camping',
  preparedness: 'Emergency Preparedness',
  lighting: 'Warm Lighting',
  travel: 'Travel',
  bundles: 'Bundles',
}

const ProductGrid = ({ category, limit = 5 }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?category=${encodeURIComponent(category)}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()

        setProducts(data.products?.slice(0, limit) || [])
      } catch (error) {
        console.error(`Failed to load ${category} products:`, error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, limit])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {[...Array(limit)].map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-5 gap-y-10">
      {products.map((product) => (
        <div
          key={product._id || product.id}
          className="group"
        >
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 overflow-hidden">

            {/*
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            */}

            {product.badge && (
              <span className="absolute top-3 left-3 bg-black text-white text-xs font-medium px-3 py-1">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Information */}
          <div className="pt-4">
            <h3 className="text-sm font-medium leading-snug">
              {product.name}
            </h3>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium">
                {product.price}
              </span>

              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {product.oldPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const CampingHolidayGiftGuide = () => {
  return (
    <div className="w-full bg-white text-black">

      {/* Hero */}
      <section className="w-full">

        {/*
        <img
          src={heroImage}
          alt="LuminAID Holiday Gift Guide"
          className="w-full h-auto object-cover"
        />
        */}

        <div className="min-h-[500px] bg-gray-100 flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-4xl md:text-6xl font-semibold">
              Holiday Gift Guide
            </h1>

            <p className="mt-5 max-w-2xl mx-auto text-gray-600">
              Find the perfect gifts for campers, travelers,
              adventurers, and everyone who loves the outdoors.
            </p>
          </div>
        </div>

      </section>

      {/* Gift Guide Navigation */}
      <section className="border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 py-5">

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#best-selling"
              className="px-5 py-2 border border-black text-sm font-medium"
            >
              SHOP ALL GIFTS
            </a>

            <a
              href="#bundles"
              className="px-5 py-2 border border-gray-300 text-sm"
            >
              BUNDLE DEALS
            </a>

            <a
              href="#under-100"
              className="px-5 py-2 border border-gray-300 text-sm"
            >
              GIFTS UNDER $100
            </a>

            <a
              href="#under-50"
              className="px-5 py-2 border border-gray-300 text-sm"
            >
              GIFTS UNDER $50
            </a>
          </div>

        </div>
      </section>

      {/* Bestselling Gifts */}
      <section
        id="best-selling"
        className="max-w-[1200px] mx-auto px-6 py-16"
      >
        <div className="text-center mb-10">

          <h2 className="text-3xl md:text-4xl font-semibold">
            Shop Bestselling Gifts
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            What do you give the people who light up your life?
            We've got gift ideas for camping lovers, world travelers,
            power outage preppers, and more!
          </p>

        </div>

        <ProductGrid
          category={categories.gifts}
          limit={5}
        />

        <div className="text-center mt-10">
          <button className="border border-black px-7 py-3 text-sm font-medium">
            LOAD MORE PRODUCTS
          </button>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 py-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

            <div>
              {/*
              <img
                src={truckIcon}
                alt=""
                className="mx-auto w-10 h-10"
              />
              */}

              <h3 className="mt-3 font-medium">
                Free US Shipping $99+
              </h3>
            </div>

            <div>
              {/*
              <img
                src={thumbsUpIcon}
                alt=""
                className="mx-auto w-10 h-10"
              />
              */}

              <h3 className="mt-3 font-medium">
                10,000+ 5-Star Reviews
              </h3>
            </div>

            <div>
              {/*
              <img
                src={shieldIcon}
                alt=""
                className="mx-auto w-10 h-10"
              />
              */}

              <h3 className="mt-3 font-medium">
                Off-Grid Guarantee
              </h3>
            </div>

          </div>

        </div>
      </section>

      {/* Camping Gifts */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">

          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Bright Gift Ideas for Campers
            </h2>

            <p className="mt-4 text-gray-600 max-w-xl">
              Light up their camping adventures. Handpicked for
              outdoor lovers, hikers, backpackers, and overlanders.
            </p>

            <button className="mt-6 border border-black px-6 py-3 text-sm font-medium">
              SHOP ALL CAMPING GIFTS
            </button>
          </div>

          <div className="order-1 lg:order-2">
            {/*
            <img
              src={campingImage}
              alt="Camping gift ideas"
              className="w-full h-auto object-cover"
            />
            */}
            <div className="aspect-[4/3] bg-gray-100" />
          </div>

        </div>

        <ProductGrid
          category={categories.camping}
          limit={5}
        />

      </section>

      {/* Preparedness */}
      <section className="bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">

            <div>
              {/*
              <img
                src={preparednessImage}
                alt="Emergency preparedness gifts"
                className="w-full h-auto object-cover"
              />
              */}
              <div className="aspect-[4/3] bg-gray-200" />
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-semibold">
                Give the Gift of Preparedness
              </h2>

              <p className="mt-4 text-gray-600 max-w-xl">
                Help friends and neighbors be ahead of the game
                with a well-stocked emergency kit.
              </p>

              <button className="mt-6 border border-black px-6 py-3 text-sm font-medium">
                SHOP PREPAREDNESS GIFTS
              </button>
            </div>

          </div>

          <ProductGrid
            category={categories.preparedness}
            limit={5}
          />

        </div>
      </section>

      {/* Group Get-Togethers */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">

          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-semibold">
              For Group Get-Togethers
            </h2>

            <p className="mt-4 text-gray-600 max-w-xl">
              From dinner tables to dorm rooms, warm and colored
              lights can help create the perfect ambiance.
            </p>

            <button className="mt-6 border border-black px-6 py-3 text-sm font-medium">
              SHOP WARM LIGHTING
            </button>
          </div>

          <div className="order-1 lg:order-2">
            {/*
            <img
              src={lightingImage}
              alt="Warm lighting"
              className="w-full h-auto object-cover"
            />
            */}
            <div className="aspect-[4/3] bg-gray-100" />
          </div>

        </div>

        <ProductGrid
          category={categories.lighting}
          limit={5}
        />

      </section>

      {/* Travel */}
      <section className="bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">

            <div>
              {/*
              <img
                src={travelImage}
                alt="Travel gifts"
                className="w-full h-auto object-cover"
              />
              */}
              <div className="aspect-[4/3] bg-gray-200" />
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-semibold">
                For the Jetsetters
              </h2>

              <p className="mt-4 text-gray-600 max-w-xl">
                Power their next adventure with lightweight and
                packable gear they can use off-the-grid and on-the-go.
              </p>

              <button className="mt-6 border border-black px-6 py-3 text-sm font-medium">
                SHOP TRAVEL GIFTS
              </button>
            </div>

          </div>

          <ProductGrid
            category={categories.travel}
            limit={5}
          />

        </div>
      </section>

      {/* Bundle Deals */}
      <section
        id="bundles"
        className="max-w-[1200px] mx-auto px-6 py-16"
      >

        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-4xl font-semibold">
            Save With Bundle Deals
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            Shop curated bundles to find something for the whole
            family and save when you bundle it up.
          </p>

          <button className="mt-6 border border-black px-6 py-3 text-sm font-medium">
            SHOP BUNDLE DEALS
          </button>

        </div>

        <ProductGrid
          category={categories.bundles}
          limit={5}
        />

      </section>

      {/* Story */}
      <section className="bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            <div>
              {/*
              <img
                src={storyImage}
                alt="LuminAID founders"
                className="w-full h-auto object-cover"
              />
              */}
              <div className="aspect-[4/3] bg-gray-200" />
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-semibold">
                The LuminAID Story
              </h2>

              <p className="mt-5 text-gray-600 leading-relaxed">
                We were inspired to invent the LuminAID light after
                the 2010 Haiti Earthquake. We wanted to create
                something that could pack flat for easy transport,
                was waterproof and long-lasting, and powered by the
                sun.
              </p>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Today, LuminAID products are used for camping,
                emergency preparedness, and outdoor adventures.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* Gift of Light */}
      <section className="py-16">

        <div className="max-w-[1200px] mx-auto px-6 text-center">

          <h2 className="text-3xl md:text-4xl font-semibold">
            SHARE THE GIFT OF LIGHT THIS HOLIDAY SEASON
          </h2>

          <p className="mt-4 text-gray-600">
            Sponsor light for a family in need.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/*
            <img
              src={giveLightImageOne}
              alt="Give Light"
              className="w-full h-auto object-cover"
            />

            <img
              src={giveLightImageTwo}
              alt="Digital confirmation card"
              className="w-full h-auto object-cover"
            />

            <img
              src={giveLightImageThree}
              alt="Family receiving light"
              className="w-full h-auto object-cover"
            />
            */}

            <div className="aspect-square bg-gray-100" />
            <div className="aspect-square bg-gray-100" />
            <div className="aspect-square bg-gray-100" />

          </div>

        </div>

      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200">

        <div className="max-w-[900px] mx-auto px-6 py-16">

          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">
            Gifting Frequently Asked Questions
          </h2>

          <div className="divide-y divide-gray-200">

            <details className="py-5">
              <summary className="font-medium cursor-pointer">
                Can I add a gift message to my order? Do you offer gift receipts?
              </summary>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Yes. Gift messages and gift receipts are available
                with orders.
              </p>
            </details>

            <details className="py-5">
              <summary className="font-medium cursor-pointer">
                What's the difference between LuminAID products?
              </summary>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Visit the product comparison and buyer's guides
                to compare different LuminAID products.
              </p>
            </details>

            <details className="py-5">
              <summary className="font-medium cursor-pointer">
                What are your express shipping options?
              </summary>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Shipping options and pricing depend on the
                destination and selected service.
              </p>
            </details>

            <details className="py-5">
              <summary className="font-medium cursor-pointer">
                Can I split an order so it is shipped to multiple addresses?
              </summary>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Separate smaller orders can be placed for different
                shipping addresses.
              </p>
            </details>

            <details className="py-5">
              <summary className="font-medium cursor-pointer">
                How do I add a Give Light sponsorship to my order?
              </summary>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Add a Give Light sponsorship to your cart before
                completing your order.
              </p>
            </details>

          </div>

        </div>

      </section>

    </div>
  )
}

export default CampingHolidayGiftGuide