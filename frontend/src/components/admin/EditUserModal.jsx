import { useState } from 'react'
import { X } from 'lucide-react'

const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    role: user.role || 'customer',
    isActive: user.isActive !== undefined ? user.isActive : true,
    isEmailVerified: user.isEmailVerified !== undefined ? user.isEmailVerified : false,
    notes: user.notes || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await onUpdate(user._id, formData)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user')
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6 rounded-t-2xl">
          <h2 className="text-lg font-bold text-black sm:text-xl">Edit User</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 sm:p-4">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-dark sm:mb-4 sm:text-sm">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:px-4 sm:py-2.5
                           focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red
                           disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:px-4 sm:py-2.5
                           focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red
                           disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:px-4 sm:py-2.5
                           focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red
                           disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:px-4 sm:py-2.5
                           focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red
                           disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-dark sm:mb-4 sm:text-sm">
              Account Settings
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:px-4 sm:py-2.5
                           focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red
                           disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
              <label className="flex items-center gap-2.5 sm:gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-4 w-4 rounded border-gray-300 text-primary-red
                           focus:ring-primary-red focus:ring-1 disabled:opacity-50"
                />
                <span className="text-sm font-medium text-gray-700">Account Active</span>
              </label>

              <label className="flex items-center gap-2.5 sm:gap-3">
                <input
                  type="checkbox"
                  name="isEmailVerified"
                  checked={formData.isEmailVerified}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-4 w-4 rounded border-gray-300 text-primary-red
                           focus:ring-primary-red focus:ring-1 disabled:opacity-50"
                />
                <span className="text-sm font-medium text-gray-700">Email Verified</span>
              </label>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-dark sm:mb-4 sm:text-sm">
              Admin Notes
            </h3>

            <div>
              <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2">
                Internal Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                disabled={loading}
                placeholder="Add any internal notes about this user..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:px-4 sm:py-2.5
                         focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red
                         disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                These notes are only visible to admins
              </p>
            </div>
          </div>

          {/* User Stats (Read-only) */}
          <div className="mb-6 rounded-lg bg-gray-50 p-3 sm:p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-dark sm:mb-3 sm:text-sm">
              User Statistics
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm sm:gap-4 lg:grid-cols-4">
              <div>
                <div className="text-xs text-gray-500 sm:text-sm">Total Spent</div>
                <div className="font-semibold text-black text-sm sm:text-base">
                  Rs. {user.totalSpent?.toLocaleString() || 0}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 sm:text-sm">Orders</div>
                <div className="font-semibold text-black text-sm sm:text-base">{user.orderCount || 0}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 sm:text-sm">Loyalty Points</div>
                <div className="font-semibold text-black text-sm sm:text-base">{user.loyaltyPoints || 0}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 sm:text-sm">Logins</div>
                <div className="font-semibold text-black text-sm sm:text-base">{user.loginCount || 0}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="order-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-black
                       transition-colors hover:bg-gray-50 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="order-1 rounded-lg bg-primary-red px-4 py-2.5 text-sm font-semibold text-white
                       transition-colors hover:bg-dark-red sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserModal
