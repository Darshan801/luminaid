const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      rating = null,
      verified = null
    } = req.query;

    const query = {
      product: productId,
      status: 'approved'
    };

    if (rating) {
      query.rating = Number(rating);
    }

    if (verified !== null) {
      query.isVerifiedPurchase = verified === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Validate and map sort parameter
    const sortMap = {
      '-createdAt': { createdAt: -1 }, // Most Recent (default)
      'createdAt': { createdAt: 1 },   // Oldest First
      '-rating': { rating: -1, createdAt: -1 }, // Highest Rating
      'rating': { rating: 1, createdAt: -1 },   // Lowest Rating
      '-helpful': { helpful: -1, createdAt: -1 }, // Most Helpful
      'helpful': { helpful: 1, createdAt: -1 }   // Least Helpful
    };

    const sortOption = sortMap[sort] || sortMap['-createdAt'];

    const reviews = await Review.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'firstName lastName')
      .populate('response.respondedBy', 'firstName lastName');

    // Add userVote field for logged-in users
    const reviewsWithUserVote = reviews.map(review => {
      const reviewObj = review.toObject();
      if (req.user) {
        const userVote = review.helpfulVotes.find(
          v => v.user && v.user.toString() === req.user._id.toString()
        );
        reviewObj.userVote = userVote ? userVote.vote : null;
      } else {
        reviewObj.userVote = null;
      }
      return reviewObj;
    });

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: reviewsWithUserVote
    });
  } catch (error) {
    console.error('Get Product Reviews Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// @desc    Get review statistics for a product
// @route   GET /api/reviews/product/:productId/stats
// @access  Public
exports.getProductReviewStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const stats = await Review.getProductReviewStats(productId);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get Review Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics',
      error: error.message
    });
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('product', 'name slug images')
      .populate('response.respondedBy', 'firstName lastName');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Get Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { product, rating, title, comment } = req.body;

    // Validate required fields
    if (!product || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user purchased the product
    const hasPurchased = await Order.exists({
      user: req.user._id,
      'items.product': product,
      paymentStatus: 'paid',
      status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
    });

    // Create review
    const review = await Review.create({
      product,
      user: req.user._id,
      authorName: `${req.user.firstName} ${req.user.lastName}`,
      authorEmail: req.user.email,
      rating: Number(rating),
      title: title.trim(),
      comment: comment.trim(),
      isVerifiedPurchase: !!hasPurchased,
      status: 'approved', // Auto-approve reviews (change to 'pending' if manual moderation needed)
      publishedAt: new Date() // Set published date immediately
    });

    // Populate user info
    await review.populate('user', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Review submitted and published successfully',
      data: review,
      isPending: false
    });
  } catch (error) {
    console.error('Create Review Error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    const { rating, title, comment } = req.body;

    if (rating) review.rating = Number(rating);
    if (title) review.title = title.trim();
    if (comment) review.comment = comment.trim();

    // Keep the review approved if it was already approved (don't reset to pending)
    // Only set to pending if explicitly implementing strict moderation workflow
    // review.status = 'pending'; // Commented out - keep existing status

    await review.save();
    await review.populate('user', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Update Review Error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review or is admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    await review.deleteOne();

    // Update product rating
    const product = await Product.findById(review.product);
    if (product) {
      await product.updateRating();
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// @desc    Vote on review helpfulness (toggle or change vote)
// @route   POST /api/reviews/:id/vote
// @access  Private
exports.voteReview = async (req, res) => {
  try {
    const { vote } = req.body;

    if (!vote || !['helpful', 'not-helpful'].includes(vote)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote type. Must be "helpful" or "not-helpful"'
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.addVote(req.user._id, vote);

    // Find user's current vote (if any) after the update
    const userVote = review.helpfulVotes.find(
      v => v.user && v.user.toString() === req.user._id.toString()
    );

    res.status(200).json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        helpful: review.helpful,
        notHelpful: review.notHelpful,
        userVote: userVote ? userVote.vote : null // null means user removed their vote
      }
    });
  } catch (error) {
    console.error('Vote Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vote',
      error: error.message
    });
  }
};

// @desc    Add helpful reaction (simplified endpoint per requirements)
// @route   PUT /api/reviews/:id/helpful
// @access  Private
exports.addHelpfulReaction = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot vote on non-approved reviews'
      });
    }

    await review.addVote(req.user._id, 'helpful');

    const userVote = review.helpfulVotes.find(
      v => v.user && v.user.toString() === req.user._id.toString()
    );

    res.status(200).json({
      success: true,
      message: 'Helpful reaction added',
      data: {
        helpful: review.helpful,
        notHelpful: review.notHelpful,
        userVote: userVote ? userVote.vote : null
      }
    });
  } catch (error) {
    console.error('Add Helpful Reaction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add helpful reaction',
      error: error.message
    });
  }
};

// @desc    Remove helpful reaction
// @route   DELETE /api/reviews/:id/helpful
// @access  Private
exports.removeHelpfulReaction = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user has voted
    const existingVoteIndex = review.helpfulVotes.findIndex(
      v => v.user && v.user.toString() === req.user._id.toString()
    );

    if (existingVoteIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You have not voted on this review'
      });
    }

    const oldVote = review.helpfulVotes[existingVoteIndex].vote;

    // Remove vote counts
    if (oldVote === 'helpful') {
      review.helpful = Math.max(0, review.helpful - 1);
    } else {
      review.notHelpful = Math.max(0, review.notHelpful - 1);
    }

    // Remove the vote
    review.helpfulVotes.splice(existingVoteIndex, 1);
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Helpful reaction removed',
      data: {
        helpful: review.helpful,
        notHelpful: review.notHelpful,
        userVote: null
      }
    });
  } catch (error) {
    console.error('Remove Helpful Reaction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove helpful reaction',
      error: error.message
    });
  }
};

// @desc    Report review
// @route   POST /api/reviews/:id/report
// @access  Private
exports.reportReview = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for reporting'
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.reportReview(req.user._id, reason.trim());

    res.status(200).json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    console.error('Report Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report review',
      error: error.message
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user/me
// @access  Private
exports.getMyReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('product', 'name images slug');

    const total = await Review.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: reviews
    });
  } catch (error) {
    console.error('Get My Reviews Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your reviews',
      error: error.message
    });
  }
};

// @desc    Check if user can review product
// @route   GET /api/reviews/can-review/:productId
// @access  Private
exports.canUserReview = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await Review.canUserReview(req.user._id, productId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Can Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check review eligibility',
      error: error.message
    });
  }
};

// ==================== ADMIN ROUTES ====================

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
exports.getAdminReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, rating } = req.query;

    const query = {};
    if (status) query.status = status;
    if (rating) query.rating = Number(rating);

    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'firstName lastName email')
      .populate('product', 'name slug images')
      .populate('response.respondedBy', 'firstName lastName');

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: reviews
    });
  } catch (error) {
    console.error('Get Admin Reviews Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// @desc    Approve review (admin)
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.approve();

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: review
    });
  } catch (error) {
    console.error('Approve Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve review',
      error: error.message
    });
  }
};

// @desc    Reject review (admin)
// @route   PUT /api/reviews/:id/reject
// @access  Private/Admin
exports.rejectReview = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rejection reason'
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.reject(reason);

    res.status(200).json({
      success: true,
      message: 'Review rejected successfully',
      data: review
    });
  } catch (error) {
    console.error('Reject Review Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject review',
      error: error.message
    });
  }
};

// @desc    Add admin response to review
// @route   POST /api/reviews/:id/response
// @access  Private/Admin
exports.addAdminResponse = async (req, res) => {
  try {
    const { response } = req.body;

    if (!response || response.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a response'
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.addResponse(response.trim(), req.user._id);
    await review.populate('response.respondedBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: review
    });
  } catch (error) {
    console.error('Add Response Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
      error: error.message
    });
  }
};

module.exports = exports;
