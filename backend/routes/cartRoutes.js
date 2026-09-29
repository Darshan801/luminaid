const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
// const { protect } = require('../middleware/auth'); // Will create later

// Public/Session-based routes
router.get('/', cartController.getCart);
router.get('/count', cartController.getCartCount);
router.post('/items', cartController.addToCart);
router.put('/items/:itemId', cartController.updateCartItem);
router.delete('/items/:itemId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);
router.post('/discount', cartController.applyDiscount);
router.delete('/discount', cartController.removeDiscount);

// Authenticated routes (TODO: Add auth middleware)
// router.post('/merge', protect, cartController.mergeCart);

// Temporary merge route without auth (for testing)
router.post('/merge', cartController.mergeCart);

module.exports = router;
