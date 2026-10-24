import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }

    // Clear error when user types
    if (error) setError('');
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setCode(newCode);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`code-${lastIndex}`)?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-registration`,
        { email, code: verificationCode }
      );

      if (response.data.success) {
        // Save token
        localStorage.setItem('token', response.data.token);
        
        setSuccess('Email verified! Redirecting...');
        
        // Redirect to home after 1 second
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Refresh to update auth state
        }, 1000);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Verification failed. Please try again.';
      setError(message);
      
      // If code expired, show option to resend
      if (err.response?.data?.expired) {
        setTimeLeft(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError('');
      setSuccess('');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/resend-verification`,
        { email }
      );

      if (response.data.success) {
        setSuccess('New verification code sent to your email!');
        setCode(['', '', '', '', '', '']);
        setTimeLeft(120); // Reset timer
        document.getElementById('code-0')?.focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-brand-orange/10 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3">
            Verify your email
          </h2>
          <p className="text-base text-gray-600">
            We've sent a 6-digit code to<br />
            <span className="font-bold text-gray-900">{email}</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-soft shadow-medium p-6 md:p-8">
          
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-soft p-4">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-soft p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Code Input */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-4 text-center">
                Enter verification code
              </label>
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-soft
                             focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                             transition-all duration-fast"
                    disabled={loading || success}
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  Code expires in <span className="font-bold text-brand-orange">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">
                  Code expired. Please request a new one.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success || code.some(d => !d)}
              className="w-full py-3.5 px-4 
                       bg-brand-orange text-white rounded-soft
                       text-base font-bold uppercase tracking-wide
                       hover:bg-brand-orange-dark
                       active:scale-98
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-fast
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange
                       shadow-glow-sm hover:shadow-glow-md"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || timeLeft > 0}
                className="text-sm font-bold text-brand-orange hover:text-brand-orange-dark
                         disabled:text-gray-400 disabled:cursor-not-allowed
                         transition-colors duration-fast"
              >
                {resending ? 'Sending...' : 'Resend verification code'}
              </button>
            </div>
          </form>
        </div>

        {/* Back to Register */}
        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-fast"
          >
            ← Back to registration
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailCode;
