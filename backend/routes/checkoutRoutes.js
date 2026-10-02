const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const {
  validateCart,
  calculateTotals,
  createOrder,
  uploadPaymentProof,
  getPaymentQR
} = require('../controllers/checkoutController');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// All checkout routes require authentication
router.use(protect);

// Validate cart before checkout
router.post('/validate-cart', validateCart);

// Calculate totals with shipping and tax
router.post('/calculate-totals', calculateTotals);

// Get payment QR code details
router.get('/payment-qr', getPaymentQR);

// Create order (before payment)
router.post('/create-order', createOrder);

// Upload payment screenshot
router.post('/upload-payment-proof/:orderId', upload.single('screenshot'), uploadPaymentProof);

module.exports = router;
