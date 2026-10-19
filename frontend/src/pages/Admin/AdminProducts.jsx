import { useEffect, useState, useCallback } from 'react'

import { Pencil, Trash2, Package, X } from 'lucide-react'

import AddProductModal from '../../components/admin/AddProductModal'
import Pagination from '../../components/common/Pagination'

import {
  getAllProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/productService'

import { getOptimizedImage } from '../../utils/imageHelper'

const getPrimaryImage = (product) =>
  product.images?.find((image) => image.isPrimary)?.url ||
  product.images?.[0]?.url

const ITEMS_PER_PAGE = 20

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  })
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // For admin, we want to see ALL products, so we need to handle status differently
      let response;
      
      // If no filters are applied, use getAdminProducts which returns all products
      if (statusFilter === 'all' && categoryFilter === 'all' && !appliedSearch.trim()) {
        response = await getAdminProducts()
        
        // Format response to match getAllProducts structure
        const allProducts = response || []
        const start = (pagination.page - 1) * ITEMS_PER_PAGE
        const end = start + ITEMS_PER_PAGE
        const paginatedProducts = allProducts.slice(start, end)
        
        setProducts(paginatedProducts)
        setPagination({
          page: pagination.page,
          totalPages: Math.ceil(allProducts.length / ITEMS_PER_PAGE),
          total: allProducts.length
        })
      } else {
        // If filters are applied, use getAllProducts but pass status explicitly
        const params = {
          page: pagination.page,
          limit: ITEMS_PER_PAGE,
          sort: '-createdAt'
        }

        // IMPORTANT: When statusFilter is 'all', don't filter by status at all
        // We need to explicitly tell the backend to not filter by status
        if (statusFilter !== 'all') {
          params.status = statusFilter
        } else {
          // Send a special value to indicate "get all statuses"
          // We'll need to update the backend to handle this
          params.status = 'all'
        }

        if (categoryFilter !== 'all') {
          params.category = categoryFilter
        }

        if (appliedSearch.trim()) {
          params.search = appliedSearch.trim()
        }

        response = await getAllProducts(params)
        setProducts(response.data || [])
        setPagination({
          page: response.page || 1,
          totalPages: response.pages || 1,
          total: response.total || 0
        })
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products. Please try again.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [pagination.page, appliedSearch, categoryFilter, statusFilter])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleAddProduct = async (productData) => {
    const created = await createProduct(productData)

    // Refresh the list to show the new product
    fetchProducts()
    handleCloseModal()
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setIsAddProductModalOpen(true)
  }

  const handleUpdateProduct = async (productData) => {
    try {
      await updateProduct(editingProduct._id, productData)

      // Refresh the list to show updated product
      fetchProducts()
      handleCloseModal()
    } catch (err) {
      console.error('Update product error:', err)
      window.alert(err.message || 'Failed to update product.')
    }
  }

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?',
    )

    if (!confirmed) return

    try {
      await deleteProduct(productId)
      
      // Refresh the list
      fetchProducts()
    } catch (err) {
      window.alert(err.message || 'Failed to delete product.')
    }
  }

  const handleCloseModal = () => {
    setIsAddProductModalOpen(false)
    setEditingProduct(null)
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setIsAddProductModalOpen(true)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setAppliedSearch(searchInput.trim())
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  return (
    <div className="min-h-full bg-gray-light px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black sm:text-3xl">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-dark">
            Manage your product catalogue.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dark-red sm:px-5 sm:py-3"
        >
          <span className="text-lg leading-none">+</span>
          <span className="hidden sm:inline">Add Products</span>
          <span className="sm:hidden">Add Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products by name..."
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
                <X size={18} />
              </button>
            )}
          </div>

          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                     focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red"
          >
            <option value="all">All Categories</option>
            <option value="Power Lanterns">Power Lanterns</option>
            <option value="String Lights">String Lights</option>
            <option value="Accessories">Accessories</option>
            <option value="Titan Bundle">Titan Bundle</option>
            <option value="String Lights Bundle">String Lights Bundle</option>
            <option value="Backyard Bundle">Backyard Bundle</option>
          </select>

          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                     focus:border-primary-red focus:outline-none focus:ring-1 focus:ring-primary-red"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <button
            type="submit"
            className="rounded-lg bg-primary-red px-5 py-2.5 text-sm font-semibold text-white
                     transition-colors hover:bg-dark-red whitespace-nowrap"
          >
            Search
          </button>
        </form>

        {/* Statistics Display */}
        {!loading && (
          <div className="mt-4 text-sm text-gray-dark">
            {pagination.total} product(s) found
          </div>
        )}
      </section>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
          <div className="text-center">
            <Package size={48} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <p className="text-sm text-gray-dark">Loading products...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-16">
          <p className="mb-4 text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={fetchProducts}
            className="rounded-lg bg-primary-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dark-red"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
          <div className="text-center">
            <Package size={48} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <p className="text-sm text-gray-dark">No products yet.</p>
          </div>
        </div>
      )}

      {/* Products - Table View (Desktop) */}
      {!loading && !error && products.length > 0 && (
        <>
          <section className="mb-6 hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark">
                      Image
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-dark">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      {/* Image */}
                      <td className="px-6 py-4">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-gray-light">
                          <img
                            src={getOptimizedImage(getPrimaryImage(product))}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-black">
                          {product.name}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-dark">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-black">
                          Rs. {product.price.toLocaleString()}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-dark">
                          {product.stock}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-black transition-colors hover:text-primary-red"
                          >
                            <Pencil size={16} strokeWidth={1.8} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product._id)}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-black transition-colors hover:text-red-600"
                          >
                            <Trash2 size={16} strokeWidth={1.8} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Products - Card View (Mobile & Tablet) */}
          <section className="mb-6 space-y-4 lg:hidden">
            {products.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-light sm:h-24 sm:w-24">
                    <img
                      src={getOptimizedImage(getPrimaryImage(product))}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col">
                    <h3 className="mb-1 text-sm font-semibold text-black sm:text-base">
                      {product.name}
                    </h3>

                    <p className="mb-2 text-xs text-gray-dark sm:text-sm">
                      {product.category}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                        <span className="text-sm font-semibold text-black">
                          Rs. {product.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-dark sm:text-sm">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleEditProduct(product)}
                    className="flex flex-1 items-center justify-center gap-2 border-r border-gray-200 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50 hover:text-primary-red"
                  >
                    <Pencil size={16} strokeWidth={1.8} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product._id)}
                    className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-50 hover:text-red-600"
                  >
                    <Trash2 size={16} strokeWidth={1.8} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Pagination */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </section>
        </>
      )}

      {/* Add / Edit Product Modal */}
      {isAddProductModalOpen && (
        <AddProductModal
          onClose={handleCloseModal}
          onSubmit={
            editingProduct ? handleUpdateProduct : handleAddProduct
          }
          initialProduct={editingProduct}
          isEditing={Boolean(editingProduct)}
        />
      )}
    </div>
  )
}

export default AdminProducts