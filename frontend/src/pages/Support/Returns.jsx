import { Package, RotateCcw, Shield } from 'lucide-react'

// ============================================================================
// TRUST BADGES COMPONENT
// ============================================================================

const TrustBadges = () => (
  <section className="trust-badges py-12 px-8 bg-white border-t border-gray-200">
    <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
      <div className="trust-badge flex flex-col items-center gap-3">
        <Package size={36} className="text-black" />
        <p className="trust-badge__text font-bold text-black text-[15px]">FREE US SHIPPING</p>
      </div>
      <div className="trust-badge flex flex-col items-center gap-3">
        <RotateCcw size={36} className="text-black" />
        <p className="trust-badge__text font-bold text-black text-[15px]">100-DAY RETURNS</p>
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

const Returns = () => {
  return (
    <div className="returns-page w-full bg-white">

      {/* Breadcrumb */}
      <section className="breadcrumb py-4 px-8 bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto">
          <nav className="breadcrumb__nav text-sm text-gray-600">
            <a href="/" className="hover:text-black">Home</a>
            <span className="mx-2">/</span>
            <a href="/support/guides" className="hover:text-black">Support</a>
            <span className="mx-2">/</span>
            <span className="text-black">returns</span>
          </nav>
        </div>
      </section>

      {/* Page Title */}
      <section className="page-title py-16 px-8 text-center">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-[48px] font-heading font-bold text-black tracking-tight">
            Returns and Warranty Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="content py-12 px-8">
        <div className="max-w-[900px] mx-auto">

          {/* Off-Grid Guarantee Image */}
          <div className="flex justify-center mb-10">
            <img 
              src="/images/products/0196-150_Max_QI_product_image.jpg" 
              alt="Backed by our Off-Grid Guarantee"
              className="w-full max-w-md h-auto rounded-sm"
            />
          </div>

          {/* Off-Grid Guarantee */}
          <div className="mb-12">
            <h2 className="text-[28px] font-bold text-black mb-4">Off-Grid Guarantee</h2>
            <p className="text-[16px] text-gray-dark leading-relaxed mb-4">
              We stand behind the quality of our products. Our lights are durable and built to last. If you have a problem with your product within its stated warranty period, please reach out to our Support team at <a href="mailto:support@luminaid.com" className="text-primary-red underline">support@luminaid.com</a>.
            </p>
            <a 
              href="/support/contact" 
              className="inline-block text-[16px] font-bold text-black underline hover:text-primary-red transition-colors"
            >
              Get Support
            </a>
          </div>

          {/* 100-Day Return Window */}
          <div className="mb-12">
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0">
                <Package size={80} className="text-gray-400" />
              </div>
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-[10px] font-bold">1 YEAR</div>
                    <div className="text-[8px]">WARRANTY</div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-[28px] font-bold text-black mb-4">100-Day Return Window</h2>
                <p className="text-[16px] text-gray-dark leading-relaxed">
                  We want to make sure you are satisfied with your order. If within 100 days of the original purchase date you are not 100% satisfied, you may return unused and unopened products for a full refund minus the shipping cost. We cannot guarantee refunds after more than 100 days from the original order date.
                </p>
              </div>
            </div>
            <p className="text-[15px] text-gray-dark leading-relaxed mb-3">
              We are not able to accept returns for opened packages unless a product is faulty or has a verified defect. If you would like to exchange or return a LuminAID product, please reach out to us via our <a href="/support/contact" className="text-primary-red underline">Contact Page</a>.
            </p>
            <p className="text-[15px] text-gray-dark leading-relaxed">
              Please note that any return authorization will expire within 30 days. Once a return is approved by a LuminAID customer service representative, you will have 30 days to ship it back.
            </p>
          </div>

          {/* Exchanges */}
          <div className="mb-12">
            <h2 className="text-[28px] font-bold text-black mb-4">Exchanges</h2>
            <p className="text-[16px] text-gray-dark leading-relaxed mb-4">
              To request a product exchange or have additional options, or if you would like to exchange a product for a size or style change for a different product, please email <a href="mailto:support@luminaid.com" className="text-primary-red underline">support@luminaid.com</a> to request a prepaid shipping label and further information.
            </p>
            <p className="text-[16px] text-gray-dark leading-relaxed mb-4">
              Before you send the product back to us, please send us a photo of the product issues you are experiencing with any obvious damage noted or described or any of the trouble spots you may be experiencing.
            </p>
            <p className="text-[16px] text-gray-dark leading-relaxed mb-4">
              <strong>Jumbo Crystal Fairy:</strong><br />
              Jumbo Crystal Fairy lights are available in two lengths. If you would like to exchange your Jumbo Crystal Fairy for a different length, please send a photo of the solar panel tag you received on to us in an email to <a href="mailto:support@luminaid.com" className="text-primary-red underline">support@luminaid.com</a>.
            </p>
            <p className="text-[16px] text-gray-dark leading-relaxed mb-4">
              The original Fairy Trio must not be damaged and must be in its original packaging. The tag that is on the Fairy must be intact and with us. If we do not receive the tag with the product, we may not be able to grant a return and will be considered return-ineligible. If we deny a return due to product damage, the item will be sent back to you.
            </p>
            <p className="text-[16px] text-gray-dark leading-relaxed">
              <strong>Note:</strong> Before the end of the 100-day exchange, return or refund window for defective product, you agree to send photos of the defect to us via email at <a href="mailto:support@luminaid.com" className="text-primary-red underline">support@luminaid.com</a> so we can try to repair your product, walk you through an alternative fix, or send you a replacement (if within 100 days), or send you a refund with documentation.
            </p>
          </div>

          {/* International Returns */}
          <div className="mb-12">
            <h3 className="text-[20px] font-bold text-black mb-3">International Returns</h3>
            <p className="text-[16px] text-gray-dark leading-relaxed">
              Due to the added expense of international shipping, we are not able to accept any returns from our international customers. If you believe the product is genuinely defective, please email us a detailed description (with photos) and we will send you a replacement or refund if we can confirm the product is faulty. International returns that are sent back will be donated by us and will not be paid for or inspected for defects.
            </p>
          </div>

          {/* Contact Us */}
          <div className="text-center mb-12">
            <a 
              href="/support/contact"
              className="inline-block text-[18px] font-bold text-black underline hover:text-primary-red transition-colors"
            >
              Contact Us
            </a>
          </div>

        </div>
      </section>

      <TrustBadges />

    </div>
  );
};

export default Returns;
