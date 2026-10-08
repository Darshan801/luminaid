import { useState } from 'react'

import { Pencil, Trash2 } from 'lucide-react'

import AddProductModal from '../../components/admin/AddProductModal'

import maxQI from '../../assets/images/products/0196-150_Max_QI_product_image.jpg'
import accessories from '../../assets/images/products/Accessories.jpg'
import stringLights from '../../assets/images/products/StringLightatSunset.jpg'

const AdminProducts = () => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [products, setProducts] = useState([
    {
      id: 1,
      image: maxQI,
      name: 'MaxQ Lantern',
      category: 'Power Lanterns',
      price: 4999,
      stock: 25,
    },
    {
      id: 2,
      image: accessories,
      name: 'LuminAID Accessories',
      category: 'Accessories',
      price: 1499,
      stock: 18,
    },
    {
      id: 3,
      image: stringLights,
      name: 'String Lights',
      category: 'String Lights',
      price: 2999,
      stock: 12,
    },
  ])

  const handleAddProduct = (newProduct) => {
    const product = {
      id: Date.now(),
      image: newProduct.imagePreviews[0],
      name: newProduct.name,
      category: newProduct.category,
      price: newProduct.price,
      stock: newProduct.stock,
      description: newProduct.description,
      isBestSeller: newProduct.isBestSeller,
      colors: newProduct.colors,
      images: newProduct.images,
      imagePreviews: newProduct.imagePreviews,
    }

    setProducts((prevProducts) => [...prevProducts, product])
    setIsAddProductModalOpen(false)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setIsAddProductModalOpen(true)
  }

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              name: updatedProduct.name,
              category: updatedProduct.category,
              price: updatedProduct.price,
              stock: updatedProduct.stock,
              description: updatedProduct.description,
              isBestSeller: updatedProduct.isBestSeller,
              colors: updatedProduct.colors,
              images: updatedProduct.images,
              imagePreviews: updatedProduct.imagePreviews,
              image:
                updatedProduct.imagePreviews.length > 0
                  ? updatedProduct.imagePreviews[0]
                  : product.image,
            }
          : product,
      ),
    )

    setEditingProduct(null)
    setIsAddProductModalOpen(false)
  }

  const handleDeleteProduct = (productId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?',
    )

    if (!confirmed) return

    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId),
    )
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
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                >
                  {/* Image */}
                  <td className="px-6 py-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-gray-light">
                      <img
                        src={product.image}
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
                        onClick={() => handleDeleteProduct(product.id)}
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
