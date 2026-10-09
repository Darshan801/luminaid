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
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
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
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Update shipping address in context
    updateShippingAddress(formData);
    
    // Recalculate totals with shipping
    await calculateTotals();

    // Move to next step
    nextStep();
  };

  const shippingOptions = [
    { value: 'standard', label: 'Standard Shipping', cost: 5.99, days: '5-7 business days' },
    { value: 'express', label: 'Express Shipping', cost: 14.99, days: '2-3 business days' },
    { value: 'overnight', label: 'Overnight Shipping', cost: 24.99, days: '1 business day' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Address Line 1 */}
        <div>
          <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1 *
          </label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder="Street address"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.addressLine1 && (
            <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2 (Optional)
          </label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            placeholder="Apartment, suite, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* City, State, ZIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              maxLength={2}
              placeholder="CA"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase
                ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="12345"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Shipping Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Shipping Method *
          </label>
          <div className="space-y-3">
            {shippingOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors
                  ${shippingMethod === option.value 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={option.value}
                    checked={shippingMethod === option.value}
                    onChange={(e) => updateShippingMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.days}</div>
                  </div>
                </div>
                <div className="font-semibold text-gray-900">
                  RS {option.cost.toFixed(2)}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingStep;
