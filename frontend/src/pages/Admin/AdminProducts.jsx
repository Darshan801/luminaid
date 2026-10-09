import { useEffect, useState } from 'react'

import { Pencil, Trash2 } from 'lucide-react'

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
    <div className="min-h-full bg-gray-light px-8 py-8 lg:px-10">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-dark">
            Manage your product catalogue.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-dark-red"
        >
          <span className="text-lg leading-none">+</span>
          Add Products
        </button>
      </div>

      {/* Products Table */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
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
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-sm text-gray-dark"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <p className="mb-4 text-sm text-red-600">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={fetchProducts}
                      className="rounded-lg bg-primary-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dark-red"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-sm text-gray-dark"
                  >
                    No products yet.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

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