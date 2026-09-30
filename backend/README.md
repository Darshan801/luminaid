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

- `npm start` - Production
- `npm run dev` - Development (nodemon)
- `npm run seed` - Seed database

## Environment Setup

Copy and configure `.env`:
- `MONGO_URI` - MongoDB connection
- `JWT_SECRET` - Change in production!
- `CLOUDINARY_*` - Image upload credentials

## API Endpoints

- `/api/auth` - Authentication
- `/api/products` - Product management
- `/api/cart` - Shopping cart
- `/api/cloudinary` - Image upload

See `/bin/backend/docs/` for detailed documentation.
