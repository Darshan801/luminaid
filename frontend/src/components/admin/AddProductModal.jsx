import { useEffect, useRef, useState } from 'react'

import { X, ImagePlus, Trash2 } from 'lucide-react'

const CATEGORIES = [
  'Power Lanterns',
  'String Lights',
  'Accessories',
  'Bundles',
]

const MAX_IMAGES = 4

const MAX_FILE_SIZE_MB = 5

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition-colors placeholder:text-gray-400 focus:border-primary-red'

const labelClass = 'mb-1.5 block text-sm font-semibold text-black'

const FieldError = ({ message }) =>
  message ? (
    <p className="mt-1 text-xs text-red-600">
      {message}
    </p>
  ) : null

const AddProductModal = ({
  onClose,
  onSubmit,
  initialProduct = null,
  isEditing = false,
}) => {
  const [form, setForm] = useState(() => ({
    name: initialProduct?.name || '',
    category: initialProduct?.category || '',
    description: initialProduct?.description || '',
    isBestSeller: initialProduct?.bestseller || false,
    isSoldOut: initialProduct?.status === 'out-of-stock',
    isNew: initialProduct?.newArrival || false,
    price: initialProduct?.price?.toString() || '',
    stock: initialProduct?.stock?.toString() || '',
  }))

  const [colors, setColors] = useState(
    initialProduct?.colors || [],
  )

  const [colorInput, setColorInput] = useState('#e11d48')

  const [images, setImages] = useState(() =>
    (initialProduct?.images || []).map((image) => ({
      file: null,
      preview: image.url,
    })),
  )

  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef(null)

  // Lock background scroll + close on Escape
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, isSubmitting])

  const clearError = (field) =>
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }))

  // ---------- Basic fields ----------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    clearError(name)
  }

  // ---------- Stock ----------
  const handleStockChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '')

    setForm((prev) => ({
      ...prev,
      stock: digitsOnly,
    }))

    clearError('stock')
  }

  // ---------- Price ----------
  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^\d.]/g, '')

    const firstDot = value.indexOf('.')

    if (firstDot !== -1) {
      value =
        value.slice(0, firstDot + 1) +
        value.slice(firstDot + 1).replace(/\./g, '')
    }

    setForm((prev) => ({
      ...prev,
      price: value,
    }))

    clearError('price')
  }

  // ---------- Colors ----------
  const handleAddColor = () => {
    const color = colorInput.toLowerCase()

    if (colors.includes(color)) return

    setColors((prev) => [...prev, color])
  }

  const handleRemoveColor = (color) => {
    setColors((prev) =>
      prev.filter((item) => item !== color),
    )
  }

  // ---------- Images ----------
  const handleImageSelect = (e) => {
    const selected = Array.from(e.target.files || [])

    e.target.value = ''

    if (selected.length === 0) return

    const validFiles = []
    let message = ''

    for (const file of selected) {
      if (!file.type.startsWith('image/')) {
        message = 'Only image files are allowed.'
        continue
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        message = `Each image must be under ${MAX_FILE_SIZE_MB}MB.`
        continue
      }

      validFiles.push(file)
    }

    const remainingSlots = MAX_IMAGES - images.length

    if (validFiles.length > remainingSlots) {
      message = `You can upload a maximum of ${MAX_IMAGES} images.`
    }

    const accepted = validFiles
      .slice(0, remainingSlots)
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))

    if (accepted.length > 0) {
      setImages((prev) => [...prev, ...accepted])
    }

    setErrors((prev) => ({
      ...prev,
      images: message || undefined,
    }))
  }

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const image = prev[index]

      if (image?.file && image.preview.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview)
      }

      return prev.filter((_, i) => i !== index)
    })

    clearError('images')
  }

  // ---------- Close / Submit ----------
  const revokePreviews = () => {
    images.forEach((img) => {
      if (img.file && img.preview.startsWith('blob:')) {
        URL.revokeObjectURL(img.preview)
      }
    })
  }

  const handleCancel = () => {
    if (isSubmitting) return

    revokePreviews()
    onClose()
  }

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Product name is required.'
    }

    if (!form.category) {
      newErrors.category = 'Please select a category.'
    }

    if (!form.description.trim()) {
      newErrors.description = 'Description is required.'
    }

    if (form.price === '' || Number(form.price) <= 0) {
      newErrors.price = 'Enter a valid price.'
    }

    if (form.stock === '') {
      newErrors.stock = 'Stock is required.'
    }

    if (images.length < 1) {
      newErrors.images = 'At least 1 image is required.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await onSubmit({
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        isBestSeller: form.isBestSeller,
        isSoldOut: form.isSoldOut,
        isNew: form.isNew,
        price: Number(form.price),
        stock: Number(form.stock),
        colors,
        images: images
          .map((img) => img.file)
          .filter(Boolean),
        existingImages: images
          .filter((img) => !img.file)
          .map((img) => img.preview),
      })

      revokePreviews()
    } catch (error) {
      setSubmitError(
        error.message || 'Something went wrong. Please try again.',
      )

      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2
            id="add-product-title"
            className="text-xl font-bold text-black"
          >
            {isEditing ? 'Edit Product' : 'Add Product'}
          </h2>

          <button
            type="button"
            onClick={handleCancel}
            aria-label="Close"
            className="rounded-lg p-1.5 text-gray-dark transition-colors hover:bg-gray-100 hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className={labelClass}
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. MaxQ Lantern"
                className={inputClass}
              />

              <FieldError message={errors.name} />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className={labelClass}
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">
                  Select a category
                </option>

                {CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              <FieldError message={errors.category} />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className={labelClass}
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the product..."
                className={`${inputClass} resize-none`}
              />

              <FieldError message={errors.description} />
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className={labelClass}
                >
                  Price (Rs.)
                </label>

                <input
                  id="price"
                  name="price"
                  type="text"
                  inputMode="decimal"
                  value={form.price}
                  onChange={handlePriceChange}
                  placeholder="0"
                  className={inputClass}
                />

                <FieldError message={errors.price} />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className={labelClass}
                >
                  Stock
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.stock}
                  onChange={handleStockChange}
                  placeholder="0"
                  className={inputClass}
                />

                <FieldError message={errors.stock} />
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className={labelClass}>
                Colors
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colorInput}
                  onChange={(e) =>
                    setColorInput(e.target.value)
                  }
                  aria-label="Pick a color"
                  className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300 bg-white p-1"
                />

                <span className="text-sm uppercase text-gray-dark">
                  {colorInput}
                </span>

                <button
                  type="button"
                  onClick={handleAddColor}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-black transition-colors hover:border-primary-red hover:text-primary-red"
                >
                  Add Color
                </button>
              </div>

              {colors.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1 pl-1.5 pr-2.5 text-xs uppercase text-gray-dark"
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-gray-300"
                        style={{
                          backgroundColor: color,
                        }}
                      />

                      {color}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveColor(color)
                        }
                        aria-label={`Remove ${color}`}
                        className="text-gray-400 transition-colors hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Best seller */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={form.isBestSeller}
                onChange={handleChange}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary-red"
              />

              <span className="text-sm font-semibold text-black">
                Mark as Best Seller
              </span>
            </label>

            {/* Sold Out */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isSoldOut"
                checked={form.isSoldOut}
                onChange={handleChange}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary-red"
              />

              <span className="text-sm font-semibold text-black">
                Mark as Sold Out
              </span>
            </label>

            {/* New */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isNew"
                checked={form.isNew}
                onChange={handleChange}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary-red"
              />

              <span className="text-sm font-semibold text-black">
                Mark as New
              </span>
            </label>

            {/* Images */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-semibold text-black">
                  Images
                </label>

                <span className="text-xs text-gray-dark">
                  {images.length}/{MAX_IMAGES} (min 1)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((img, index) => (
                  <div
                    key={img.preview}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-light"
                  >
                    <img
                      src={img.preview}
                      alt={`Product preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        Main
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveImage(index)
                      }
                      aria-label={`Remove image ${index + 1}`}
                      className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1.5 text-red-600 opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {images.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-gray-dark transition-colors hover:border-primary-red hover:text-primary-red"
                  >
                    <ImagePlus
                      size={22}
                      strokeWidth={1.8}
                    />

                    <span className="text-xs font-medium">
                      Add image
                    </span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />

              <FieldError message={errors.images} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            {submitError && (
              <p className="mr-auto text-sm text-red-600">
                {submitError}
              </p>
            )}

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dark-red disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal