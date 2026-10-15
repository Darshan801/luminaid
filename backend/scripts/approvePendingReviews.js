const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
require('dotenv').config();

const approvePendingReviews = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all pending reviews
    const pendingReviews = await Review.find({ status: 'pending' });
    console.log(`Found ${pendingReviews.length} pending reviews`);

    if (pendingReviews.length === 0) {
      console.log('No pending reviews to approve');
      process.exit(0);
    }

    // Approve all pending reviews
    let approvedCount = 0;
    for (const review of pendingReviews) {
      await review.approve();
      approvedCount++;
      console.log(`Approved review ${review._id} by ${review.authorName}`);
    }

    console.log(`\nSuccessfully approved ${approvedCount} reviews`);
    process.exit(0);
  } catch (error) {
    console.error('Error approving reviews:', error);
    process.exit(1);
  }
};

approvePendingReviews();
