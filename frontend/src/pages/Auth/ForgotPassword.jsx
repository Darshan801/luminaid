import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword = () => {
  const { forgotPassword, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to send password reset email. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          
          {/* Success Card */}
          <div className="bg-white rounded-soft shadow-medium p-6 md:p-8">
            
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                Check your email
              </h2>
              <p className="text-base text-gray-600 mb-6">
                We've sent password reset instructions to{' '}
                <span className="font-semibold text-gray-900">{email}</span>
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-soft p-4 mb-6 text-left">
                <h3 className="text-sm font-bold text-blue-900 mb-2">What's next?</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Check your email inbox</li>
                  <li>Click the reset link in the email</li>
                  <li>Create your new password</li>
                  <li>Sign in with your new password</li>
                </ol>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="font-semibold text-brand-orange hover:text-brand-orange-dark"
                >
                  try again
                </button>
              </p>

              <Link
                to="/login"
                className="inline-block w-full py-3.5 px-4 
                         border border-gray-300 rounded-soft
                         text-base font-bold text-gray-900 uppercase tracking-wide
                         bg-white
                         hover:border-gray-400 hover:shadow-medium
                         active:scale-98
                         transition-all duration-fast
                         text-center"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3">
            Reset your password
          </h2>
          <p className="text-base text-gray-600">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-soft shadow-medium p-6 md:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-soft p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-soft text-base
                         placeholder-gray-500 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                         transition-all duration-fast"
                placeholder="you@example.com"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 
                       border border-gray-300 rounded-soft
                       text-base font-bold text-gray-900 uppercase tracking-wide
                       bg-white
                       hover:border-gray-400 hover:shadow-medium
                       active:scale-98
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-fast
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
