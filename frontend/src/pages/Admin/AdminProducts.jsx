import { useEffect, useState } from 'react'

import { Pencil, Trash2, Package } from 'lucide-react'

import AddProductModal from '../../components/admin/AddProductModal'

import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/productService'

import { getOptimizedImage } from '../../utils/imageHelper'

const getPrimaryImage = (product) =>
  product.images?.find((image) => image.isPrimary)?.url ||
  product.images?.[0]?.url

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getAdminProducts()
      setProducts(data || [])
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (productData) => {
    const created = await createProduct(productData)

    setProducts((prevProducts) => [created, ...prevProducts])
    handleCloseModal()
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setIsAddProductModalOpen(true)
  }

  const handleUpdateProduct = async (productData) => {
    const updated = await updateProduct(editingProduct._id, productData)

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updated._id ? updated : product,
      ),
    )

    handleCloseModal()
  }

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?',
    )

    if (!confirmed) return

    try {
      await deleteProduct(productId)

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId),
      )
    } catch (err) {
      window.alert(err.message || 'Failed to delete product.')
    }
  }

  const handleCloseModal = () => {
    setIsAddProductModalOpen(false)
    setEditingProduct(null)
  }

  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setIsAddProductModalOpen(true)
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
          <section className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
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
          <section className="space-y-4 lg:hidden">
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