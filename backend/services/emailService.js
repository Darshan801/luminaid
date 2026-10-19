const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const logger = require('../utils/logger');

// Create reusable transporter
let transporter = null;

// Configure Handlebars to allow prototype property access
handlebars.registerHelper('currentYear', () => new Date().getFullYear());

// Load shared template with runtime options
const sharedTemplatePath = path.join(__dirname, '../templates/emails/_shared.html');
const sharedTemplate = fs.readFileSync(sharedTemplatePath, 'utf-8');
const compiledSharedTemplate = handlebars.compile(sharedTemplate, {
  allowProtoPropertiesByDefault: true,
  allowProtoMethodsByDefault: true
});

const createTransporter = () => {
  if (transporter) return transporter;

  // Development/Testing: Use Gmail SMTP
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Remove any spaces from password
    const cleanPassword = process.env.SMTP_PASS.replace(/\s/g, '');
    
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: cleanPassword,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    logger.info('Email transporter configured with SMTP');
    return transporter;
  }

  // Fallback: Log emails to console (development without SMTP)
  logger.warn('No email configuration found. Emails will be logged to console.');
  transporter = {
    sendMail: async (mailOptions) => {
      logger.info('Email would be sent:', {
        to: mailOptions.to,
        subject: mailOptions.subject,
        from: mailOptions.from
      });
      return { messageId: 'mock-' + Date.now() };
    }
  };

  return transporter;
};

// Load and compile email template
const loadTemplate = (templateName, data) => {
  try {
    const contentPath = path.join(__dirname, '../templates/emails/content', `${templateName}.html`);
    
    if (!fs.existsSync(contentPath)) {
      logger.warn(`Content template not found: ${templateName}, using fallback`);
      return createFallbackContent(data);
    }

    const contentSource = fs.readFileSync(contentPath, 'utf-8');
    const contentTemplate = handlebars.compile(contentSource, {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    });
    const emailBody = contentTemplate(data, {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    });
    
    // Wrap content in shared template
    return compiledSharedTemplate({
      emailTitle: data.emailTitle || 'LuminAID',
      emailHeading: data.emailHeading,
      emailMessage: data.emailMessage,
      emailBody: emailBody,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
      supportEmail: process.env.SUPPORT_EMAIL || 'support@luminaid.com',
      currentYear: new Date().getFullYear()
    }, {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    });
  } catch (error) {
    logger.error(`Error loading template ${templateName}:`, error);
    return createFallbackContent(data);
  }
};

// Fallback content for when template is not found
const createFallbackContent = (data) => {
  const simpleContent = `
    <div class="email-details">
      <p><strong>Email Data:</strong></p>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    </div>
  `;
  
  return compiledSharedTemplate({
    emailTitle: 'LuminAID',
    emailHeading: data.emailHeading || 'Email from LuminAID',
    emailMessage: data.emailMessage || 'Thank you for your interest in LuminAID.',
    emailBody: simpleContent,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    supportEmail: process.env.SUPPORT_EMAIL || 'support@luminaid.com',
    currentYear: new Date().getFullYear()
  });
};

// Main send email function
const sendEmail = async ({ to, subject, template, data, attachments = [] }) => {
  try {
    const transporter = createTransporter();
    
    // Generate HTML content
    const html = loadTemplate(template, data);

    // Email options
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'LuminAID'} <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments,
    };

    // Log email details for debugging
    logger.info(`Attempting to send email to ${to} with subject: ${subject}`);

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    logger.success(`Email sent to ${to}: ${subject} (${info.messageId})`);
    logger.info(`Email response: ${JSON.stringify(info.response || 'No response')}`);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    logger.error(`Failed to send email to ${to}:`, error.message);
    logger.error(`Error details:`, error);
    return { success: false, error: error.message };
  }
};

// Specific email functions
const emailService = {
  // Welcome email on registration
  sendWelcomeEmail: async (user) => {
    return sendEmail({
      to: user.email,
      subject: 'Welcome to LuminAID!',
      template: 'welcome',
      data: {
        emailHeading: 'Welcome to LuminAID',
        emailMessage: 'Your account has been created successfully.',
        firstName: user.firstName,
        email: user.email,
        shopUrl: `${process.env.FRONTEND_URL}/products`,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@luminaid.com',
      },
    });
  },

  // Email verification
  sendEmailVerification: async (user, verificationToken) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    return sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      template: 'emailVerification',
      data: {
        emailHeading: 'Verify Your Email',
        emailMessage: 'Thank you for signing up with LuminAID.',
        firstName: user.firstName,
        verificationUrl,
        expiresIn: '24 hours',
      },
    });
  },

  // Password reset
  sendPasswordResetEmail: async (user, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    return sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      template: 'passwordReset',
      data: {
        emailHeading: 'Reset Your Password',
        emailMessage: 'We received a request to reset your password for your LuminAID account.',
        firstName: user.firstName,
        resetUrl,
        expiresIn: '1 hour',
      },
    });
  },

  // Password changed confirmation
  sendPasswordChangedEmail: async (user) => {
    return sendEmail({
      to: user.email,
      subject: 'Your Password Has Been Changed',
      template: 'passwordChanged',
      data: {
        emailHeading: 'Password Changed',
        emailMessage: 'Your password has been successfully updated.',
        firstName: user.firstName,
        changeTime: new Date().toLocaleString(),
        supportEmail: process.env.SUPPORT_EMAIL || 'support@luminaid.com',
      },
    });
  },

  // Order confirmation
  sendOrderConfirmation: async (order) => {
    return sendEmail({
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      template: 'orderConfirmation',
      data: {
        emailHeading: 'Thank You for Your Order',
        emailMessage: 'We have received your order and will keep you updated on its progress.',
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.firstName,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        shippingAddress: order.shippingAddress,
        orderDate: new Date(order.createdAt).toLocaleDateString(),
        trackingUrl: `${process.env.FRONTEND_URL}/orders/${order._id}`,
      },
    });
  },

  // Payment pending verification
  sendPaymentPendingEmail: async (order) => {
    return sendEmail({
      to: order.customerEmail,
      subject: `Payment Received - Pending Verification`,
      template: 'paymentPending',
      data: {
        emailHeading: 'Payment Under Review',
        emailMessage: 'We have received your payment and are verifying it.',
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.firstName,
        total: order.total,
        estimatedVerificationTime: '24-48 hours',
      },
    });
  },

  // Payment verified (approved)
  sendPaymentVerifiedEmail: async (order) => {
    return sendEmail({
      to: order.customerEmail,
      subject: `Payment Verified - Order Processing`,
      template: 'paymentVerified',
      data: {
        emailHeading: 'Payment Verified',
        emailMessage: 'Your payment has been successfully verified.',
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.firstName,
        trackingUrl: `${process.env.FRONTEND_URL}/orders/${order._id}`,
      },
    });
  },

  // Payment rejected
  sendPaymentRejectedEmail: async (order, reason) => {
    return sendEmail({
      to: order.customerEmail,
      subject: `Payment Issue - Action Required`,
      template: 'paymentRejected',
      data: {
        emailHeading: 'Payment Verification Issue',
        emailMessage: 'We need your help to resolve a payment issue.',
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.firstName,
        reason: reason,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@luminaid.com',
        total: order.total,
      },
    });
  },

  // Order shipped
  sendOrderShippedEmail: async (order) => {
    return sendEmail({
      to: order.customerEmail,
      subject: `Your Order Has Shipped!`,
      template: 'orderShipped',
      data: {
        emailHeading: 'Order Shipped',
        emailMessage: 'Your order is on its way.',
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.firstName,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        trackingUrl: order.trackingUrl || `${process.env.FRONTEND_URL}/orders/${order._id}`,
        estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : null,
      },
    });
  },

  // Order delivered
  sendOrderDeliveredEmail: async (order) => {
    return sendEmail({
      to: order.customerEmail,
      subject: `Your Order Has Been Delivered!`,
      template: 'orderDelivered',
      data: {
        emailHeading: 'Order Delivered',
        emailMessage: 'Your order has been successfully delivered.',
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.firstName,
        deliveredDate: new Date(order.deliveredAt).toLocaleDateString(),
        reviewUrl: `${process.env.FRONTEND_URL}/orders/${order._id}/review`,
        shopUrl: `${process.env.FRONTEND_URL}/products`,
      },
    });
  },

  // Order cancelled
  sendOrderCancelledEmail: async (order, reason) => {
    return sendEmail({
      to: order.customerEmail,
      subject: `Order Cancelled - ${order.orderNumber}`,
      template: 'orderCancelled',
      data: {
        emailHeading: 'Order Cancelled',
        emailMessage: 'Your order has been cancelled.',
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.firstName,
        reason: reason,
        total: order.total,
        refundInfo: 'Refund will be processed within 5-7 business days',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@luminaid.com',
        shopUrl: `${process.env.FRONTEND_URL}/products`,
      },
    });
  },

  // Support form confirmation
  sendSupportConfirmation: async (contactData) => {
    return sendEmail({
      to: contactData.email,
      subject: `We've Received Your Message`,
      template: 'supportTicket',
      data: {
        emailHeading: 'Message Received',
        emailMessage: 'Thank you for contacting us.',
        name: contactData.name,
        ticketId: contactData.ticketId,
        subject: contactData.subject,
        message: contactData.message,
        responseTime: '24-48 hours',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@luminaid.com',
      },
    });
  },

  // Admin notification for new support ticket
  sendAdminSupportNotification: async (contactData) => {
    return sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.SUPPORT_EMAIL || process.env.SMTP_USER,
      subject: `New Support Ticket: ${contactData.subject}`,
      template: 'adminSupportNotification',
      data: {
        emailHeading: 'New Support Ticket',
        emailMessage: 'A new support ticket has been submitted and requires attention.',
        ticketId: contactData.ticketId,
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
        orderNumber: contactData.orderNumber,
        submittedAt: new Date(contactData.submittedAt).toLocaleString(),
      },
    });
  },

  // Admin notification for payment verification
  sendAdminPaymentNotification: async (order) => {
    return sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `New Payment to Verify - ${order.orderNumber}`,
      template: 'adminPaymentNotification',
      data: {
        emailHeading: 'Payment Verification Required',
        emailMessage: 'A customer has uploaded payment proof and is waiting for verification.',
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        total: order.total,
        paymentScreenshot: order.paymentScreenshot,
        verifyUrl: `${process.env.FRONTEND_URL}/admin/orders/${order._id}`,
        orderDate: new Date(order.createdAt).toLocaleString(),
      },
    });
  },

  // Newsletter subscription confirmation
  sendNewsletterConfirmation: async (email) => {
    return sendEmail({
      to: email,
      subject: 'Welcome to LuminAID Newsletter!',
      template: 'newsletter',
      data: {
        emailHeading: 'Welcome to Our Newsletter',
        emailMessage: 'Thank you for subscribing to the LuminAID newsletter.',
        email: email,
        unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}`,
        shopUrl: `${process.env.FRONTEND_URL}/products`,
      },
    });
  },

  // Test email function
  sendTestEmail: async (to) => {
    return sendEmail({
      to,
      subject: 'LuminAID Email Service Test',
      template: 'test',
      data: {
        emailHeading: 'Email Service Test',
        emailMessage: 'Testing the unified email template system.',
        message: 'Your email service is configured correctly!',
        timestamp: new Date().toISOString(),
      },
    });
  },
};

module.exports = emailService;
