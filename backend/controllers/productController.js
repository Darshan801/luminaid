const Product = require('../models/Product');
const { uploadImage, deleteImage } = require('../utils/cloudinaryUpload');

const parseJSON = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const generateSlug = async (name) => {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'product';

  let slug = base;
  let count = 1;

  while (await Product.exists({ slug })) {
    slug = `${base}-${count++}`;
  }

  return slug;
};

const generateSku = () => `LUM-${Date.now().toString(36).toUpperCase()}`;

const resolveStatus = (isSoldOut, stock, currentStatus) => {
  if (isSoldOut || stock === 0) return 'out-of-stock';
  if (currentStatus === 'out-of-stock') return 'active';
  return currentStatus;
};

const parseProductBody = (body, currentStatus = 'active') => {
  const stock = Number(body.stock);

  return {
    name: body.name?.trim(),
    category: body.category,
    description: body.description?.trim(),
    price: Number(body.price),
    stock,
    colors: parseJSON(body.colors, []),
    bestseller: body.isBestSeller === 'true',
    newArrival: body.isNew === 'true',
    status: resolveStatus(body.isSoldOut === 'true', stock, currentStatus)
  };
};

const buildImages = (images, name) =>
  images.map((image, index) => ({
    url: image.url,
    publicId: image.publicId,
    altText: name,
    isPrimary: index === 0
  }));

const removeImages = (images) =>
  Promise.allSettled(
    images
      .filter((image) => image.publicId)
      .map((image) => deleteImage(image.publicId))
  );

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      minPrice,
      maxPrice,
      minRating,
      tags,
      featured,
      bestseller,
      search,
      status = 'active'
    } = req.query;

    // Build query
    const query = { status };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Bestseller filter
    if (bestseller === 'true') {
      query.bestseller = true;
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: products
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:identifier
// @access  Public
exports.getProductByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Check if identifier is MongoDB ObjectId or slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    
    let product;
    if (isObjectId) {
      product = await Product.findById(identifier)
        .populate('relatedProducts', 'name slug price images rating reviewCount');
    } else {
      product = await Product.findOne({ slug: identifier })
        .populate('relatedProducts', 'name slug price images rating reviewCount');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count (async, don't wait)
    product.incrementViewCount().catch(err => 
      console.error('Failed to increment view count:', err)
    );

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    
    const products = await Product.getFeatured(Number(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get Featured Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
};

// @desc    Get bestseller products
// @route   GET /api/products/bestsellers
// @access  Public
exports.getBestsellerProducts = async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    
    const products = await Product.getBestsellers(Number(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get Bestseller Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bestseller products',
      error: error.message
    });
  }
};

// @desc    Search products with advanced filtering
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    const { 
      q,
      category,
      minPrice,
      maxPrice,
      minRating,
      tags,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    // Build search query
    const searchQuery = { status: 'active' };

    // If search term provided, use flexible regex matching
    if (q && q.trim()) {
      const searchTerm = q.trim();
      
      // Use regex search for partial matches (case-insensitive)
      // This is more reliable than combining $text with $or
      searchQuery.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
        { sku: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      searchQuery.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      searchQuery.rating = { $gte: Number(minRating) };
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      searchQuery.tags = { $in: tagArray };
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const products = await Product.find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await Product.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      query: q || '',
      filters: {
        category,
        minPrice,
        maxPrice,
        minRating,
        tags
      },
      data: products
    });
  } catch (error) {
    console.error('Search Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message
    });
  }
};

// @desc    Get search suggestions (autocomplete)
// @route   GET /api/products/search/suggestions
// @access  Public
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const searchTerm = q.trim();

    // Find products matching the search term
    const suggestions = await Product.find({
      status: 'active',
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } }
      ]
    })
    .select('name slug category images')
    .limit(Number(limit))
    .sort({ purchaseCount: -1, rating: -1 });

    // Format suggestions
    const formattedSuggestions = suggestions.map(product => ({
      id: product._id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      image: product.images?.[0]?.url || null
    }));

    res.status(200).json({
      success: true,
      count: formattedSuggestions.length,
      data: formattedSuggestions
    });
  } catch (error) {
    console.error('Get Search Suggestions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get search suggestions',
      error: error.message
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12, sort = '-createdAt' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    
    const products = await Product.find({ 
      category, 
      status: 'active' 
    })
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments({ 
      category, 
      status: 'active' 
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      category,
      data: products
    });
  } catch (error) {
    console.error('Get Products By Category Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category',
      error: error.message
    });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories/list
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { status: 'active' });
    
    // Get product count per category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({ 
          category, 
          status: 'active' 
        });
        return { name: category, count };
      })
    );

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categoriesWithCount
    });
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// @desc    Check product stock availability
// @route   GET /api/products/:id/stock
// @access  Public
exports.checkStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.query;

    const product = await Product.findById(id).select('stock trackInventory name sku');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const available = !product.trackInventory || product.stock >= Number(quantity);

    res.status(200).json({
      success: true,
      data: {
        available,
        stock: product.trackInventory ? product.stock : 'unlimited',
        requestedQuantity: Number(quantity)
      }
    });
  } catch (error) {
    console.error('Check Stock Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check stock',
      error: error.message
    });
  }
};

// ==================== ADMIN ROUTES ====================

// @desc    Get all products for admin (any status)
// @route   GET /api/products/admin/all
// @access  Private/Admin
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort('-createdAt').select('-__v');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get Admin Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  let uploaded = [];

  try {
    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    const data = parseProductBody(req.body);

    uploaded = await Promise.all(files.map((file) => uploadImage(file.buffer)));

    const product = await Product.create({
      ...data,
      slug: await generateSlug(data.name),
      sku: generateSku(),
      images: buildImages(uploaded, data.name)
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create Product Error:', error);

    await removeImages(uploaded);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map((err) => err.message).join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU or slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  let uploaded = [];

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const files = req.files || [];
    const keptUrls = parseJSON(req.body.existingImages, []);
    const keptImages = product.images.filter((image) => keptUrls.includes(image.url));
    const removedImages = product.images.filter((image) => !keptUrls.includes(image.url));

    if (keptImages.length + files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    const data = parseProductBody(req.body, product.status);

    uploaded = await Promise.all(files.map((file) => uploadImage(file.buffer)));

    Object.assign(product, data);
    product.images = buildImages([...keptImages, ...uploaded], data.name);

    await product.save();
    await removeImages(removedImages);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update Product Error:', error);

    await removeImages(uploaded);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map((err) => err.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await removeImages(product.images);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock value'
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { 
        stock,
        status: stock === 0 ? 'out-of-stock' : 'active'
      },
      { returnDocument: 'after' }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update Stock Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
};