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
    support_email: process.env.SUPPORT_EMAIL || 'Not set',
    // Check if EMAIL_FROM matches SMTP_USER
    emails_match: process.env.EMAIL_FROM === process.env.SMTP_USER
  };

  res.status(200).json({
    success: true,
    message: 'Email configuration status',
    config,
    ready: config.smtp_configured,
    warning: !config.emails_match ? 'EMAIL_FROM should match SMTP_USER for Gmail' : null,
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

/**
 * @desc    Test support ticket email
 * @route   GET /api/email-test/support-ticket
 * @access  Public (for testing only)
 */
router.get('/support-ticket', async (req, res) => {
  try {
    const mockContactData = {
      name: 'John Doe',
      email: req.query.email || 'helloearth146@gmail.com',
      subject: 'Issue with product charging',
      message: 'Hello, I am having trouble charging my PackLite Titan. The LED indicator does not turn on when I connect it to USB power. Can you please help me troubleshoot this issue?',
      orderNumber: 'ORD-20261019-TEST1',
      ticketId: `TICKET-${Date.now()}`,
      submittedAt: new Date()
    };

    const result = await emailService.sendSupportConfirmation(mockContactData);

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Support ticket email sent!' : 'Failed to send',
      error: result.error,
      ticketId: mockContactData.ticketId
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
 * @desc    Test newsletter confirmation email
 * @route   GET /api/email-test/newsletter
 * @access  Public (for testing only)
 */
router.get('/newsletter', async (req, res) => {
  try {
    const email = req.query.email || 'helloearth146@gmail.com';

    const result = await emailService.sendNewsletterConfirmation(email);

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Newsletter confirmation email sent!' : 'Failed to send',
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
 * @desc    Test admin support notification email
 * @route   GET /api/email-test/admin-support
 * @access  Public (for testing only)
 */
router.get('/admin-support', async (req, res) => {
  try {
    const mockContactData = {
      name: 'John Doe',
      email: 'customer@example.com',
      subject: 'Product not working as expected',
      message: 'I purchased a PackLite Titan last week and it is not holding a charge properly. After a full day in the sun, it only lasts about 2 hours. I expected much better performance. Please advise on next steps.',
      orderNumber: 'ORD-20261019-TEST1',
      ticketId: `TICKET-${Date.now()}`,
      submittedAt: new Date()
    };

    const result = await emailService.sendAdminSupportNotification(mockContactData);

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Admin support notification sent!' : 'Failed to send',
      error: result.error,
      ticketId: mockContactData.ticketId
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
 * @desc    Test admin payment notification email
 * @route   GET /api/email-test/admin-payment
 * @access  Public (for testing only)
 */
router.get('/admin-payment', async (req, res) => {
  try {
    const mockOrder = {
      orderNumber: 'ORD-20261019-TEST8',
      customerEmail: 'customer@example.com',
      total: 124.76,
      paymentScreenshot: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      createdAt: new Date(),
      _id: 'test123'
    };

    const result = await emailService.sendAdminPaymentNotification(mockOrder);

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Admin payment notification sent!' : 'Failed to send',
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
 * @desc    Test ALL email templates
 * @route   GET /api/email-test/all
 * @access  Public (for testing only)
 */
router.get('/all', async (req, res) => {
  try {
    const testEmail = req.query.email || 'helloearth146@gmail.com';
    const results = [];

    // Test each email type
    console.log('\nTesting ALL email templates...\n');

    // 1. Test Email
    console.log('1. Testing basic test email...');
    results.push({ type: 'test', result: await emailService.sendTestEmail(testEmail) });

    // 2. Welcome Email
    console.log('2. Testing welcome email...');
    results.push({ type: 'welcome', result: await emailService.sendWelcomeEmail({ email: testEmail, firstName: 'John' }) });

    // 3. Email Verification
    console.log('3. Testing email verification...');
    results.push({ type: 'emailVerification', result: await emailService.sendEmailVerification({ email: testEmail, firstName: 'John' }, 'test_token_123') });

    // 4. Password Reset
    console.log('4. Testing password reset...');
    results.push({ type: 'passwordReset', result: await emailService.sendPasswordResetEmail({ email: testEmail, firstName: 'John' }, 'reset_token_123') });

    // 5. Password Changed
    console.log('5. Testing password changed...');
    results.push({ type: 'passwordChanged', result: await emailService.sendPasswordChangedEmail({ email: testEmail, firstName: 'John' }) });

    // 6. Order Confirmation
    console.log('6. Testing order confirmation...');
    const mockOrder = {
      orderNumber: 'ORD-TEST-ALL',
      customerEmail: testEmail,
      shippingAddress: { firstName: 'John', lastName: 'Doe', address: '123 Test St', city: 'Test City', state: 'CA', zipCode: '12345', country: 'USA', phone: '1234567890' },
      items: [{ name: 'PackLite Titan', quantity: 1, price: 39.99, subtotal: 39.99 }],
      subtotal: 39.99,
      shipping: 5.99,
      tax: 3.60,
      total: 49.58,
      createdAt: new Date(),
      _id: 'test123'
    };
    results.push({ type: 'orderConfirmation', result: await emailService.sendOrderConfirmation(mockOrder) });

    // 7. Payment Pending
    console.log('7. Testing payment pending...');
    results.push({ type: 'paymentPending', result: await emailService.sendPaymentPendingEmail(mockOrder) });

    // 8. Payment Verified
    console.log('8. Testing payment verified...');
    results.push({ type: 'paymentVerified', result: await emailService.sendPaymentVerifiedEmail(mockOrder) });

    // 9. Payment Rejected
    console.log('9. Testing payment rejected...');
    results.push({ type: 'paymentRejected', result: await emailService.sendPaymentRejectedEmail(mockOrder, 'Payment screenshot unclear') });

    // 10. Order Shipped
    console.log('10. Testing order shipped...');
    const shippedOrder = { ...mockOrder, trackingNumber: '1Z999AA10123456784', carrier: 'UPS', estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) };
    results.push({ type: 'orderShipped', result: await emailService.sendOrderShippedEmail(shippedOrder) });

    // 11. Order Delivered
    console.log('11. Testing order delivered...');
    const deliveredOrder = { ...mockOrder, deliveredAt: new Date() };
    results.push({ type: 'orderDelivered', result: await emailService.sendOrderDeliveredEmail(deliveredOrder) });

    // 12. Order Cancelled
    console.log('12. Testing order cancelled...');
    results.push({ type: 'orderCancelled', result: await emailService.sendOrderCancelledEmail(mockOrder, 'Customer requested') });

    // 13. Support Ticket
    console.log('13. Testing support ticket...');
    const contactData = {
      name: 'John Doe',
      email: testEmail,
      subject: 'Product inquiry',
      message: 'Test message',
      ticketId: `TICKET-${Date.now()}`,
      submittedAt: new Date()
    };
    results.push({ type: 'supportTicket', result: await emailService.sendSupportConfirmation(contactData) });

    // 14. Newsletter
    console.log('14. Testing newsletter...');
    results.push({ type: 'newsletter', result: await emailService.sendNewsletterConfirmation(testEmail) });

    // 15. Admin Support Notification
    console.log('15. Testing admin support notification...');
    results.push({ type: 'adminSupportNotification', result: await emailService.sendAdminSupportNotification(contactData) });

    // 16. Admin Payment Notification
    console.log('16. Testing admin payment notification...');
    const paymentOrder = { ...mockOrder, paymentScreenshot: 'https://example.com/payment.jpg' };
    results.push({ type: 'adminPaymentNotification', result: await emailService.sendAdminPaymentNotification(paymentOrder) });

    console.log('\nAll email tests completed!\n');

    // Summary
    const successful = results.filter(r => r.result.success).length;
    const failed = results.filter(r => !r.result.success).length;

    res.status(200).json({
      success: failed === 0,
      message: `Tested all ${results.length} email templates`,
      summary: {
        total: results.length,
        successful,
        failed,
        testEmail
      },
      details: results.map(r => ({
        type: r.type,
        success: r.result.success,
        error: r.result.error
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test suite failed',
      error: error.message
    });
  }
});

module.exports = router;
