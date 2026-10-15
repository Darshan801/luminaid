import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { ChevronRight, User, Lock, BarChart3, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, updatePassword, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password visibility states
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    // Validate password strength
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      // Show success message briefly
      setMessage({ type: 'success', text: 'Password updated! Redirecting to login...' });
      
      // Wait 2 seconds, then logout and redirect
      setTimeout(async () => {
        await logout();
        navigate('/login', { 
          state: { 
            message: 'Password changed successfully. Please log in with your new password.' 
          } 
        });
      }, 2000);
      
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    }
  };

  // Get tier badge color
  const getTierColor = (tier) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="min-h-screen bg-warm-paper py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-fast">
              Home
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">My Profile</span>
          </nav>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-soft border border-gray-200 shadow-medium mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-orange to-brand-red p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-soft flex-shrink-0">
                  <User size={40} className="text-brand-orange" />
                </div>
                <div className="text-white">
                  <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                    {user?.fullName}
                  </h1>
                  <p className="text-white/90 text-lg">{user?.email}</p>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase border-2 ${getTierColor(user?.customerTier)}`}>
                  {user?.customerTier} Member
                </span>
                <div className="text-white text-lg">
                  <span className="font-bold text-2xl">{user?.loyaltyPoints || 0}</span> Loyalty Points
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-soft border border-gray-200 shadow-medium overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-bold text-sm whitespace-nowrap
                         transition-colors duration-fast ${
                  activeTab === 'profile'
                    ? 'border-brand-orange text-brand-orange'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <User size={18} />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-bold text-sm whitespace-nowrap
                         transition-colors duration-fast ${
                  activeTab === 'password'
                    ? 'border-brand-orange text-brand-orange'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Lock size={18} />
                Change Password
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-bold text-sm whitespace-nowrap
                         transition-colors duration-fast ${
                  activeTab === 'stats'
                    ? 'border-brand-orange text-brand-orange'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <BarChart3 size={18} />
                Account Stats
              </button>
            </nav>
          </div>

          <div className="p-6 md:p-8">
            {/* Message */}
            {message.text && (
              <div
                className={`mb-6 rounded-soft p-4 border ${
                  message.type === 'success' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <p className={`text-sm font-medium ${
                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold text-gray-900 mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className="w-full border border-gray-300 rounded-soft shadow-sm py-3 px-4
                               focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange
                               transition-all duration-fast"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-gray-900 mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className="w-full border border-gray-300 rounded-soft shadow-sm py-3 px-4
                               focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange
                               transition-all duration-fast"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full border border-gray-300 rounded-soft shadow-sm py-3 px-4
                               focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange
                               transition-all duration-fast"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-brand-orange text-white rounded-soft font-bold
                             hover:bg-brand-orange-dark active:scale-95
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-fast shadow-glow-sm hover:shadow-glow-md"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-bold text-gray-900 mb-2">
                      Current password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        name="currentPassword"
                        id="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full border border-gray-300 rounded-soft shadow-sm py-3 px-4 pr-12
                                 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange
                                 transition-all duration-fast"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500
                                 hover:text-gray-700 transition-colors duration-fast"
                      >
                        {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-bold text-gray-900 mb-2">
                      New password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full border border-gray-300 rounded-soft shadow-sm py-3 px-4 pr-12
                                 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange
                                 transition-all duration-fast"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500
                                 hover:text-gray-700 transition-colors duration-fast"
                      >
                        {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      Must be 8+ characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-900 mb-2">
                      Confirm new password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full border border-gray-300 rounded-soft shadow-sm py-3 px-4 pr-12
                                 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange
                                 transition-all duration-fast"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500
                                 hover:text-gray-700 transition-colors duration-fast"
                      >
                        {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-brand-orange text-white rounded-soft font-bold
                             hover:bg-brand-orange-dark active:scale-95
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-fast shadow-glow-sm hover:shadow-glow-md"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-soft p-6 border border-orange-200">
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Total Spent</p>
                    <p className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                      RS {user?.totalSpent || 0}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-soft p-6 border border-blue-200">
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Orders</p>
                    <p className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                      {user?.orderCount || 0}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-soft p-6 border border-purple-200">
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Loyalty Points</p>
                    <p className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
                      {user?.loyaltyPoints || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-brand-orange/10 to-brand-red/10 border-2 border-brand-orange rounded-soft p-6">
                  <h3 className="text-lg font-heading font-bold text-gray-900 mb-3">
                    Customer Tier: {user?.customerTier?.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {user?.customerTier === 'bronze' && 'Spend RS 100 to reach Silver tier'}
                    {user?.customerTier === 'silver' && 'Spend RS 250 to reach Gold tier'}
                    {user?.customerTier === 'gold' && 'Spend RS 500 to reach Platinum tier'}
                    {user?.customerTier === 'platinum' && 'You are at the highest tier! Enjoy exclusive benefits.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">Account Information</h3>
                  <dl className="divide-y divide-gray-200 bg-gray-50 rounded-soft border border-gray-200">
                    <div className="py-4 px-6 flex justify-between">
                      <dt className="text-sm font-bold text-gray-700">Email</dt>
                      <dd className="text-sm text-gray-900">{user?.email}</dd>
                    </div>
                    <div className="py-4 px-6 flex justify-between">
                      <dt className="text-sm font-bold text-gray-700">Member since</dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="py-4 px-6 flex justify-between">
                      <dt className="text-sm font-bold text-gray-700">Email verified</dt>
                      <dd className="text-sm text-gray-900">
                        {user?.isEmailVerified ? '✓ Yes' : 'Not yet'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="pt-6">
                  <Link
                    to="/orders/my-orders"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-brand-orange text-white rounded-soft font-bold
                             hover:bg-brand-orange-dark active:scale-95
                             transition-all duration-fast shadow-glow-sm hover:shadow-glow-md"
                  >
                    View My Orders
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
