require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import routes
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Body received:', JSON.stringify(req.body, null, 2));
    }
    next();
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API info route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LuminAID API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/logout': 'Logout user (protected)',
        'GET /api/auth/me': 'Get current user (protected)',
        'PUT /api/auth/updatedetails': 'Update user details (protected)',
        'PUT /api/auth/updatepassword': 'Update password (protected)',
        'POST /api/auth/forgotpassword': 'Send password reset email',
        'PUT /api/auth/resetpassword/:token': 'Reset password with token',
        'GET /api/auth/verify-email/:token': 'Verify email address',
      },
      products: {
        'GET /api/products': 'Get all products',
        'GET /api/products/:id': 'Get product by ID or slug',
        'GET /api/products/featured': 'Get featured products',
        'GET /api/products/bestsellers': 'Get bestseller products',
        'GET /api/products/search?q=query': 'Search products',
        'GET /api/products/category/:category': 'Get products by category',
        'GET /api/products/categories/list': 'Get all categories',
        'POST /api/products': 'Create product (admin)',
      },
      cart: {
        'GET /api/cart': 'Get cart',
        'GET /api/cart/count': 'Get cart item count',
        'POST /api/cart/items': 'Add item to cart',
        'PUT /api/cart/items/:itemId': 'Update cart item',
        'DELETE /api/cart/items/:itemId': 'Remove cart item',
        'DELETE /api/cart': 'Clear cart',
        'POST /api/cart/discount': 'Apply discount code',
        'DELETE /api/cart/discount': 'Remove discount code',
      },
      cloudinary: {
        'POST /api/cloudinary/upload': 'Upload image to Cloudinary'
      }
    },
    documentation: '/api/docs (coming soon)'
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Database connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('[SUCCESS] MongoDB connected successfully');
    console.log(`[DATABASE] ${mongoose.connection.name}`);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`[SERVER] Running on http://localhost:${PORT}`);
      console.log(`[ENV] ${process.env.NODE_ENV || 'development'}`);
      console.log(`[API] http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('[ERROR] MongoDB connection failed:', error.message);
    process.exit(1);
  });