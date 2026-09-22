// import ComingSoon from '../../components/common/ComingSoon';

// const PowerLanterns = () => {
//   return (
//     <ComingSoon 
//       title="Power Lanterns"
//       description="Discover our solar-powered lanterns perfect for camping and emergencies."
//     />
//   );
// };

// export default PowerLanterns;





const PowerLanterns = () => {
  const products = [
    {
      id: 1,
      name: 'PackLite Survivor 3-in-1 Power Lantern',
      price: '$115.00 USD',
      badge: 'NEW!',
    },
    {
      id: 2,
      name: 'PackLite Titan 2-in-1 Power Lantern',
      price: '$88.00 USD',
    },
    {
      id: 3,
      name: 'Titan 4-Pack',
      price: '$299.99 USD',
      oldPrice: '$352.00 USD',
      badge: 'BEST VALUE',
    },
  ]

  const faqs = [
    {
      question: 'Can this charge my iPhone?',
      answer:
        'Yes! LuminAID Power Lanterns can charge iPhones, as well as Android phones, and other small electronics that use a USB charging cable, like cameras, tablets, and headlamps.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'We offer a 100-day Return Window and back all of our solar lanterns with an Off-Grid Guarantee for the lifetime of the product.',
    },
    {
      question: 'How long do LuminAID lanterns last?',
      answer:
        'PackLite Max can run for up to 50 hours per charge, while PackLite Titan can run for up to 100 hours per charge. The lanterns can also hold a charge in storage for up to 2 years.',
    },
    {
      question: 'How do I recharge my LuminAID?',
      answer:
        'LuminAID lanterns can be recharged via solar power or USB. USB charging takes approximately 1-2 hours for a fast charge.',
    },
  ]

  return (
    <div className="w-full bg-white">

      {/* Page Header */}
      <section className="w-full py-14 md:py-16">

        <div className="max-w-[1200px] mx-auto px-6">

          <h1 className="text-4xl md:text-5xl font-bold text-center">
            LuminAID Power Lanterns
          </h1>

        </div>

      </section>


      {/* Intro */}
      <section className="w-full">

        <div className="max-w-[1200px] mx-auto px-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <div>

              {/*
              <img
                src={powerLanternHeroImage}
                alt="LuminAID founders with a Power Lantern prototype"
                className="w-full h-auto object-cover"
              />
              */}

            </div>

            <div className="max-w-[550px]">

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Designed to Last When Needed Most
              </h2>

              <p className="text-base md:text-lg leading-8 text-gray-700 mb-5">
                LuminAID's innovative solar phone chargers are designed for
                disaster relief, so you can rely on them in your home emergency
                kit or bring them along on your next family camping trip.
                These make great gifts!
              </p>

              <p className="text-base md:text-lg leading-8 text-gray-700">
                These waterproof solar lanterns have a built-in battery pack
                to charge your phone and can be easily recharged via solar
                power or USB.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Reviews */}
      <section className="w-full py-14">

        <div className="max-w-[1200px] mx-auto px-6 text-center">

          <p className="text-lg md:text-xl font-bold">
            ⭐️⭐️⭐️⭐️⭐️ 10,000+ 5-Star Reviews
          </p>

        </div>

      </section>


      {/* Featured Products */}
      <section className="w-full">

        <div className="max-w-[1200px] mx-auto px-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  */}

                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                    Product Image
                  </div>

                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-primary-orange text-white px-3 py-1 text-xs font-bold">
                      {product.badge}
                    </span>
                  )}

                </div>


                {/* Product Information */}
                <div className="pt-4">

                  <h3 className="text-base font-semibold leading-6">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-2">

                    <p className="text-sm text-gray-700">
                      {product.price}
                    </p>

                    {product.oldPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        {product.oldPrice}
                      </p>
                    )}

                  </div>

                  <button
                    className="w-full mt-5 bg-black text-white py-3 text-sm font-semibold hover:bg-primary-red transition-colors"
                  >
                    ADD TO CART
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* Testimonials */}
      <section className="w-full py-16">

        <div className="max-w-[1000px] mx-auto px-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

            <p className="text-base md:text-lg text-gray-700">
              “The combination of the phone charger and the lantern has been a
              lifesaver.”
            </p>

            <p className="text-base md:text-lg text-gray-700">
              “LuminAID's solar lanterns are a light in the darkness.”
            </p>

            <p className="text-base md:text-lg text-gray-700">
              “Not only terrific for camping, but perfect for long-term use in
              areas without power.”
            </p>

          </div>

        </div>

      </section>


      {/* Press Logos */}
      <section className="w-full py-10 border-y border-gray-200">

        <div className="max-w-[1000px] mx-auto px-6">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center text-center">

            {/*
            <img
              src={reiLogo}
              alt="REI Co-op"
              className="max-w-[120px] mx-auto"
            />
            */}

            <p className="font-semibold text-gray-400">
              REI CO-OP
            </p>

            {/*
            <img
              src={usaTodayLogo}
              alt="USA Today"
              className="max-w-[140px] mx-auto"
            />
            */}

            <p className="font-semibold text-gray-400">
              USA TODAY
            </p>

            {/*
            <img
              src={forbesLogo}
              alt="Forbes"
              className="max-w-[100px] mx-auto"
            />
            */}

            <p className="font-semibold text-gray-400">
              FORBES
            </p>

          </div>

        </div>

      </section>


      {/* Portable Power */}
      <section className="w-full bg-gray-100">

        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <div>

              {/*
              <img
                src={portablePowerImage}
                alt="LuminAID Power Lantern charging devices"
                className="w-full h-auto object-cover"
              />
              */}

              <div className="aspect-video bg-white flex items-center justify-center">
                <p className="text-sm text-gray-400">
                  Image
                </p>
              </div>

            </div>

            <div className="max-w-[550px]">

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Portable Power Everywhere
              </h2>

              <h3 className="text-xl md:text-2xl font-bold mb-4">
                Charges Phones, Tablets, Cameras, and More!
              </h3>

              <p className="text-base md:text-lg text-gray-700">
                Compatible with all major cell phones, including iPhone.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Featured Product */}
      <section className="w-full">

        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <div className="text-center mb-12">

            <p className="text-sm font-semibold uppercase tracking-wide mb-3">
              Featured Product
            </p>

            <h2 className="text-3xl md:text-4xl font-bold">
              Meet the PackLite Titan
            </h2>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-gray-100 aspect-square flex items-center justify-center">

              {/*
              <img
                src={titanChargeImage}
                alt="PackLite Titan charging a device"
                className="w-full h-full object-cover"
              />
              */}

              <p className="text-sm text-gray-400">
                Image
              </p>

            </div>


            <div className="bg-gray-100 aspect-square flex items-center justify-center">

              {/*
              <img
                src={titanTwistImage}
                alt="PackLite Titan twist-to-inflate design"
                className="w-full h-full object-cover"
              />
              */}

              <p className="text-sm text-gray-400">
                Image
              </p>

            </div>


            <div className="bg-gray-100 aspect-square flex items-center justify-center">

              {/*
              <img
                src={titanRedLightImage}
                alt="PackLite Titan red light mode"
                className="w-full h-full object-cover"
              />
              */}

              <p className="text-sm text-gray-400">
                Image
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* See It In Action */}
      <section className="w-full bg-gray-100">

        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            See it in action
          </h2>

          <div className="aspect-video bg-white flex items-center justify-center">

            {/*
            <img
              src={titanActionImage}
              alt="PackLite Titan in action"
              className="w-full h-full object-cover"
            />
            */}

            <p className="text-sm text-gray-400">
              Image / Video
            </p>

          </div>

        </div>

      </section>


      {/* Save With a 4-Pack */}
      <section className="w-full">

        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <div className="text-center mb-10">

            <h2 className="text-3xl md:text-4xl font-bold">
              Save with a 4-Pack!
            </h2>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {[
              'Titan 4-Pack',
              'Family Camping',
              'Twist-to-Inflate',
              'Charge Your Phone',
            ].map((item) => (
              <div
                key={item}
                className="bg-gray-100 aspect-square flex items-center justify-center"
              >

                {/*
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                */}

                <p className="text-sm text-gray-400">
                  {item}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* Titan 4-Pack */}
      <section className="w-full bg-gray-100">

        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <div className="bg-white aspect-square flex items-center justify-center">

              {/*
              <img
                src={titanFourPackImage}
                alt="Titan 4-Pack"
                className="w-full h-full object-cover"
              />
              */}

              <p className="text-sm text-gray-400">
                Image
              </p>

            </div>


            <div className="max-w-[550px]">

              <span className="inline-block bg-primary-orange text-white px-3 py-1 text-xs font-bold mb-5">
                BEST VALUE
              </span>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Titan 4-Pack
              </h2>

              <div className="flex items-center gap-3 mb-6">

                <span className="text-xl font-semibold">
                  $299.99 USD
                </span>

                <span className="text-gray-400 line-through">
                  $352.00 USD
                </span>

              </div>

              <p className="text-base md:text-lg leading-8 text-gray-700 mb-6">
                For all adventures, by night or by day. The Titan is our most
                popular product and features all-new design innovations like a
                red light mode for night vision and our new twist-to-inflate
                design. It's our most versatile product yet.
              </p>

              <p className="text-base font-semibold mb-7">
                This Bundle Includes:
              </p>

              <p className="text-base text-gray-700 mb-8">
                4 x PackLite Titan 2-in-1 Power Lanterns
              </p>

              <button
                className="inline-flex bg-black text-white px-7 py-3 text-sm font-semibold hover:bg-primary-red transition-colors"
              >
                ADD TO CART
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* Our Story */}
      <section className="w-full">

        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <div className="max-w-[550px]">

              <h2 className="text-3xl md:text-4xl font-bold mb-5">
                The LuminAID Story
              </h2>

              <h3 className="text-xl md:text-2xl font-bold mb-5">
                Our Mission is to Make Safe, Sustainable Light Available to All
              </h3>

              <p className="text-base md:text-lg leading-8 text-gray-700">
                LuminAID was created to make safe and sustainable light and
                energy accessible to people everywhere.
              </p>

            </div>


            <div>

              {/*
              <img
                src={storyImage}
                alt="The LuminAID story"
                className="w-full h-auto object-cover"
              />
              */}

            </div>

          </div>

        </div>

      </section>


      {/* FAQ */}
      <section className="w-full bg-gray-100">

        <div className="max-w-[900px] mx-auto px-6 py-16">

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">

            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-white p-6"
              >

                <h3 className="text-base md:text-lg font-bold mb-3">
                  {faq.question}
                </h3>

                <p className="text-base leading-7 text-gray-700">
                  {faq.answer}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

    </div>
  )
}

export default PowerLanterns