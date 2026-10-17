import { useCallback, useEffect, useState } from 'react'
import {
  Package,
  Search,
  ShoppingBag,
  X,
  MapPin,
  CalendarDays,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react'

import orderService from '../../services/orderService'

const PAGE_LIMIT = 20

const STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  confirmed: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  processing: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  shipped: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  delivered: 'bg-green-50 text-green-700 ring-green-600/20',
  cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
}

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`

const formatDate = (date) => {
  if (!date) return '—'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return '—'

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getCustomerName = (order) => {
  const userName = [order.user?.firstName, order.user?.lastName]
    .filter(Boolean)
    .join(' ')

  return (
    userName ||
    order.shippingAddress?.fullName ||
    order.customerName ||
    'Guest customer'
  )
}

const getCustomerEmail = (order) =>
  order.user?.email || order.customerEmail || 'No email available'

const getItemCount = (order) =>
  order.totalItems ??
  order.items?.reduce((total, item) => total + Number(item.quantity || 0), 0) ??
  0

const getStatusLabel = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'

const getResponsePayload = (response) => response?.data ?? response

const getOrderList = (payload) =>
  payload?.orders ?? payload?.data?.orders ?? []

const getPagination = (payload, page) => {
  const pagination = payload?.pagination ?? payload?.data?.pagination

  return {
    page: Number(pagination?.page || page),
    pages: Number(pagination?.pages || 1),
    total: Number(pagination?.total ?? getOrderList(payload).length),
  }
}

const StatusBadge = ({ status }) => {
  const normalizedStatus = String(status || 'pending').toLowerCase()

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        STATUS_STYLES[normalizedStatus] ||
        'bg-gray-100 text-gray-700 ring-gray-500/20'
      }`}
    >
      {getStatusLabel(normalizedStatus)}
    </span>
  )
}

const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

const OrderDetailsModal = ({ order, onClose, onOrderUpdated }) => {
  const address = order.shippingAddress || {}
  const items = order.items || []
  const currentStatus = String(order.status || 'pending').toLowerCase()
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [cancellationReason, setCancellationReason] = useState(
    order.cancellationReason || '',
  )
  const [savingStatus, setSavingStatus] = useState(false)
  const [statusError, setStatusError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const addressLines = [
    address.addressLine1,
    address.addressLine2,
    [address.city, address.state, address.zipCode].filter(Boolean).join(', '),
    address.country,
  ].filter(Boolean)

  const allowedNextStatuses = STATUS_TRANSITIONS[currentStatus] || []
  const canChangeStatus = allowedNextStatuses.length > 0
  const isCancellation = selectedStatus === 'cancelled'
  const hasStatusChanges = selectedStatus !== currentStatus

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleSaveStatus = async () => {
    setStatusError('')
    setStatusMessage('')

    if (!hasStatusChanges) return
    if (!allowedNextStatuses.includes(selectedStatus)) {
      setStatusError('This status change is not allowed.')
      return
    }
    if (selectedStatus === 'cancelled' && !cancellationReason.trim()) {
      setStatusError('Please provide a reason for cancelling this order.')
      return
    }

    try {
      setSavingStatus(true)
      const response = await orderService.updateOrderStatus(order._id, {
        status: selectedStatus,
        cancellationReason: selectedStatus === 'cancelled' ? cancellationReason.trim() : undefined,
      })
      const payload = response?.data ?? response

      const updatedOrder =
        payload?.order ??
        payload?.data?.order ??
        payload?.data ??
        (payload?._id ? payload : null)

      if (!updatedOrder?._id || !updatedOrder?.status) {
        throw new Error(
          'The server did not return the updated order. Check the backend response.',
        )
      }

      onOrderUpdated(updatedOrder)
      setStatusMessage('Order status updated successfully.')
    } catch (error) {
      setStatusError(
        error.response?.data?.message || error.message || 'Failed to update order status.',
      )
      setSelectedStatus(currentStatus)
    } finally {
      setSavingStatus(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-dark">Order details</p>
            <h2 id="order-details-title" className="mt-1 break-all text-xl font-bold text-black sm:text-2xl">
              {order.orderNumber || order._id}
            </h2>
            <div className="mt-2"><StatusBadge status={order.status} /></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close order details" className="rounded-lg p-2 text-gray-dark transition-colors hover:bg-gray-100 hover:text-black">
            <X size={21} />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-black">Customer information</h3>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="font-semibold text-black">{getCustomerName(order)}</p>
              <p className="mt-2 flex items-start gap-2 break-all text-sm text-gray-dark"><Mail size={16} className="mt-0.5 shrink-0" />{getCustomerEmail(order)}</p>
              {address.phone && <p className="mt-2 flex items-center gap-2 text-sm text-gray-dark"><Phone size={16} className="shrink-0" />{address.phone}</p>}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-black">Ordered items</h3>
              <span className="text-xs text-gray-dark">{getItemCount(order)} item(s)</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              {items.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <div key={item._id || item.product?._id || index} className="flex items-start justify-between gap-4 p-4">
                      <p className="min-w-0 break-words text-sm font-semibold text-black">{item.name || item.product?.name || 'Product'}</p>
                      <p className="shrink-0 text-sm text-gray-dark">× {item.quantity}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-4 text-sm text-gray-dark">No item details are available for this order.</p>
              )}
              <div className="flex items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 p-4">
                <span className="font-semibold text-black">Order Total</span>
                <span className="text-lg font-bold text-primary-red">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-black"><MapPin size={17} className="text-primary-red" />Delivery address</h3>
            <div className="rounded-xl border border-gray-200 p-4">
              {address.fullName && <p className="mb-1 text-sm font-semibold text-black">{address.fullName}</p>}
              {addressLines.length > 0 ? (
                <div className="space-y-1 text-sm leading-relaxed text-gray-dark">{addressLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div>
              ) : <p className="text-sm text-gray-dark">No delivery address is available.</p>}
              {address.phone && <p className="mt-3 text-sm text-gray-dark">Phone: {address.phone}</p>}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-black">Order status</h3>
            <div className="space-y-4 rounded-xl border border-gray-200 p-4">
              <div>
                <label htmlFor="order-status" className="mb-2 block text-sm font-medium text-black">Update status</label>
                <select
                  id="order-status"
                  value={selectedStatus}
                  disabled={!canChangeStatus || savingStatus}
                  onChange={(event) => {
                    setSelectedStatus(event.target.value)
                    setStatusError('')
                    setStatusMessage('')
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-black outline-none focus:border-primary-red disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value={currentStatus}>{getStatusLabel(currentStatus)} (current)</option>
                  {allowedNextStatuses.map((status) => <option key={status} value={status}>{getStatusLabel(status)}</option>)}
                </select>
                {!canChangeStatus && <p className="mt-2 text-xs text-gray-dark">This order has reached a final status and cannot be changed.</p>}
              </div>

              {isCancellation && (
                <div>
                  <label htmlFor="cancellation-reason" className="mb-2 block text-sm font-medium text-black">Cancellation reason <span className="text-red-600">*</span></label>
                  <textarea
                    id="cancellation-reason"
                    rows={3}
                    required
                    value={cancellationReason}
                    onChange={(event) => setCancellationReason(event.target.value)}
                    placeholder="Explain why this order is being cancelled..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm text-black outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/10"
                  />
                </div>
              )}

              {order.cancellationReason && currentStatus === 'cancelled' && (
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-xs font-semibold text-red-800">Cancellation reason</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-red-700">{order.cancellationReason}</p>
                </div>
              )}

              {statusError && <p role="alert" className="text-sm text-red-600">{statusError}</p>}
              {statusMessage && <p role="status" className="text-sm text-green-700">{statusMessage}</p>}

              {hasStatusChanges && (
                <button type="button" onClick={handleSaveStatus} disabled={savingStatus || (isCancellation && !cancellationReason.trim())} className="w-full rounded-lg bg-primary-red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-dark-red disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
                  {savingStatus ? 'Saving status...' : 'Save status'}
                </button>
              )}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-light p-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-dark"><CalendarDays size={15} />Order date</p>
              <p className="text-sm font-semibold text-black">{formatDate(order.createdAt)}</p>
            </div>
            <div className="rounded-xl bg-gray-light p-4">
              <p className="mb-2 text-xs font-medium text-gray-dark">Payment method</p>
              <p className="text-sm font-semibold text-black">{String(order.paymentMethod || 'Not specified').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}</p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-black">Payment confirmation</h3>
            {order.paymentScreenshot ? (
              <a href={order.paymentScreenshot} target="_blank" rel="noreferrer" className="inline-block max-w-full">
                <img src={order.paymentScreenshot} alt={`Payment confirmation for order ${order.orderNumber || order._id}`} className="max-h-[480px] max-w-full rounded-xl border border-gray-200 object-contain" />
                <span className="mt-2 block text-xs text-primary-red">Open full-size image</span>
              </a>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-5 text-sm text-gray-dark">No payment confirmation image has been uploaded for this order.</div>
            )}
          </section>

          {order.customerNotes && (
            <section>
              <h3 className="mb-2 text-sm font-semibold text-black">Customer notes</h3>
              <p className="rounded-xl border border-gray-200 p-4 text-sm text-gray-dark">{order.customerNotes}</p>
            </section>
          )}
        </div>

        <div className="border-t border-gray-200 px-5 py-4 sm:px-7">
          <button type="button" onClick={onClose} className="w-full rounded-lg bg-primary-red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-dark-red sm:w-auto">Close details</button>
        </div>
      </section>
    </div>
  )
}

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  })

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const filters = {}

      if (statusFilter !== 'all') {
        filters.status = statusFilter
      }

      if (appliedSearch.trim()) {
        filters.search = appliedSearch.trim()
      }

      const response = await orderService.getAllOrders(
        pagination.page,
        PAGE_LIMIT,
        filters,
      )

      const payload = getResponsePayload(response)

      setOrders(getOrderList(payload))
      setPagination((previous) => ({
        ...getPagination(payload, previous.page),
        page: previous.page,
      }))

      const responsePagination =
        payload?.pagination ?? payload?.data?.pagination

      if (responsePagination?.page) {
        setPagination({
          page: Number(responsePagination.page),
          pages: Number(responsePagination.pages || 1),
          total: Number(responsePagination.total || 0),
        })
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load orders. Please try again.',
      )
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [pagination.page, statusFilter, appliedSearch])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleSearch = (event) => {
    event.preventDefault()
    setPagination((previous) => ({ ...previous, page: 1 }))
    setAppliedSearch(searchInput.trim())
  }

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value)
    setPagination((previous) => ({ ...previous, page: 1 }))
  }

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.pages) return

    setPagination((previous) => ({ ...previous, page: nextPage }))
  }

  const visibleOrders = orders

  return (
    <div className="min-h-full bg-gray-light px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black sm:text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-gray-dark">
          View customer orders and their delivery details.
        </p>
      </div>

      {/* Search and filters */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 md:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by order number or customer email"
              aria-label="Search orders"
              className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm text-black outline-none transition focus:border-primary-red focus:ring-2 focus:ring-primary-red/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={handleStatusChange}
            aria-label="Filter orders by status"
            className="rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-black outline-none focus:border-primary-red"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-dark-red"
          >
            <Search size={16} />
            Search
          </button>
        </form>

        <div className="mt-4 text-xs text-gray-dark">
          {pagination.total} order(s) found
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
          <div className="text-center">
            <Package
              size={44}
              strokeWidth={1.5}
              className="mx-auto mb-4 animate-pulse text-gray-300"
            />
            <p className="text-sm text-gray-dark">Loading orders...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={fetchOrders}
            className="rounded-lg bg-primary-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dark-red"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && visibleOrders.length === 0 && (
        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
          <div className="px-4 text-center">
            <ShoppingBag
              size={44}
              strokeWidth={1.5}
              className="mx-auto mb-4 text-gray-300"
            />
            <p className="font-semibold text-black">No orders found</p>
            <p className="mt-1 text-sm text-gray-dark">
              Try changing your search or status filter.
            </p>
          </div>
        </div>
      )}

      {/* Desktop table */}
      {!loading && !error && visibleOrders.length > 0 && (
        <>
          <section className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    {[
                      'Order ID',
                      'Customer',
                      'Items',
                      'Total',
                      'Status',
                      'Date',
                      'Details',
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {visibleOrders.map((order) => (
                    <tr
                      key={order._id || order.orderNumber}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-black">
                          {order.orderNumber || order._id}
                        </span>
                      </td>

                      <td className="max-w-[230px] px-5 py-4">
                        <p className="truncate text-sm font-semibold text-black">
                          {getCustomerName(order)}
                        </p>
                        <p className="mt-1 break-all text-xs text-gray-dark">
                          {getCustomerEmail(order)}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-dark">
                        {getItemCount(order)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-black">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-dark">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-primary-red transition-colors hover:text-dark-red"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Mobile and tablet cards */}
          <section className="space-y-4 lg:hidden">
            {visibleOrders.map((order) => (
              <article
                key={order._id || order.orderNumber}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="space-y-4 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-dark">Order ID</p>
                      <h2 className="mt-1 break-all text-sm font-bold text-black">
                        {order.orderNumber || order._id}
                      </h2>
                    </div>

                    <StatusBadge status={order.status} />
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-sm font-semibold text-black">
                      {getCustomerName(order)}
                    </p>
                    <p className="mt-1 break-all text-xs text-gray-dark">
                      {getCustomerEmail(order)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-dark">Items</p>
                      <p className="mt-1 text-sm font-semibold text-black">
                        {getItemCount(order)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-dark">Total</p>
                      <p className="mt-1 text-sm font-semibold text-black">
                        {formatCurrency(order.total)}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-xs text-gray-dark">Order date</p>
                      <p className="mt-1 text-sm text-black">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="flex w-full items-center justify-center gap-2 border-t border-gray-200 py-3 text-sm font-semibold text-primary-red transition-colors hover:bg-gray-50"
                >
                  <Eye size={16} />
                  View order details
                </button>
              </article>
            ))}
          </section>

          {/* Pagination */}
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-dark">
              Page {pagination.page} of {pagination.pages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => changePage(pagination.page - 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                disabled={pagination.page >= pagination.pages}
                onClick={() => changePage(pagination.page + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Order details modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={(updatedOrder) => {
            setSelectedOrder(updatedOrder)
            setOrders((currentOrders) => currentOrders.map((item) =>
              item._id === updatedOrder._id ? updatedOrder : item,
            ))
          }}
        />
      )}
    </div>
  )
}

export default AdminOrders
