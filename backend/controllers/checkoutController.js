const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

/**
 * @desc    Validate cart before checkout
 * @route   POST /api/checkout/validate-cart
 * @access  Private
 */
exports.validateCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    console.log('[validateCart] ===== START VALIDATE CART =====');
    console.log('[validateCart] User ID:', userId);
    console.log('[validateCart] Request timestamp:', new Date().toISOString());

    // Use findUserCart to ensure we get the same cart as addToCart
    // This will also clean up any duplicate active carts
    const cart = await Cart.findUserCart(userId);

    console.log('[validateCart] Cart found:', cart ? 'Yes' : 'No');
    if (cart) {
      console.log('[validateCart] Cart ID:', cart._id);
      console.log('[validateCart] Cart status:', cart.status);
      console.log('[validateCart] Cart user:', cart.user);
      console.log('[validateCart] Cart items count:', cart.items.length);
      console.log('[validateCart] Cart updatedAt:', cart.updatedAt);
      console.log('[validateCart] Cart createdAt:', cart.createdAt);
    }

    if (!cart || cart.items.length === 0) {
      console.log('[validateCart] Cart is empty, returning 400');
      console.log('[validateCart] ===== END VALIDATE CART (EMPTY) =====');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
        valid: false,
        cart: null,
        issues: []
      });
    }

    // Validate each item
    const issues = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        issues.push({
          itemId: item._id,
          issue: 'Product no longer available',
          productName: item.productSnapshot?.name || 'Unknown'
        });
        continue;
      }

      if (product.status !== 'active') {
        issues.push({
          itemId: item._id,
          issue: 'Product is no longer available for purchase',
          productName: product.name
        });
      }

      if (product.trackInventory && product.stock < item.quantity) {
        issues.push({
          itemId: item._id,
          issue: `Only ${product.stock} items available`,
          productName: product.name,
          availableStock: product.stock,
          requestedQuantity: item.quantity
        });
      }
    }

    console.log('[validateCart] Validation complete. Issues:', issues.length);
    console.log('[validateCart] ===== END VALIDATE CART (SUCCESS) =====');

    res.status(200).json({
      success: true,
      valid: issues.length === 0,
      cart,
      issues
    });
  } catch (error) {
    console.error('Validate cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate cart'
    });
  }
};

/**
 * @desc    Calculate order totals with shipping and tax
 * @route   POST /api/checkout/calculate-totals
 * @access  Private
 */
exports.calculateTotals = async (req, res) => {
  try {
    const { shippingMethod, state } = req.body;
    const userId = req.user?.id;

    // Use findUserCart to ensure consistency
    const cart = await Cart.findUserCart(userId);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

    // Calculate shipping cost based on method
    const shippingCosts = {
      standard: 5.99,
      express: 14.99,
      overnight: 24.99,
      international: 39.99
    };

    const shippingCost = shippingCosts[shippingMethod] || shippingCosts.standard;

    // Calculate tax (example: 8% tax rate)
    // In production, you'd calculate based on state/zip code
    const taxRate = 0.08;
    const tax = subtotal * taxRate;

    // Calculate total
    const total = subtotal + shippingCost + tax - (cart.discount || 0);

    res.status(200).json({
      success: true,
      totals: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        discount: parseFloat((cart.discount || 0).toFixed(2)),
        shipping: parseFloat(shippingCost.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Calculate totals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate totals'
    });
  }
};

/**
 * @desc    Create order (before payment verification)
 * @route   POST /api/checkout/create-order
 * @access  Private
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      billingAddress,
      sameAsShipping,
      shippingMethod,
      customerNotes
    } = req.body;

    const userId = req.user?.id;
    const customerEmail = req.user?.email || req.body.email;

    // Validate required fields
    if (!shippingAddress || !customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address and email are required'
      });
    }

    // Use findUserCart to ensure consistency
    const cart = await Cart.findUserCart(userId);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock availability
    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product || product.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productSnapshot?.name || 'item'} is no longer available`
        });
      }

      if (product.trackInventory && product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available.`
        });
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const itemSubtotal = (item.price || 0) * (item.quantity || 0);
      return sum + itemSubtotal;
    }, 0);
    
    const shippingCosts = {
      standard: 5.99,
      express: 14.99,
      overnight: 24.99,
      international: 39.99
    };
    const shippingCost = shippingCosts[shippingMethod] || shippingCosts.standard;
    
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    
    const total = subtotal + shippingCost + tax - (cart.discount || 0);

    // Generate unique order number (format: ORD-YYYYMMDD-XXXXX)
    const generateOrderNumber = () => {
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
      const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
      return `ORD-${dateStr}-${randomStr}`;
    };

    const orderNumber = generateOrderNumber();

    // Create order
    const order = await Order.create({
      orderNumber,
      user: userId,
      customerEmail: customerEmail.toLowerCase(),
      items: cart.items.map(item => ({
        product: item.product,
        name: item.productSnapshot.name,
        sku: item.productSnapshot.sku,
        image: item.productSnapshot.images?.[0] || item.productSnapshot.image,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        subtotal: (item.price || 0) * (item.quantity || 0) // Calculate subtotal for each item
      })),
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat((cart.discount || 0).toFixed(2)),
      discountCode: cart.discountCode,
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shippingCost.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      shippingAddress,
      billingAddress: sameAsShipping ? shippingAddress : billingAddress,
      sameAsShipping,
      shippingMethod,
      paymentMethod: 'qr_payment',
      paymentStatus: 'pending_verification',
      status: 'pending',
      customerNotes
    });

    // Reserve inventory
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product.trackInventory) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created. Please upload payment proof.',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};

/**
 * @desc    Upload payment screenshot
 * @route   POST /api/checkout/upload-payment-proof/:orderId
 * @access  Private
 */
exports.uploadPaymentProof = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Payment screenshot is required'
      });
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify user owns this order
    if (order.user && order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (order.paymentStatus !== 'pending_verification') {
      return res.status(400).json({
        success: false,
        message: 'Order payment already processed'
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'luminaid/payment-proofs',
      resource_type: 'image',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    // Update order with screenshot URL
    order.paymentScreenshot = result.secure_url;
    await order.save();

    // Mark cart as converted
    if (order.user) {
      const cart = await Cart.findOne({ user: order.user, status: 'active' });
      if (cart) {
        cart.status = 'converted';
        await cart.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment proof uploaded successfully. Your order is pending admin verification.',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        paymentScreenshot: order.paymentScreenshot,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload payment proof',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get bank QR code details
 * @route   GET /api/checkout/payment-qr
 * @access  Private
 */
exports.getPaymentQR = async (req, res) => {
  try {
    // Return static bank QR code details
    // In production, you might store this in database or environment variables
    res.status(200).json({
      success: true,
      paymentDetails: {
        qrCodeUrl: '/images/payment/bank-qr-code.png', // Static QR code image
        bankName: 'LuminAID Bank Account',
        accountNumber: '1234567890',
        accountName: 'LuminAID Inc.',
        instructions: [
          'Scan the QR code with your banking app',
          'Enter the order total amount',
          'Complete the payment',
          'Take a screenshot of the successful payment',
          'Upload the screenshot on the next page'
        ]
      }
    });
  } catch (error) {
    console.error('Get payment QR error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment details'
    });
  }
};
