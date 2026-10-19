import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { get } from '../../services/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(response.message || 'Your email has been successfully verified!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Email verified successfully! Please sign in to continue.',
            },
          });
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Email verification failed. The link may be invalid or expired.');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-soft shadow-medium p-6 md:p-8">
          
          {/* Verifying State */}
          {status === 'verifying' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                Verifying your email...
              </h2>
              <p className="text-base text-gray-600">
                Please wait while we verify your email address
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                Email Verified!
              </h2>
              <p className="text-base text-gray-600 mb-6">
                {message}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting you to sign in...
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
                Go to Sign In
              </Link>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                Verification Failed
              </h2>
              <p className="text-base text-gray-600 mb-6">
                {message}
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-soft p-4 mb-6 text-left">
                <h3 className="text-sm font-bold text-yellow-900 mb-2">Possible reasons:</h3>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>The verification link has expired (24 hours)</li>
                  <li>The link has already been used</li>
                  <li>The link is invalid or malformed</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link
                  to="/register"
                  className="inline-block w-full py-3.5 px-4 
                           border border-gray-300 rounded-soft
                           text-base font-bold text-gray-900 uppercase tracking-wide
                           bg-white
                           hover:border-gray-400 hover:shadow-medium
                           active:scale-98
                           transition-all duration-fast
                           text-center"
                >
                  Create New Account
                </Link>
                <Link
                  to="/login"
                  className="inline-block w-full text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                  Or sign in to your account →
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
