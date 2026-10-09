import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Globe, Shield } from 'lucide-react';
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
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shipping information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shipping-page w-full bg-white">
      {/* Breadcrumb */}
      <section className="breadcrumb py-4 px-8 bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/support/guides" className="hover:text-black">Support</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Shipping</span>
          </nav>
        </div>
      </section>

      {/* Page Title */}
      <section className="page-title py-16 px-8 text-center">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-black tracking-tight mb-4">
            Shipping Information
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fast, reliable shipping to get your LuminAID products to you quickly and safely.
          </p>
        </div>
      </section>

      {/* Shipping Methods */}
      {shippingInfo && (
        <section className="shipping-methods py-12 px-8">
          <div className="max-w-[1200px] mx-auto">
            
            {/* Domestic Shipping */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Truck size={32} className="text-primary-red" />
                <h2 className="text-3xl font-bold text-black">Domestic Shipping (US)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-gray-200 p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-black">
                      {shippingInfo.domestic.standard.name}
                    </h3>
                    <Package className="text-gray-400" size={24} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Cost</p>
                      <p className="text-lg font-bold text-primary-red">
                        {shippingInfo.domestic.standard.cost}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Delivery Time</p>
                      <p className="text-base text-black">
                        {shippingInfo.domestic.standard.deliveryTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-black">
                      {shippingInfo.domestic.express.name}
                    </h3>
                    <Package className="text-gray-400" size={24} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Cost</p>
                      <p className="text-lg font-bold text-black">
                        {shippingInfo.domestic.express.cost}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Delivery Time</p>
                      <p className="text-base text-black">
                        {shippingInfo.domestic.express.deliveryTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* International Shipping */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Globe size={32} className="text-primary-red" />
                <h2 className="text-3xl font-bold text-black">International Shipping</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-gray-200 p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-black">
                      {shippingInfo.international.standard.name}
                    </h3>
                    <Globe className="text-gray-400" size={24} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Cost</p>
                      <p className="text-lg font-bold text-black">
                        {shippingInfo.international.standard.cost}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Delivery Time</p>
                      <p className="text-base text-black">
                        {shippingInfo.international.standard.deliveryTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Regions</p>
                      <p className="text-sm text-gray-600">
                        {shippingInfo.international.standard.regions.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-black">
                      {shippingInfo.international.express.name}
                    </h3>
                    <Globe className="text-gray-400" size={24} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Cost</p>
                      <p className="text-lg font-bold text-black">
                        {shippingInfo.international.express.cost}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Delivery Time</p>
                      <p className="text-base text-black">
                        {shippingInfo.international.express.deliveryTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Regions</p>
                      <p className="text-sm text-gray-600">
                        {shippingInfo.international.express.regions.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Policies */}
            <div className="bg-gray-50 p-8 rounded-sm">
              <div className="flex items-center gap-3 mb-6">
                <Shield size={28} className="text-primary-red" />
                <h2 className="text-2xl font-bold text-black">Shipping Policies</h2>
              </div>
              <ul className="space-y-3">
                {shippingInfo.policies.map((policy, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary-red mt-1">✓</span>
                    <span className="text-gray-700">{policy}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>
      )}

      {/* Additional Info */}
      <section className="additional-info py-12 px-8 bg-white">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-2xl font-bold text-black mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <details className="group border-b border-gray-200 pb-4">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-black text-lg">
                When will my order ship?
                <span className="text-primary-red group-open:rotate-90 transition-transform">›</span>
              </summary>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Orders typically ship within 1-2 business days. You'll receive a tracking number via email once your order ships.
              </p>
            </details>

            <details className="group border-b border-gray-200 pb-4">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-black text-lg">
                Do you ship internationally?
                <span className="text-primary-red group-open:rotate-90 transition-transform">›</span>
              </summary>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Yes! We ship to most countries worldwide. International orders may be subject to customs fees and import duties.
              </p>
            </details>

            <details className="group border-b border-gray-200 pb-4">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-black text-lg">
                Can I track my order?
                <span className="text-primary-red group-open:rotate-90 transition-transform">›</span>
              </summary>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order from your account dashboard.
              </p>
            </details>

            <details className="group border-b border-gray-200 pb-4">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-black text-lg">
                What if my package is lost or damaged?
                <span className="text-primary-red group-open:rotate-90 transition-transform">›</span>
              </summary>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Please contact our support team immediately. We'll work with the carrier to resolve the issue and ensure you receive your order.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta py-16 px-8 bg-gray-50 text-center">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-3xl font-bold text-black mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-8">
            Our customer support team is here to help you with any shipping inquiries.
          </p>
          <Link
            to="/support/contact"
            className="inline-block bg-primary-red text-white font-bold px-8 py-4 hover:bg-dark-red transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Shipping;
