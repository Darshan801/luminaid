const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  getProductReviewStats,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  voteReview,
  addHelpfulReaction,
  removeHelpfulReaction,
  reportReview,
  getMyReviews,
  canUserReview,
  getLatestReviews,
  getAdminReviews,
  approveReview,
  rejectReview,
  addAdminResponse
} = require('../controllers/reviewController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Public routes (with optional auth for userVote)
router.get('/latest', getLatestReviews);
router.get('/product/:productId', optionalAuth, getProductReviews);
router.get('/product/:productId/stats', getProductReviewStats);
router.get('/:id', getReview);

// Protected routes (require authentication)
router.use(protect);

router.get('/user/me', getMyReviews);
router.get('/can-review/:productId', canUserReview);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/vote', voteReview); // Legacy endpoint - supports toggle
router.put('/:id/helpful', addHelpfulReaction); // Add helpful reaction
router.delete('/:id/helpful', removeHelpfulReaction); // Remove reaction
router.post('/:id/report', reportReview);

// Admin routes
router.get('/admin/all', authorize('admin'), getAdminReviews);
router.put('/:id/approve', authorize('admin'), approveReview);
router.put('/:id/reject', authorize('admin'), rejectReview);
router.post('/:id/response', authorize('admin'), addAdminResponse);

module.exports = router;
