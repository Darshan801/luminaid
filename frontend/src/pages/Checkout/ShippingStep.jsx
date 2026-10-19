import { useState } from 'react';
import { useCheckout } from '../../hooks/useCheckout';
import { useAuth } from '../../hooks/useAuth';

const ShippingStep = () => {
  const { user } = useAuth();
  const {
    shippingAddress,
    updateShippingAddress,
    updateShippingMethod,
    shippingMethod,
    nextStep,
    calculateTotals
  } = useCheckout();

  const [formData, setFormData] = useState(shippingAddress || {
    fullName: user?.fullName || '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: 'Nepal',
    phone: user?.phone || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(98|97)\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits and start with 98 or 97';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Update shipping address in context
    updateShippingAddress(formData);
    
    // Recalculate totals
    await calculateTotals();

    // Move to next step
    nextStep();
  };

  const shippingOptions = [
    { value: 'standard', label: 'Standard Shipping', cost: 100, days: '5-7 business days' },
    { value: 'express', label: 'Express Shipping', cost: 200, days: '2-3 business days' },
    { value: 'overnight', label: 'Overnight Shipping', cost: 300, days: '1 business day' }
  ];

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-6">
        Shipping Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-bold text-gray-900 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-soft 
                      focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                      transition-all duration-fast
              ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.fullName && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-soft 
                      focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                      transition-all duration-fast
              ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="98XXXXXXXX or 97XXXXXXXX"
            maxLength={10}
            className={`w-full px-4 py-3 border rounded-soft 
                     focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                     transition-all duration-fast
              ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.phone}</p>
          )}
        </div>

        {/* Address Line 1 */}
        <div>
          <label htmlFor="addressLine1" className="block text-sm font-bold text-gray-900 mb-2">
            Address Line 1 *
          </label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder="Street address"
            className={`w-full px-4 py-3 border rounded-soft 
                      focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                      transition-all duration-fast
              ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.addressLine1 && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.addressLine1}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label htmlFor="addressLine2" className="block text-sm font-bold text-gray-900 mb-2">
            Address Line 2 <span className="font-normal text-gray-600">(Optional)</span>
          </label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            placeholder="Apartment, suite, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-soft 
                     focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                     transition-all duration-fast"
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-bold text-gray-900 mb-2">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-soft 
                      focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                      transition-all duration-fast
              ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.city && (
            <p className="mt-2 text-sm text-red-600 font-medium">{errors.city}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="px-8 py-3.5 bg-brand-orange text-white font-bold rounded-soft 
                     hover:bg-brand-orange-dark active:scale-95
                     transition-all duration-fast
                     shadow-glow-sm hover:shadow-glow-md
                     focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingStep;
