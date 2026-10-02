# LuminAID Backend

Node.js/Express backend API for LuminAID e-commerce platform.

## Quick Start

```bash
npm install
npm run dev
```

Server runs on http://localhost:5000

## Structure

```
backend/
├── config/       # Configuration (Cloudinary)
├── controllers/  # Business logic
├── middleware/   # Auth & validators
├── models/       # MongoDB models
├── routes/       # API routes
├── seeds/        # Database seeds
├── .env         # Environment variables
└── server.js    # Entry point
```

## Scripts

- `npm start` - Production server
- `npm run dev` - Development with nodemon
- `npm run seed` - Seed database with products

### Maintenance Scripts

Run these scripts manually when needed:

```bash
# Clean up duplicate and abandoned carts
node scripts/cleanupCarts.js
```

**Recommended Schedule:**
- Run `cleanupCarts.js` weekly or via cron job
- Helps maintain database performance
- Removes duplicate active carts per user
- Archives empty carts older than 24 hours

## Environment Setup

Copy and configure `.env`:
- `MONGO_URI` - MongoDB connection
- `JWT_SECRET` - Change in production!
- `CLOUDINARY_*` - Image upload credentials

## API Endpoints

- `/api/auth` - Authentication
- `/api/products` - Product management
- `/api/cart` - Shopping cart
- `/api/checkout` - Checkout and order creation
- `/api/orders` - Order management
- `/api/cloudinary` - Image upload

See `/bin/documentation/` for detailed API documentation.
