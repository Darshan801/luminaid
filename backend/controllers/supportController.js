const logger = require('../utils/logger');

// @desc    Submit contact form
// @route   POST /api/support/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, orderNumber } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // In a real application, you would:
    // 1. Send email to support team
    // 2. Store in database for tracking
    // 3. Send confirmation email to customer

    logger.info(`Contact form submitted: ${email} - ${subject}`);

    // Simulate email sending
    const contactData = {
      name,
      email,
      subject,
      message,
      orderNumber: orderNumber || null,
      submittedAt: new Date(),
      status: 'pending'
    };

    res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you within 24-48 hours.',
      data: {
        ticketId: `TICKET-${Date.now()}`,
        email: email
      }
    });

  } catch (error) {
    logger.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form. Please try again later.'
    });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/support/newsletter
// @access  Public
exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // In a real application, you would integrate with:
    // - Mailchimp
    // - SendGrid
    // - ConvertKit
    // etc.

    logger.info(`Newsletter subscription: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: { email }
    });

  } catch (error) {
    logger.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again later.'
    });
  }
};

// @desc    Get shipping information
// @route   GET /api/support/shipping
// @access  Public
exports.getShippingInfo = async (req, res) => {
  try {
    const shippingInfo = {
      domestic: {
        standard: {
          name: 'Standard Shipping',
          cost: 'Free on orders over RS 99',
          deliveryTime: '5-7 business days',
          regions: ['United States']
        },
        express: {
          name: 'Express Shipping',
          cost: 'RS 15',
          deliveryTime: '2-3 business days',
          regions: ['United States']
        }
      },
      international: {
        standard: {
          name: 'International Standard',
          cost: 'RS 25',
          deliveryTime: '10-15 business days',
          regions: ['Canada', 'Europe', 'Asia', 'Australia']
        },
        express: {
          name: 'International Express',
          cost: 'RS 45',
          deliveryTime: '5-7 business days',
          regions: ['Canada', 'Europe', 'Asia', 'Australia']
        }
      },
      policies: [
        'Free shipping on US orders over RS 99',
        'Orders typically ship within 1-2 business days',
        'Tracking information provided for all orders',
        'International orders may be subject to customs fees'
      ]
    };

    res.status(200).json({
      success: true,
      data: shippingInfo
    });

  } catch (error) {
    logger.error('Get shipping info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve shipping information'
    });
  }
};

// @desc    Get return policy
// @route   GET /api/support/returns
// @access  Public
exports.getReturnPolicy = async (req, res) => {
  try {
    const returnPolicy = {
      returnWindow: '100 days',
      warranty: '1 year',
      policies: [
        {
          title: 'Off-Grid Guarantee',
          description: 'We stand behind the quality of our products. If you have a problem within the warranty period, contact our support team.'
        },
        {
          title: '100-Day Return Window',
          description: 'Return unused and unopened products within 100 days for a full refund minus shipping cost.'
        },
        {
          title: 'Exchanges',
          description: 'Contact support@luminaid.com to request exchanges or return authorization.'
        },
        {
          title: 'International Returns',
          description: 'Due to shipping costs, international returns are not accepted unless the product is genuinely defective.'
        }
      ],
      contact: {
        email: 'support@luminaid.com',
        subject: 'Return Request'
      }
    };

    res.status(200).json({
      success: true,
      data: returnPolicy
    });

  } catch (error) {
    logger.error('Get return policy error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve return policy'
    });
  }
};

// @desc    Get product guides
// @route   GET /api/support/guides
// @access  Public
exports.getGuides = async (req, res) => {
  try {
    const guides = [
      {
        id: 1,
        slug: 'packlite-titan',
        title: 'Getting Started: The PackLite Titan',
        description: 'Getting started, learn how to inflate the Titan, buttons and indicator lights, how to recharge the Titan, how to charge a phone. The Titan is compatible with all USB phones with an output cord.',
        category: 'Power Lanterns',
        image: '/images/products/0196-150_Max_QI_product_image.jpg',
        content: [
          {
            section: 'Getting Started',
            steps: [
              'Remove the PackLite Titan from its packaging',
              'Inflate by blowing into the valve',
              'Press the power button to turn on'
            ]
          },
          {
            section: 'Charging',
            steps: [
              'Place in direct sunlight for 14-16 hours for full charge',
              'Or use micro-USB cable to charge from wall outlet (2-3 hours)'
            ]
          }
        ]
      },
      {
        id: 2,
        slug: 'phone-charging',
        title: 'Tips - Phone Charging',
        description: 'How to Charge Your Phone Using a LuminAID 2-in-1 Phone Charger. Plug the USB end of your phone\'s charging cable into the USB charging port on the LuminAID Phone Charger.',
        category: 'Power Lanterns',
        image: '/images/products/0196-150_Max_QI_product_image.jpg'
      },
      {
        id: 3,
        slug: 'bloomio-lights',
        title: 'Getting Started With Your Bloomio Lights',
        description: 'Set Up, Playing Bloom: getting started, turn on Bluetooth on your Lights by pressing and holding the power button for 5 seconds.',
        category: 'String Lights',
        image: '/images/products/StringLightatSunset.jpg'
      },
      {
        id: 4,
        slug: 'bloomio-app',
        title: 'Bloomio Tips - Connecting with the App',
        description: 'Connecting to Bloomio with Its App. To download our app, just search "LuminAID" in the App Store or Google Play.',
        category: 'String Lights',
        image: '/images/products/StringLightatSunset.jpg'
      }
    ];

    const { category } = req.query;
    let filteredGuides = guides;

    if (category) {
      filteredGuides = guides.filter(guide => 
        guide.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: filteredGuides.length,
      data: filteredGuides
    });

  } catch (error) {
    logger.error('Get guides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve guides'
    });
  }
};

// @desc    Get guide by slug
// @route   GET /api/support/guides/:slug
// @access  Public
exports.getGuideBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // This would typically query a database
    const guides = [
      {
        slug: 'packlite-titan',
        title: 'Getting Started: The PackLite Titan',
        description: 'Complete guide for setting up and using your PackLite Titan',
        category: 'Power Lanterns',
        image: '/images/products/0196-150_Max_QI_product_image.jpg',
        content: [
          {
            section: 'Getting Started',
            steps: [
              'Remove the PackLite Titan from its packaging',
              'Inflate by blowing into the valve',
              'Press the power button to turn on'
            ]
          }
        ]
      }
    ];

    const guide = guides.find(g => g.slug === slug);

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    res.status(200).json({
      success: true,
      data: guide
    });

  } catch (error) {
    logger.error('Get guide by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve guide'
    });
  }
};
