const mongoose = require('mongoose');
const Cart = require('../models/Cart');
require('dotenv').config();

/**
 * Cleanup script to remove duplicate active carts
 * This script will:
 * 1. Find all users with multiple active carts
 * 2. Keep the most recently updated cart
 * 3. Mark others as 'abandoned'
 */
async function cleanupDuplicateCarts() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB');

    // Find all active carts grouped by user
    const users = await Cart.aggregate([
      { $match: { status: 'active', user: { $ne: null } } },
      {
        $group: {
          _id: '$user',
          carts: { $push: { id: '$_id', updatedAt: '$updatedAt', itemCount: { $size: '$items' } } },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ]);

    console.log(`\nFound ${users.length} users with duplicate active carts`);

    let totalFixed = 0;

    for (const user of users) {
      console.log(`\nUser: ${user._id}`);
      console.log(`Active carts: ${user.count}`);

      // Sort carts by updatedAt (most recent first)
      const sortedCarts = user.carts.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      console.log('Carts:');
      sortedCarts.forEach((cart, index) => {
        console.log(`  ${index + 1}. ID: ${cart.id}, Updated: ${cart.updatedAt}, Items: ${cart.itemCount}`);
      });

      // Keep the first (most recent) cart, abandon the rest
      const cartsToAbandon = sortedCarts.slice(1);
      
      if (cartsToAbandon.length > 0) {
        const cartIds = cartsToAbandon.map(c => c.id);
        
        const result = await Cart.updateMany(
          { _id: { $in: cartIds } },
          { $set: { status: 'abandoned' } }
        );

        console.log(`  Marked ${result.modifiedCount} cart(s) as abandoned`);
        totalFixed += result.modifiedCount;
      }
    }

    console.log(`\n✓ Cleanup complete. Fixed ${totalFixed} duplicate carts.`);

    // Also find and log any carts with no items that are still active
    const emptyCarts = await Cart.find({
      status: 'active',
      items: { $size: 0 },
      updatedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Older than 1 day
    });

    if (emptyCarts.length > 0) {
      console.log(`\nFound ${emptyCarts.length} empty active cart(s) older than 1 day`);
      console.log('Marking these as abandoned...');
      
      const result = await Cart.updateMany(
        {
          status: 'active',
          items: { $size: 0 },
          updatedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        },
        { $set: { status: 'abandoned' } }
      );
      
      console.log(`✓ Marked ${result.modifiedCount} empty cart(s) as abandoned`);
    }

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the cleanup
cleanupDuplicateCarts();
