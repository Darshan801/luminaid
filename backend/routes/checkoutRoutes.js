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
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit (reduced for security)
    files: 1 // Only one file per request
  },
  fileFilter: (req, file, cb) => {
    // Only allow specific image types
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed'), false);
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
