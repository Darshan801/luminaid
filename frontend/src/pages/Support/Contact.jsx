import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    orderNumber: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(`${API_URL}/api/support/contact`, formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          orderNumber: '',
          message: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page w-full bg-white">
      {/* Breadcrumb */}
      <section className="breadcrumb py-4 px-8 bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Contact</span>
          </nav>
        </div>
      </section>

      {/* Page Title */}
      <section className="page-title py-16 px-8 text-center">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-black tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question? We're here to help. Fill out the form below or reach out through any of our contact methods.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="contact-content py-12 px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Left - Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-black mb-8">Get In Touch</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <Mail className="text-primary-red mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-black mb-1">Email</h3>
                    <a href="mailto:support@luminaid.com" className="text-gray-600 hover:text-primary-red">
                      support@luminaid.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="text-primary-red mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-black mb-1">Phone</h3>
                    <a href="tel:+1-800-LUMINAID" className="text-gray-600 hover:text-primary-red">
                      1-800-LUMINAID
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri: 9am-5pm CST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageCircle className="text-primary-red mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-black mb-1">Live Chat</h3>
                    <p className="text-gray-600">Available during business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="text-primary-red mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-black mb-1">Address</h3>
                    <p className="text-gray-600">
                      LuminAID Lab<br />
                      Chicago, IL 60614<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-sm">
                <h3 className="font-bold text-black mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/support/guides" className="text-gray-600 hover:text-primary-red">
                      Product Guides
                    </Link>
                  </li>
                  <li>
                    <Link to="/support/returns" className="text-gray-600 hover:text-primary-red">
                      Returns & Warranty
                    </Link>
                  </li>
                  <li>
                    <Link to="/support/shipping" className="text-gray-600 hover:text-primary-red">
                      Shipping Information
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right - Contact Form */}
            <div>
              <div className="bg-white border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-black mb-6">Send us a message</h2>

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
                    <p className="font-semibold">Message sent successfully!</p>
                    <p className="text-sm mt-1">We'll get back to you within 24-48 hours.</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-black mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="Product Question">Product Question</option>
                      <option value="Order Status">Order Status</option>
                      <option value="Return Request">Return Request</option>
                      <option value="Warranty Claim">Warranty Claim</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-semibold text-black mb-2">
                      Order Number (Optional)
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      placeholder="#12345"
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-black mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-red text-white font-bold py-4 hover:bg-dark-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq py-16 px-8 bg-gray-50">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 mb-8">
            Looking for quick answers? Check out our most common questions.
          </p>
          <Link
            to="/support/guides"
            className="inline-block bg-black text-white font-bold px-8 py-3 hover:bg-gray-800 transition-colors"
          >
            View FAQs
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Contact;
