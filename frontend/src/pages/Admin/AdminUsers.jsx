import { useEffect, useState, useCallback } from 'react'
import { Users as UsersIcon, Mail, Phone, Shield, Ban, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react'
import userService from '../../services/userService'
import Pagination from '../../components/common/Pagination'
import EditUserModal from '../../components/admin/EditUserModal'

const ITEMS_PER_PAGE = 20

const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'superadmin':
      return 'bg-purple-100 text-purple-800'
    case 'admin':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getTierBadgeColor = (spent) => {
  if (spent >= 500) return 'bg-purple-100 text-purple-800'
  if (spent >= 250) return 'bg-yellow-100 text-yellow-800'
  if (spent >= 100) return 'bg-gray-300 text-gray-800'
  return 'bg-gray-100 text-gray-600'
}

const getTier = (spent) => {
  if (spent >= 500) return 'Platinum'
  if (spent >= 250) return 'Gold'
  if (spent >= 100) return 'Silver'
  return 'Bronze'
}

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingUser, setEditingUser] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  })

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const filters = {}

      if (roleFilter !== 'all') {
        filters.role = roleFilter
      }

      if (statusFilter !== 'all') {
        filters.isActive = statusFilter
      }

      if (appliedSearch.trim()) {
        filters.search = appliedSearch.trim()
      }

      const response = await userService.getAllUsers(
        pagination.page,
        ITEMS_PER_PAGE,
        filters
      )

      setUsers(response.data || [])
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
      })
    } catch (err) {
      console.error('Failed to fetch users:', err)
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load users. Please try again.'
      )
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [pagination.page, roleFilter, statusFilter, appliedSearch])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = (event) => {
    event.preventDefault()
    setPagination((previous) => ({ ...previous, page: 1 }))
    setAppliedSearch(searchInput.trim())
  }

  const handleRoleChange = (event) => {
    setRoleFilter(event.target.value)
    setPagination((previous) => ({ ...previous, page: 1 }))
  }

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value)
    setPagination((previous) => ({ ...previous, page: 1 }))
  }

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.pages) return
    setPagination((previous) => ({ ...previous, page: nextPage }))
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
  }

  const handleCloseModal = () => {
    setEditingUser(null)
  }

  const handleUpdateUser = async (userId, userData) => {
    try {
      await userService.updateUser(userId, userData)
      handleCloseModal()
      fetchUsers() // Refresh the list
    } catch (err) {
      throw err
    }
  }

  const handleDeleteUser = async (user) => {
    if (user.role === 'admin' || user.role === 'superadmin') {
      alert('Cannot delete admin accounts')
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      await userService.deleteUser(user._id)
      fetchUsers() // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-full bg-gray-light px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black sm:text-3xl">Users</h1>
        <p className="mt-1 text-sm text-gray-dark">
          Manage registered users and their accounts.
        </p>
      </div>

      {/* Search and filters */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 md:flex-row"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                       focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('')
                  setAppliedSearch('')
                  setPagination(prev => ({ ...prev, page: 1 }))
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle size={18} />
              </button>
            )}
          </div>

          <select
            value={roleFilter}
            onChange={handleRoleChange}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                     focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                     focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red"
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button
            type="submit"
            className="rounded-lg bg-primary-red px-5 py-2.5 text-sm font-semibold text-white
                     transition-colors hover:bg-dark-red whitespace-nowrap"
          >
            Search
          </button>
        </form>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
          <div className="text-center">
            <UsersIcon size={48} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <p className="text-sm text-gray-dark">Loading users...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-16">
          <p className="mb-4 text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={fetchUsers}
            className="rounded-lg bg-primary-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dark-red"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && users.length === 0 && (
        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
          <div className="text-center">
            <UsersIcon size={48} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <p className="text-sm text-gray-dark">No users found.</p>
          </div>
        </div>
      )}

      {/* Users Table (Desktop) */}
      {!loading && !error && users.length > 0 && (
        <>
          <section className="mb-6 hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark lg:px-6">
                      User
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark lg:px-6">
                      Contact
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark lg:px-6">
                      Role
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark lg:px-6">
                      Status
                    </th>
                    <th className="hidden px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark xl:table-cell lg:px-6">
                      Customer Tier
                    </th>
                    <th className="hidden px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark xl:table-cell lg:px-6">
                      Joined
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark lg:px-6">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      {/* User */}
                      <td className="px-4 py-4 lg:px-6">
                        <div>
                          <div className="font-semibold text-black text-sm">
                            {user.firstName} {user.lastName}
                          </div>
                          {user.isEmailVerified && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle size={12} />
                              Verified
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-4 lg:px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm text-gray-dark max-w-[200px] truncate">
                            <Mail size={14} className="flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-dark">
                              <Phone size={14} className="flex-shrink-0" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4 lg:px-6">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role === 'admin' || user.role === 'superadmin' ? (
                            <Shield size={12} />
                          ) : null}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 lg:px-6">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? (
                            <>
                              <CheckCircle size={12} />
                              Active
                            </>
                          ) : (
                            <>
                              <Ban size={12} />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>

                      {/* Customer Tier */}
                      <td className="hidden px-4 py-4 xl:table-cell lg:px-6">
                        {user.role === 'customer' ? (
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getTierBadgeColor(user.totalSpent)}`}>
                            {getTier(user.totalSpent)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="hidden px-4 py-4 xl:table-cell lg:px-6">
                        <span className="text-sm text-gray-dark">
                          {formatDate(user.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 lg:px-6">
                        <div className="flex items-center gap-2 lg:gap-3">
                          <button
                            type="button"
                            onClick={() => handleEditUser(user)}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-black transition-colors hover:text-primary-red"
                          >
                            <Edit size={16} strokeWidth={1.8} />
                            <span className="hidden lg:inline">Edit</span>
                          </button>

                          {user.role === 'customer' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user)}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-black transition-colors hover:text-red-600"
                            >
                              <Trash2 size={16} strokeWidth={1.8} />
                              <span className="hidden lg:inline">Delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Users Cards (Mobile & Tablet) */}
          <section className="mb-6 space-y-4 md:hidden">
            {users.map((user) => (
              <div
                key={user._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-black">
                        {user.firstName} {user.lastName}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm text-gray-dark">
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        {user.phone}
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Joined {formatDate(user.createdAt)}</span>
                    {user.role === 'customer' && (
                      <span className={`rounded-full px-2 py-0.5 font-medium ${getTierBadgeColor(user.totalSpent)}`}>
                        {getTier(user.totalSpent)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleEditUser(user)}
                    className="flex flex-1 items-center justify-center gap-2 border-r border-gray-200 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50 hover:text-primary-red"
                  >
                    <Edit size={16} strokeWidth={1.8} />
                    Edit
                  </button>

                  {user.role === 'customer' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user)}
                      className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50 hover:text-red-600"
                    >
                      <Trash2 size={16} strokeWidth={1.8} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* Pagination */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={changePage}
            />
          </section>
        </>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={handleCloseModal}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  )
}

export default AdminUsers
