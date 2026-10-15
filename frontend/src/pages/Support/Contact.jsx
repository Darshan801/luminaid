import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
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
      <section className="breadcrumb py-4 px-6 md:px-8 bg-white border-b border-gray-100">
        <div className="container max-w-content mx-auto">
          <nav className="text-body-sm text-muted-neutral">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-fast">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal font-medium">Contact</span>
          </nav>
        </div>
      </section>

      {/* Page Title */}
      <section className="section-py bg-gradient-to-b from-warm-paper to-white text-center">
        <div className="container max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center">
              <MessageCircle size={32} className="text-brand-orange" />
            </div>
          </div>
          <h1 className="text-heading-lg md:text-heading-xl font-display font-bold text-charcoal mb-4">
            Contact Us
          </h1>
          <p className="text-body-lg text-muted-neutral max-w-2xl mx-auto">
            Have a question? We're here to help. Fill out the form below or reach out through any of our contact methods.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="section-py-lg bg-white">
        <div className="container max-w-content mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Left - Contact Information */}
            <div>
              <h2 className="text-heading-md font-display font-bold text-charcoal mb-8">
                Get In Touch
              </h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex-shrink-0 
                                flex items-center justify-center mt-1">
                    <Mail className="text-brand-orange" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal text-body-lg mb-1">Email</h3>
                    <a href="mailto:support@luminaid.com" className="text-body-md text-muted-neutral hover:text-brand-orange transition-colors duration-fast">
                      support@luminaid.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex-shrink-0 
                                flex items-center justify-center mt-1">
                    <Phone className="text-brand-orange" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal text-body-lg mb-1">Phone</h3>
                    <a href="tel:+1-800-LUMINAID" className="text-body-md text-muted-neutral hover:text-brand-orange transition-colors duration-fast">
                      1-800-LUMINAID
                    </a>
                    <p className="text-body-sm text-muted-neutral mt-1">Mon-Fri: 9am-5pm CST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex-shrink-0 
                                flex items-center justify-center mt-1">
                    <MessageCircle className="text-brand-orange" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal text-body-lg mb-1">Live Chat</h3>
                    <p className="text-body-md text-muted-neutral">Available during business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex-shrink-0 
                                flex items-center justify-center mt-1">
                    <MapPin className="text-brand-orange" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal text-body-lg mb-1">Address</h3>
                    <p className="text-body-md text-muted-neutral">
                      LuminAID Lab<br />
                      Chicago, IL 60614<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-warm-paper border border-gray-100 rounded-soft p-6">
                <h3 className="font-bold text-charcoal text-body-lg mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/support/guides" className="text-body-md text-muted-neutral hover:text-brand-orange transition-colors duration-fast flex items-center gap-2">
                      <span className="text-brand-orange">→</span>
                      Product Guides
                    </Link>
                  </li>
                  <li>
                    <Link to="/support/returns" className="text-body-md text-muted-neutral hover:text-brand-orange transition-colors duration-fast flex items-center gap-2">
                      <span className="text-brand-orange">→</span>
                      Returns & Warranty
                    </Link>
                  </li>
                  <li>
                    <Link to="/support/shipping" className="text-body-md text-muted-neutral hover:text-brand-orange transition-colors duration-fast flex items-center gap-2">
                      <span className="text-brand-orange">→</span>
                      Shipping Information
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right - Contact Form */}
            <div>
              <div className="bg-warm-paper border border-gray-100 rounded-soft p-8">
                <h2 className="text-heading-sm font-display font-bold text-charcoal mb-6">
                  Send us a message
                </h2>

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-soft px-4 py-4 mb-6 flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-green-800 text-body-md">Message sent successfully!</p>
                      <p className="text-body-sm text-green-700 mt-1">We'll get back to you within 24-48 hours.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-soft px-4 py-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-body-md text-red-800">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-body-md font-bold text-charcoal mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-soft 
                               text-body-md text-charcoal
                               hover:border-gray-300 focus:border-brand-orange 
                               focus:outline-none focus:ring-2 focus:ring-brand-orange/20
                               transition-colors duration-fast"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-body-md font-bold text-charcoal mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-soft 
                               text-body-md text-charcoal
                               hover:border-gray-300 focus:border-brand-orange 
                               focus:outline-none focus:ring-2 focus:ring-brand-orange/20
                               transition-colors duration-fast"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-body-md font-bold text-charcoal mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-soft 
                               text-body-md text-charcoal
                               hover:border-gray-300 focus:border-brand-orange 
                               focus:outline-none focus:ring-2 focus:ring-brand-orange/20
                               transition-colors duration-fast bg-white cursor-pointer"
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
                    <label htmlFor="orderNumber" className="block text-body-md font-bold text-charcoal mb-2">
                      Order Number (Optional)
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      placeholder="#12345"
                      className="w-full px-4 py-3 border border-gray-200 rounded-soft 
                               text-body-md text-charcoal placeholder:text-muted-neutral
                               hover:border-gray-300 focus:border-brand-orange 
                               focus:outline-none focus:ring-2 focus:ring-brand-orange/20
                               transition-colors duration-fast"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-body-md font-bold text-charcoal mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-200 rounded-soft 
                               text-body-md text-charcoal
                               hover:border-gray-300 focus:border-brand-orange 
                               focus:outline-none focus:ring-2 focus:ring-brand-orange/20
                               transition-colors duration-fast resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2
                             bg-brand-orange text-white font-bold py-4 
                             rounded-soft shadow-medium
                             hover:bg-brand-red hover:shadow-glow-md
                             active:scale-[0.98]
                             transition-all duration-normal
                             text-body-md uppercase tracking-wider
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-orange"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-py bg-warm-paper text-center">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-heading-md font-display font-bold text-charcoal mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-body-lg text-muted-neutral mb-8">
            Looking for quick answers? Check out our most common questions.
          </p>
          <Link
            to="/support/guides"
            className="inline-flex items-center justify-center gap-2
                     bg-charcoal text-white font-bold 
                     px-10 py-4 text-body-md
                     rounded-soft shadow-medium
                     hover:bg-charcoal/90 hover:shadow-strong
                     active:scale-[0.98]
                     transition-all duration-normal"
          >
            View FAQs
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Contact;
