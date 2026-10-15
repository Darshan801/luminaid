import { Link } from 'react-router-dom'
import { Package, RotateCcw, Shield, Mail, ChevronRight } from 'lucide-react'

const Returns = () => {
  return (
    <div className="returns-page w-full bg-white">

      {/* Breadcrumb */}
      <section className="breadcrumb py-4 px-6 md:px-8 bg-white border-b border-gray-100">
        <div className="container max-w-content mx-auto">
          <nav className="text-body-sm text-muted-neutral">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-fast">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/support/guides" className="hover:text-brand-orange transition-colors duration-fast">Support</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal font-medium">Returns</span>
          </nav>
        </div>
      </section>

      {/* Page Title */}
      <section className="section-py bg-gradient-to-b from-warm-paper to-white text-center">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-heading-lg md:text-heading-xl font-display font-bold text-charcoal mb-4">
            Returns & Warranty Policy
          </h1>
          <p className="text-body-lg text-muted-neutral max-w-2xl mx-auto">
            We stand behind the quality of our products
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 md:py-16 bg-white border-b border-gray-100">
        <div className="container max-w-content mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <Package size={28} className="text-brand-orange" />
              </div>
              <p className="font-bold text-charcoal text-body-md">Free US Shipping</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <RotateCcw size={28} className="text-brand-orange" />
              </div>
              <p className="font-bold text-charcoal text-body-md">100-Day Returns</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <Shield size={28} className="text-brand-orange" />
              </div>
              <p className="font-bold text-charcoal text-body-md">Off-Grid Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-py-lg bg-white">
        <div className="container max-w-4xl mx-auto">

          {/* Off-Grid Guarantee */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <Shield size={24} className="text-brand-orange" />
              </div>
              <h2 className="text-heading-md font-display font-bold text-charcoal">
                Off-Grid Guarantee
              </h2>
            </div>
            <div className="bg-warm-paper border border-gray-100 rounded-soft p-8">
              <p className="text-body-md text-charcoal leading-relaxed mb-4">
                We stand behind the quality of our products. Our lights are durable and built to last. If you have a problem with your product within its stated warranty period, please reach out to our Support team at{' '}
                <a href="mailto:support@luminaid.com" className="text-brand-orange font-semibold hover:underline">
                  support@luminaid.com
                </a>
                .
              </p>
              <Link 
                to="/support/contact"
                className="inline-flex items-center gap-2 text-brand-orange font-bold 
                         hover:gap-3 transition-all duration-fast"
              >
                Get Support
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          {/* 100-Day Return Window */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <RotateCcw size={24} className="text-brand-orange" />
              </div>
              <h2 className="text-heading-md font-display font-bold text-charcoal">
                100-Day Return Window
              </h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-body-md text-charcoal leading-relaxed mb-4">
                We want to make sure you are satisfied with your order. If within 100 days of the original purchase date you are not 100% satisfied, you may return unused and unopened products for a full refund minus the shipping cost. We cannot guarantee refunds after more than 100 days from the original order date.
              </p>
              <p className="text-body-md text-charcoal leading-relaxed mb-4">
                We are not able to accept returns for opened packages unless a product is faulty or has a verified defect. If you would like to exchange or return a LuminAID product, please reach out to us via our{' '}
                <Link to="/support/contact" className="text-brand-orange font-semibold hover:underline">
                  Contact Page
                </Link>
                .
              </p>
              <p className="text-body-md text-charcoal leading-relaxed">
                Please note that any return authorization will expire within 30 days. Once a return is approved by a LuminAID customer service representative, you will have 30 days to ship it back.
              </p>
            </div>
          </div>

          {/* Exchanges */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <Package size={24} className="text-brand-orange" />
              </div>
              <h2 className="text-heading-md font-display font-bold text-charcoal">
                Exchanges
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-body-md text-charcoal leading-relaxed">
                To request a product exchange or have additional options, or if you would like to exchange a product for a size or style change for a different product, please email{' '}
                <a href="mailto:support@luminaid.com" className="text-brand-orange font-semibold hover:underline">
                  support@luminaid.com
                </a>
                {' '}to request a prepaid shipping label and further information.
              </p>
              <p className="text-body-md text-charcoal leading-relaxed">
                Before you send the product back to us, please send us a photo of the product issues you are experiencing with any obvious damage noted or described or any of the trouble spots you may be experiencing.
              </p>
            </div>
          </div>

          {/* International Returns */}
          <div className="mb-16">
            <h3 className="text-title-lg font-bold text-charcoal mb-4">
              International Returns
            </h3>
            <div className="bg-warm-paper border border-gray-100 rounded-soft p-8">
              <p className="text-body-md text-charcoal leading-relaxed">
                Due to the added expense of international shipping, we are not able to accept any returns from our international customers. If you believe the product is genuinely defective, please email us a detailed description (with photos) and we will send you a replacement or refund if we can confirm the product is faulty. International returns that are sent back will be donated by us and will not be paid for or inspected for defects.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-py bg-gradient-to-br from-brand-orange to-brand-red text-center">
        <div className="container max-w-3xl mx-auto">
          <Mail size={48} className="text-white mx-auto mb-6" />
          <h2 className="text-heading-md md:text-heading-lg font-display font-bold text-white mb-4">
            Need to Start a Return?
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            Contact our support team to initiate your return or exchange
          </p>
          <Link
            to="/support/contact"
            className="inline-flex items-center justify-center gap-2
                     bg-white text-brand-orange font-bold 
                     px-10 py-4 text-body-md
                     rounded-soft shadow-strong
                     hover:bg-warm-paper hover:shadow-glow-lg
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

export default Returns;
