import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Globe, Shield, Clock, DollarSign, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Shipping = () => {
  const [shippingInfo, setShippingInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShippingInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/support/shipping`);
        if (response.data.success) {
          setShippingInfo(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch shipping info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShippingInfo();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-warm-paper">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 
                        border-4 border-brand-orange border-t-transparent mb-4"></div>
          <p className="text-body-md text-muted-neutral">Loading shipping information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shipping-page w-full bg-white">
      {/* Breadcrumb */}
      <section className="breadcrumb py-4 px-6 md:px-8 bg-white border-b border-gray-100">
        <div className="container max-w-content mx-auto">
          <nav className="text-body-sm text-muted-neutral">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-fast">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/support/guides" className="hover:text-brand-orange transition-colors duration-fast">Support</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal font-medium">Shipping</span>
          </nav>
        </div>
      </section>

      {/* Page Title */}
      <section className="section-py bg-gradient-to-b from-warm-paper to-white text-center">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-heading-lg md:text-heading-xl font-display font-bold text-charcoal mb-4">
            Shipping Information
          </h1>
          <p className="text-body-lg text-muted-neutral max-w-2xl mx-auto">
            Fast, reliable shipping to get your LuminAID products to you quickly and safely.
          </p>
        </div>
      </section>

      {/* Shipping Methods */}
      {shippingInfo && (
        <section className="section-py-lg bg-white">
          <div className="container max-w-content mx-auto">
            
            {/* Domestic Shipping */}
            <div className="mb-16 md:mb-20">
              <div className="flex items-center gap-3 mb-8 md:mb-12">
                <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                  <Truck size={24} className="text-brand-orange" />
                </div>
                <h2 className="text-heading-md md:text-heading-lg font-display font-bold text-charcoal">
                  Domestic Shipping (US)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Standard Shipping */}
                <div className="bg-warm-paper border border-gray-100 rounded-soft p-6 md:p-8 
                              hover:border-brand-orange hover:shadow-medium 
                              transition-all duration-normal group">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-title-lg font-bold text-charcoal mb-2 
                                   group-hover:text-brand-orange transition-colors duration-fast">
                        {shippingInfo.domestic.standard.name}
                      </h3>
                      <div className="flex items-center gap-2 text-body-sm text-muted-neutral">
                        <Clock size={16} />
                        <span>{shippingInfo.domestic.standard.deliveryTime}</span>
                      </div>
                    </div>
                    <Package className="text-muted-neutral group-hover:text-brand-orange 
                                      transition-colors duration-fast" size={28} />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-baseline gap-2">
                      <DollarSign size={18} className="text-brand-orange mt-1" />
                      <span className="text-heading-sm font-bold text-charcoal">
                        {shippingInfo.domestic.standard.cost}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Express Shipping */}
                <div className="bg-warm-paper border border-gray-100 rounded-soft p-6 md:p-8 
                              hover:border-brand-orange hover:shadow-medium 
                              transition-all duration-normal group">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-title-lg font-bold text-charcoal mb-2 
                                   group-hover:text-brand-orange transition-colors duration-fast">
                        {shippingInfo.domestic.express.name}
                      </h3>
                      <div className="flex items-center gap-2 text-body-sm text-muted-neutral">
                        <Clock size={16} />
                        <span>{shippingInfo.domestic.express.deliveryTime}</span>
                      </div>
                    </div>
                    <Package className="text-muted-neutral group-hover:text-brand-orange 
                                      transition-colors duration-fast" size={28} />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-baseline gap-2">
                      <DollarSign size={18} className="text-brand-orange mt-1" />
                      <span className="text-heading-sm font-bold text-charcoal">
                        {shippingInfo.domestic.express.cost}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* International Shipping */}
            <div className="mb-16 md:mb-20">
              <div className="flex items-center gap-3 mb-8 md:mb-12">
                <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center">
                  <Globe size={24} className="text-brand-orange" />
                </div>
                <h2 className="text-heading-md md:text-heading-lg font-display font-bold text-charcoal">
                  International Shipping
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* International Standard */}
                <div className="bg-warm-paper border border-gray-100 rounded-soft p-6 md:p-8 
                              hover:border-brand-orange hover:shadow-medium 
                              transition-all duration-normal group">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-title-lg font-bold text-charcoal mb-2 
                                   group-hover:text-brand-orange transition-colors duration-fast">
                        {shippingInfo.international.standard.name}
                      </h3>
                      <div className="flex items-center gap-2 text-body-sm text-muted-neutral mb-3">
                        <Clock size={16} />
                        <span>{shippingInfo.international.standard.deliveryTime}</span>
                      </div>
                      <p className="text-body-sm text-muted-neutral">
                        {shippingInfo.international.standard.regions.join(', ')}
                      </p>
                    </div>
                    <Globe className="text-muted-neutral group-hover:text-brand-orange 
                                   transition-colors duration-fast" size={28} />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-baseline gap-2">
                      <DollarSign size={18} className="text-brand-orange mt-1" />
                      <span className="text-heading-sm font-bold text-charcoal">
                        {shippingInfo.international.standard.cost}
                      </span>
                    </div>
                  </div>
                </div>

                {/* International Express */}
                <div className="bg-warm-paper border border-gray-100 rounded-soft p-6 md:p-8 
                              hover:border-brand-orange hover:shadow-medium 
                              transition-all duration-normal group">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-title-lg font-bold text-charcoal mb-2 
                                   group-hover:text-brand-orange transition-colors duration-fast">
                        {shippingInfo.international.express.name}
                      </h3>
                      <div className="flex items-center gap-2 text-body-sm text-muted-neutral mb-3">
                        <Clock size={16} />
                        <span>{shippingInfo.international.express.deliveryTime}</span>
                      </div>
                      <p className="text-body-sm text-muted-neutral">
                        {shippingInfo.international.express.regions.join(', ')}
                      </p>
                    </div>
                    <Globe className="text-muted-neutral group-hover:text-brand-orange 
                                   transition-colors duration-fast" size={28} />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-baseline gap-2">
                      <DollarSign size={18} className="text-brand-orange mt-1" />
                      <span className="text-heading-sm font-bold text-charcoal">
                        {shippingInfo.international.express.cost}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Policies */}
            <div className="bg-gradient-to-br from-warm-paper to-white border border-gray-100 
                          rounded-soft p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                  <Shield size={20} className="text-brand-orange" />
                </div>
                <h2 className="text-heading-sm md:text-heading-md font-display font-bold text-charcoal">
                  Shipping Policies
                </h2>
              </div>
              <ul className="space-y-3">
                {shippingInfo.policies.map((policy, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-brand-orange mt-1 flex-shrink-0">✓</span>
                    <span className="text-body-md text-charcoal leading-relaxed">{policy}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="section-py-lg bg-warm-paper">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-heading-md md:text-heading-lg font-display font-bold text-charcoal 
                       text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                question: 'When will my order ship?',
                answer: 'Orders typically ship within 1-2 business days. You\'ll receive a tracking number via email once your order ships.'
              },
              {
                question: 'Do you ship internationally?',
                answer: 'Yes! We ship to most countries worldwide. International orders may be subject to customs fees and import duties.'
              },
              {
                question: 'Can I track my order?',
                answer: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can also track your order from your account dashboard.'
              },
              {
                question: 'What if my package is lost or damaged?',
                answer: 'Please contact our support team immediately. We\'ll work with the carrier to resolve the issue and ensure you receive your order.'
              }
            ].map((faq, index) => (
              <details 
                key={index} 
                className="group bg-white border border-gray-100 rounded-soft overflow-hidden
                         hover:border-brand-orange transition-colors duration-fast"
              >
                <summary className="flex items-center justify-between cursor-pointer 
                                  px-6 py-5 font-bold text-charcoal text-body-md 
                                  hover:text-brand-orange transition-colors duration-fast
                                  list-none">
                  <span>{faq.question}</span>
                  <ChevronRight 
                    size={20} 
                    className="flex-shrink-0 text-brand-orange transition-transform duration-fast 
                             group-open:rotate-90" 
                  />
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-body-md text-muted-neutral leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-py bg-gradient-to-br from-brand-orange to-brand-red text-center">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-heading-md md:text-heading-lg font-display font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            Our customer support team is here to help you with any shipping inquiries.
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

export default Shipping;
