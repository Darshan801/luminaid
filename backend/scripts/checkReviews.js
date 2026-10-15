const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const checkReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Get all reviews
    const reviews = await Review.find({})
      .populate('user', 'firstName lastName email')
      .populate('product', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    console.log(`Found ${reviews.length} reviews:\n`);

    reviews.forEach((review, index) => {
      console.log(`${index + 1}. Review by ${review.authorName}`);
      console.log(`   Product: ${review.product?.name || 'Unknown'}`);
      console.log(`   Rating: ${review.rating} stars`);
      console.log(`   Status: ${review.status}`);
      console.log(`   Helpful: ${review.helpful}, Not Helpful: ${review.notHelpful}`);
      console.log(`   Votes: ${review.helpfulVotes.length}`);
      console.log(`   Created: ${review.createdAt}`);
      console.log(`   Published: ${review.publishedAt || 'Not set'}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkReviews();
