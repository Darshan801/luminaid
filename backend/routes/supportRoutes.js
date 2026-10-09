const express = require('express');
const {
  submitContactForm,
  subscribeNewsletter,
  getShippingInfo,
  getReturnPolicy,
  getGuides,
  getGuideBySlug
} = require('../controllers/supportController');

const router = express.Router();

// Contact form
router.post('/contact', submitContactForm);

// Newsletter subscription
router.post('/newsletter', subscribeNewsletter);

// Shipping information
router.get('/shipping', getShippingInfo);

// Return policy
router.get('/returns', getReturnPolicy);

// Product guides
router.get('/guides', getGuides);
router.get('/guides/:slug', getGuideBySlug);

module.exports = router;
