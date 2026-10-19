const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

/**
 * @desc    Test email service
 * @route   GET /api/email-test
 * @access  Public (for testing only - remove in production)
 */
router.get('/test', async (req, res) => {
  try {
    const { to } = req.query;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Please provide "to" email address in query params',
        example: '/api/email-test/test?to=youremail@gmail.com'
      });
    }

    // Send test email
    const result = await emailService.sendTestEmail(to);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Test email sent successfully!',
        to: to,
        messageId: result.messageId
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

/**
 * @desc    Test welcome email
 * @route   GET /api/email-test/welcome
 * @access  Public (for testing only)
 */
router.get('/welcome', async (req, res) => {
  try {
    const { email, firstName } = req.query;

    if (!email || !firstName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and firstName in query params',
        example: '/api/email-test/welcome?email=test@gmail.com&firstName=John'
      });
    }

    const result = await emailService.sendWelcomeEmail({
      email,
      firstName
    });

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Welcome email sent!' : 'Failed to send welcome email',
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

/**
 * @desc    Test password reset email
 * @route   GET /api/email-test/password-reset
 * @access  Public (for testing only)
 */
router.get('/password-reset', async (req, res) => {
  try {
    const { email, firstName } = req.query;

    if (!email || !firstName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and firstName in query params'
      });
    }

    // Generate a fake token for testing
    const fakeToken = 'test_' + Math.random().toString(36).substring(7);

    const result = await emailService.sendPasswordResetEmail(
      { email, firstName },
      fakeToken
    );

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Password reset email sent!' : 'Failed to send',
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

/**
 * @desc    Check email configuration
 * @route   GET /api/email-test/config
 * @access  Public (for testing only)
 */
router.get('/config', (req, res) => {
  const config = {
    smtp_configured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
    smtp_host: process.env.SMTP_HOST || 'Not set',
    smtp_port: process.env.SMTP_PORT || 'Not set',
    smtp_user: process.env.SMTP_USER ? '✓ Set' : '✗ Not set',
    smtp_pass: process.env.SMTP_PASS ? '✓ Set' : '✗ Not set',
    email_from: process.env.EMAIL_FROM || 'Not set',
    email_from_name: process.env.EMAIL_FROM_NAME || 'Not set',
    admin_email: process.env.ADMIN_EMAIL || 'Not set',
    support_email: process.env.SUPPORT_EMAIL || 'Not set'
  };

  res.status(200).json({
    success: true,
    message: 'Email configuration status',
    config,
    ready: config.smtp_configured,
    instructions: config.smtp_configured 
      ? 'Email service is configured! You can test it now.'
      : 'Please configure SMTP settings in .env file'
  });
});

/**
 * @desc    Test order confirmation email
 * @route   GET /api/email-test/order-confirmation
 * @access  Public (for testing only)
 */
router.get('/order-confirmation', async (req, res) => {
  try {
    const mockOrder = {
      orderNumber: 'ORD-20261019-TEST1',
      customerEmail: req.query.email || 'helloearth146@gmail.com',
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Test Street',
        city: 'Test City',
        state: 'CA',
        zipCode: '12345',
        country: 'USA',
        phone: '1234567890'
      },
      items: [
        {
          name: 'PackLite Titan 2-in-1',
          quantity: 2,
          price: 39.99,
          subtotal: 79.98,
          variant: 'Orange'
        },
        {
          name: 'Solar String Lights',
          quantity: 1,
          price: 29.99,
          subtotal: 29.99
        }
      ],
      subtotal: 109.97,
      shipping: 5.99,
      tax: 8.80,
      total: 124.76,
      createdAt: new Date(),
      _id: 'test123'
    };

    const result = await emailService.sendOrderConfirmation(mockOrder);

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Order confirmation email sent!' : 'Failed to send',
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

/**
 * @desc    Test payment pending email
 * @route   GET /api/email-test/payment-pending
 * @access  Public (for testing only)
 */
router.get('/payment-pending', async (req, res) => {
  try {
    const mockOrder = {
      orderNumber: 'ORD-20261019-TEST2',
      customerEmail: req.query.email || 'helloearth146@gmail.com',
      shippingAddress: { firstName: 'John' },
      total: 124.76
    };

    const result = await emailService.sendPaymentPendingEmail(mockOrder);

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Payment pending email sent!' : 'Failed to send',
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

/**
 * @desc    Test payment verified email
 * @route   GET /api/email-test/payment-verified
 * @access  Public (for testing only)
 */
router.get('/payment-verified', async (req, res) => {
  try {
    const mockOrder = {
      orderNumber: 'ORD-20261019-TEST3',
      customerEmail: req.query.email || 'helloearth146@gmail.com',
      shippingAddress: { firstName: 'John' },
      _id: 'test123'
    };

    const result = await emailService.sendPaymentVerifiedEmail(mockOrder);

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Payment verified email sent!' : 'Failed to send',
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

/**
 * @desc    Test payment rejected email
 * @route   GET /api/email-test/payment-rejected
 * @access  Public (for testing only)
 */
router.get('/payment-rejected', async (req, res) => {
  try {
    const mockOrder = {
      orderNumber: 'ORD-20261019-TEST4',
      customerEmail: req.query.email || 'helloearth146@gmail.com',
      shippingAddress: { firstName: 'John' },
      total: 124.76
    };

    const result = await emailService.sendPaymentRejectedEmail(
      mockOrder,
      'Payment screenshot is unclear. Please upload a clearer image.'
    );

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Payment rejected email sent!' : 'Failed to send',
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

/**
 * @desc    Test order shipped email
 * @route   GET /api/email-test/order-shipped
 * @access  Public (for testing only)
 */
router.get('/order-shipped', async (req, res) => {
  try {
    const mockOrder = {
      orderNumber: 'ORD-20261019-TEST5',
      customerEmail: req.query.email || 'helloearth146@gmail.com',
      shippingAddress: { firstName: 'John' },
      trackingNumber: '1Z999AA10123456784',
      carrier: 'UPS',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      _id: 'test123'
    };

    const result = await emailService.sendOrderShippedEmail(mockOrder);

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Order shipped email sent!' : 'Failed to send',
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

/**
 * @desc    Test order delivered email
 * @route   GET /api/email-test/order-delivered
 * @access  Public (for testing only)
 */
router.get('/order-delivered', async (req, res) => {
  try {
    const mockOrder = {
      orderNumber: 'ORD-20261019-TEST6',
      customerEmail: req.query.email || 'helloearth146@gmail.com',
      shippingAddress: { firstName: 'John' },
      deliveredAt: new Date(),
      _id: 'test123'
    };

    const result = await emailService.sendOrderDeliveredEmail(mockOrder);

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Order delivered email sent!' : 'Failed to send',
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

/**
 * @desc    Test order cancelled email
 * @route   GET /api/email-test/order-cancelled
 * @access  Public (for testing only)
 */
router.get('/order-cancelled', async (req, res) => {
  try {
    const mockOrder = {
      orderNumber: 'ORD-20261019-TEST7',
      customerEmail: req.query.email || 'helloearth146@gmail.com',
      shippingAddress: { firstName: 'John' },
      total: 124.76
    };

    const result = await emailService.sendOrderCancelledEmail(
      mockOrder,
      'Customer requested cancellation'
    );

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Order cancelled email sent!' : 'Failed to send',
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

module.exports = router;
