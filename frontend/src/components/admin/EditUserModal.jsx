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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <h2 className="text-xl font-bold text-black">Edit User</h2>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                             focus:border-primary-red focus:outline-none focus:ring-2 focus:ring-primary-red/20
                             disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                             focus:border-primary-red focus:outline-none focus:ring-2 focus:ring-primary-red/20
                             disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                             focus:border-primary-red focus:outline-none focus:ring-2 focus:ring-primary-red/20
                             disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                             focus:border-primary-red focus:outline-none focus:ring-2 focus:ring-primary-red/20
                             disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="mb-8">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
                Account Settings
              </h3>

              <div className="mb-4">
                <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                           focus:border-primary-red focus:outline-none focus:ring-2 focus:ring-primary-red/20
                           disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300 text-primary-red
                             focus:ring-2 focus:ring-primary-red/20 disabled:opacity-50 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Account Active</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isEmailVerified"
                    checked={formData.isEmailVerified}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300 text-primary-red
                             focus:ring-2 focus:ring-primary-red/20 disabled:opacity-50 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Email Verified</span>
                </label>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="mb-8">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
                Admin Notes
              </h3>

              <div>
                <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                           focus:border-primary-red focus:outline-none focus:ring-2 focus:ring-primary-red/20
                           disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  These notes are only visible to admins
                </p>
              </div>
            </div>

            {/* User Stats (Read-only) */}
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-5">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
                User Statistics
              </h3>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Spent</div>
                  <div className="text-lg font-bold text-black">
                    Rs. {user.totalSpent?.toLocaleString() || 0}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Orders</div>
                  <div className="text-lg font-bold text-black">{user.orderCount || 0}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Logins</div>
                  <div className="text-lg font-bold text-black">{user.loginCount || 0}</div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer with Action Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-black
                       transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-lg bg-primary-red px-5 py-2.5 text-sm font-semibold text-white
                       transition-colors hover:bg-dark-red disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditUserModal
