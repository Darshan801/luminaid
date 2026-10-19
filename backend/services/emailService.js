const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const logger = require('../utils/logger');

// Create reusable transporter
let transporter = null;

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
      logger.info('📧 Email would be sent:', {
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
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
    
    if (!fs.existsSync(templatePath)) {
      logger.warn(`Template not found: ${templateName}, using fallback`);
      return createFallbackTemplate(data);
    }

    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    return template(data);
  } catch (error) {
    logger.error(`Error loading template ${templateName}:`, error);
    return createFallbackTemplate(data);
  }
};

// Fallback template for when HTML template is not found
const createFallbackTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          ${data.content || JSON.stringify(data, null, 2)}
        </div>
      </body>
    </html>
  `;
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

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    logger.success(`Email sent to ${to}: ${subject} (${info.messageId})`);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    logger.error(`Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Specific email functions
const emailService = {
  // Welcome email on registration
  sendWelcomeEmail: async (user) => {
    return sendEmail({
      to: user.email,
      subject: 'Welcome to LuminAID! ☀️',
      template: 'welcome',
      data: {
        firstName: user.firstName,
        email: user.email,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
        shopUrl: `${process.env.FRONTEND_URL}/products`,
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
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.firstName,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        shippingAddress: order.shippingAddress,
        orderDate: order.createdAt,
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
      subject: `Your Order Has Shipped! 📦`,
      template: 'orderShipped',
      data: {
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.firstName,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        trackingUrl: order.trackingUrl || `${process.env.FRONTEND_URL}/orders/${order._id}/tracking`,
        estimatedDelivery: order.estimatedDelivery,
      },
    });
  },

  // Order delivered
  sendOrderDeliveredEmail: async (order) => {
    return sendEmail({
      to: order.customerEmail,
      subject: `Your Order Has Been Delivered! ✨`,
      template: 'orderDelivered',
      data: {
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.firstName,
        deliveredDate: order.deliveredAt,
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
        orderNumber: order.orderNumber,
        customerName: order.shippingAddress.firstName,
        reason: reason,
        total: order.total,
        refundInfo: 'Refund will be processed within 5-7 business days',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@luminaid.com',
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
        ticketId: contactData.ticketId,
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
        orderNumber: contactData.orderNumber,
        submittedAt: contactData.submittedAt,
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
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        total: order.total,
        paymentScreenshot: order.paymentScreenshot,
        verifyUrl: `${process.env.FRONTEND_URL}/admin/orders/${order._id}`,
        orderDate: order.createdAt,
      },
    });
  },

  // Newsletter subscription confirmation
  sendNewsletterConfirmation: async (email) => {
    return sendEmail({
      to: email,
      subject: 'Welcome to LuminAID Newsletter! 🌟',
      template: 'newsletter',
      data: {
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
        message: 'Your email service is configured correctly!',
        timestamp: new Date().toISOString(),
      },
    });
  },
};

module.exports = emailService;
