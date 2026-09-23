const allProducts = [
  {
    id: 1,
    name: 'Mini Medical Kit',
    price: 15.99,
    category: 'Accessories',
    bestFor: ['Gifting', 'Camping', 'Emergency Preparedness'],
    features: [],
    lightColor: [],
  },
  {
    id: 2,
    name: 'SPF 37 Skin Protection Stick',
    price: 19.99,
    oldPrice: 24.99,
    category: 'Accessories',
    bestFor: ['Gifting', 'Camping', 'Travel'],
    features: [],
    lightColor: [],
  },
  {
    id: 3,
    name: 'Plasma Dual-Arc Lighter',
    price: 25.99,
    category: 'Accessories',
    bestFor: ['Gifting', 'Camping', 'Travel'],
    features: [],
    lightColor: [],
    soldOut: true,
  },
  {
    id: 4,
    name: 'SOL PackIt Survival Card Tool',
    price: 9.99,
    category: 'Accessories',
    bestFor: ['Camping', 'Emergency Preparedness'],
    features: [],
    lightColor: [],
  },
  {
    id: 5,
    name: 'Emergency Blanket XL',
    price: 10.99,
    category: 'Accessories',
    bestFor: ['Camping', 'Emergency Preparedness'],
    features: [],
    lightColor: [],
  },
  {
    id: 6,
    name: 'Adventure Toiletry Kit',
    price: 34.99,
    oldPrice: 54.99,
    category: 'Accessories',
    bestFor: ['Gifting', 'Camping', 'Travel'],
    features: [],
    lightColor: [],
  },
  {
    id: 7,
    name: 'Travel Toothbrush',
    price: 19.99,
    category: 'Accessories',
    bestFor: ['Gifting', 'Camping', 'Travel'],
    features: [],
    lightColor: [],
  },
  {
    id: 8,
    name: 'Universal Multi-Cable',
    price: 16.99,
    category: 'Accessories',
    bestFor: ['Gifting', 'Camping', 'Travel'],
    features: ['Charges Phones'],
    lightColor: [],
  },
  {
    id: 9,
    name: 'Emergency Fire Blanket',
    price: 34.99,
    oldPrice: 49.99,
    category: 'Accessories',
    bestFor: ['Camping', 'Emergency Preparedness'],
    features: [],
    lightColor: [],
  },
  {
    id: 10,
    name: 'Backyard Adventure First Aid Kit',
    price: 9.99,
    oldPrice: 15.00,
    category: 'Accessories',
    bestFor: ['Camping', 'Home/Garden'],
    features: [],
    lightColor: [],
  },
  {
    id: 11,
    name: 'Easy Care® Comprehensive First Aid Kit',
    price: 55.00,
    category: 'Accessories',
    bestFor: ['Camping', 'Emergency Preparedness'],
    features: [],
    lightColor: [],
  },
  {
    id: 12,
    name: 'USB String Lights Combo Pack',
    price: 19.99,
    oldPrice: 29.99,
    badge: 'SAVE $10.00',
    category: 'Accessories',
    bestFor: ['Gifting', 'Camping', 'Home/Garden'],
    features: ['Charges Phones'],
    lightColor: ['Warm White', 'Multi-Color'],
  },
  {
    id: 13,
    name: 'Pocket Chain Saw',
    price: 29.00,
    category: 'Accessories',
    bestFor: ['Camping', 'Emergency Preparedness'],
    features: [],
    lightColor: [],
  },
  {
    id: 14,
    name: 'Fire Lite Fuel-Free Lighter',
    price: 36.00,
    category: 'Accessories',
    bestFor: ['Camping', 'Emergency Preparedness', 'Travel'],
    features: [],
    lightColor: [],
  },
  {
    id: 15,
    name: 'Map Compass',
    price: 5.99,
    oldPrice: 9.99,
    category: 'Accessories',
    bestFor: ['Camping', 'Travel'],
    features: [],
    lightColor: [],
  },
  {
    id: 16,
    name: 'QuikClot Gauze (3" x 2\')',
    price: 19.99,
    category: 'Accessories',
    bestFor: ['Camping', 'Emergency Preparedness'],
    features: [],
    lightColor: [],
  },
  {
    id: 17,
    name: 'Camp Kitchen Clean-Up Kit',
    price: 39.99,
    oldPrice: 43.99,
    category: 'Accessories',
    bestFor: ['Camping', 'Travel'],
    features: [],
    lightColor: [],
  },
  {
    id: 18,
    name: 'Camping Trowel Toilet Kit',
    price: 39.99,
    oldPrice: 43.99,
    category: 'Accessories',
    bestFor: ['Camping', 'Travel'],
    features: [],
    lightColor: [],
  },
  {
    id: 19,
    name: 'Heavy Duty Emergency Blanket',
    price: 18.99,
    category: 'Accessories',
    bestFor: ['Camping', 'Emergency Preparedness'],
    features: [],
    lightColor: [],
  },
  {
    id: 20,
    name: 'NEW! Solar String Light',
    price: 75.00,
    badge: 'NEW!',
    category: 'Accessories',
    bestFor: ['Gifting', 'Camping', 'Home/Garden'],
    features: [],
    lightColor: ['Warm White'],
  },
  {
    id: 21,
    name: 'LuminAID Decal',
    price: 1.00,
    category: 'Accessories',
    bestFor: ['Gifting', 'Kids'],
    features: [],
    lightColor: [],
    soldOut: true,
  },
  {
    id: 22,
    name: 'NEW! Trio Magnetic Light System',
    price: 77.00,
    badge: 'NEW!',
    category: 'Accessories',
    bestFor: ['Gifting', 'Camping', 'Emergency Preparedness', 'Travel'],
    features: ['Magnets'],
    lightColor: ['White', 'Warm White'],
  },
  {
    id: 23,
    name: 'Halloween Sticker Set',
    price: 9.99,
    category: 'Accessories',
    bestFor: ['Gifting', 'Kids'],
    features: [],
    lightColor: [],
    soldOut: true,
  },
  {
    id: 24,
    name: 'Accident Pack First Aid Kit',
    price: 64.99,
    category: 'Accessories',
    bestFor: ['Camping', 'Emergency Preparedness'],
    features: [],
    lightColor: [],
  },
]

const products = allProducts.filter(
  (product) => product.category === 'Accessories'
)

const bestFor = [
  'Gifting',
  'Camping',
  'Emergency Preparedness',
  'Travel',
  'Home/Garden',
  'Kids',
]

const features = [
  'Charges Phones',
  'Magnets',
]

const lightColors = [
  'White',
  'Warm White',
  'Multi-Color',
]

const getFilterCount = (key, value) => {
  return products.filter((product) =>
    product[key]?.includes(value)
  ).length
}

const formatPrice = (price) => {
  return `$${price.toFixed(2)} USD`
}

const Accessories = () => {
  return (
    <div className="w-full bg-white text-black">

      {/* Collection Header */}
      <section className="max-w-[1200px] mx-auto px-6 pt-10 pb-8">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Accessories
        </h1>
      </section>

      {/* Collection */}
      <section className="max-w-[1200px] mx-auto px-6 pb-16">
        <div className="flex gap-10">

          {/* Filters */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24">

              <h2 className="text-lg font-medium mb-6">
                Filters
              </h2>

              {/* Best For */}
              <div className="border-t border-gray-200 py-5">
                <h3 className="font-medium mb-4">
                  Best For
                </h3>

                <div className="space-y-3">
                  {bestFor.map((item) => (
                    <label
                      key={item}
                      className="flex items-center justify-between gap-3 text-sm cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                        />
                        <span>{item}</span>
                      </span>

                      <span className="text-gray-500">
                        ({getFilterCount('bestFor', item)})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 py-5">
                <h3 className="font-medium mb-4">
                  Features
                </h3>

                <div className="space-y-3">
                  {features.map((item) => (
                    <label
                      key={item}
                      className="flex items-center justify-between gap-3 text-sm cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                        />
                        <span>{item}</span>
                      </span>

                      <span className="text-gray-500">
                        ({getFilterCount('features', item)})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Light Color */}
              <div className="border-t border-gray-200 py-5">
                <h3 className="font-medium mb-4">
                  Light Color
                </h3>

                <div className="space-y-3">
                  {lightColors.map((item) => (
                    <label
                      key={item}
                      className="flex items-center justify-between gap-3 text-sm cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                        />
                        <span>{item}</span>
                      </span>

                      <span className="text-gray-500">
                        ({getFilterCount('lightColor', item)})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-gray-200 py-5">
                <h3 className="font-medium mb-4">
                  Price
                </h3>

                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center border border-gray-300 px-3 py-2">
                    <span className="mr-1">$</span>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-16 outline-none"
                    />
                  </div>

                  <span>to</span>

                  <div className="flex items-center border border-gray-300 px-3 py-2">
                    <span className="mr-1">$</span>
                    <input
                      type="number"
                      placeholder="77"
                      className="w-16 outline-none"
                    />
                  </div>
                </div>

                <button className="mt-4 w-full border border-black py-2 text-sm font-medium">
                  Apply filters
                </button>
              </div>

            </div>
          </aside>

          {/* Product Area */}
          <div className="flex-1">

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-8">

              <p className="text-sm text-gray-600">
                {products.length} products
              </p>

              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm">
                  Sort by
                </span>

                <select
                  className="border border-gray-300 bg-white px-4 py-2 text-sm"
                  defaultValue="featured"
                >
                  <option value="featured">
                    Featured
                  </option>
                  <option value="relevant">
                    Most relevant
                  </option>
                  <option value="best-selling">
                    Best selling
                  </option>
                  <option value="az">
                    Alphabetically, A-Z
                  </option>
                  <option value="za">
                    Alphabetically, Z-A
                  </option>
                  <option value="price-low">
                    Price, low to high
                  </option>
                  <option value="price-high">
                    Price, high to low
                  </option>
                  <option value="date-old">
                    Date, old to new
                  </option>
                  <option value="date-new">
                    Date, new to old
                  </option>
                </select>
              </div>

            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">

              {products.map((product) => (
                <div
                  key={product.id}
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

                    {product.soldOut && (
                      <span className="absolute bottom-3 left-3 bg-white text-black text-xs font-medium px-3 py-1">
                        Sold out
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="pt-4">
                    <h3 className="text-sm md:text-base font-medium leading-snug">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatPrice(product.price)}
                      </span>

                      {product.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}

            </div>

          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="text-center">
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

            <div className="text-center">
              {/*
              <img
                src={thumbsUpIcon}
                alt=""
                className="mx-auto w-10 h-10"
              />
              */}

              <h3 className="mt-3 font-medium">
                10,000+ Reviews
              </h3>
            </div>

            <div className="text-center">
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

    </div>
  )
}

export default Accessories