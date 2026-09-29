const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// const { protect, authorize } = require('../middleware/auth'); // Will create later

// Public routes
router.get('/featured', productController.getFeaturedProducts);
router.get('/bestsellers', productController.getBestsellerProducts);
router.get('/search', productController.searchProducts);
router.get('/categories/list', productController.getCategories);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:identifier/stock', productController.checkStock);
router.get('/:identifier', productController.getProductByIdOrSlug);
router.get('/', productController.getAllProducts);

// Admin routes (TODO: Add auth middleware)
// router.post('/', protect, authorize('admin'), productController.createProduct);
// router.put('/:id', protect, authorize('admin'), productController.updateProduct);
// router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);
// router.patch('/:id/stock', protect, authorize('admin'), productController.updateStock);

// Temporary admin routes without auth (REMOVE IN PRODUCTION)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id/stock', productController.updateStock);

module.exports = router;
