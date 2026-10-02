const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public/Session-based routes with optional auth
// This allows both authenticated and guest users to use cart
router.use(optionalAuth);

router.get('/', cartController.getCart);
router.get('/count', cartController.getCartCount);
router.post('/items', cartController.addToCart);
router.put('/items/:itemId', cartController.updateCartItem);
router.delete('/items/:itemId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);
router.post('/discount', cartController.applyDiscount);
router.delete('/discount', cartController.removeDiscount);

// Authenticated routes (merge requires authentication)
router.post('/merge', protect, cartController.mergeCart);

module.exports = router;
