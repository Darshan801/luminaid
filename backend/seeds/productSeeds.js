const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    name: 'PackLite Titan 2-in-1 Power Lantern',
    slug: 'packlite-titan-power-lantern',
    description: 'The PackLite Titan is our most powerful solar lantern, featuring phone charging capabilities and ultra-bright LED lights. Perfect for camping, emergency preparedness, and outdoor adventures.',
    shortDescription: 'Most popular solar power lantern with phone charging',
    sku: 'PLT-TITAN-001',
    price: 88.00,
    compareAtPrice: 99.00,
    category: 'Power Lanterns',
    subCategory: 'Lanterns',
    tags: ['bestseller', 'camping', 'emergency', 'phone-charger', 'solar'],
    images: [
      {
        url: '/images/products/0196-150_Max_QI_product_image.jpg',
        altText: 'PackLite Titan Power Lantern',
        isPrimary: true
      }
    ],
    specifications: [
      { name: 'Brightness', value: '300 lumens' },
      { name: 'Runtime', value: '50 hours on low' },
      { name: 'Waterproof', value: 'IP67' },
      { name: 'Weight', value: '9.5 oz' },
      { name: 'Battery Capacity', value: '4000mAh' },
      { name: 'Charging Time', value: '7-10 hours solar' },
      { name: 'Dimensions', value: '6" x 6" x 1.5"' }
    ],
    features: [
      'Charges phones and devices',
      'Magnetic mounting',
      '5 brightness settings',
      'Waterproof and dustproof',
      'Integrated solar panel',
      'Collapsible and packable'
    ],
    stock: 50,
    trackInventory: true,
    status: 'active',
    featured: true,
    bestseller: true,
    rating: 4.8,
    reviewCount: 1247
  },
  {
    name: 'PackLite Survivor 3-in-1 Power Lantern',
    slug: 'packlite-survivor-power-lantern',
    description: 'Built for the most demanding situations, the Survivor features twist-to-inflate technology, red night vision mode, and powerful phone charging. Essential for serious outdoor enthusiasts and emergency kits.',
    shortDescription: 'Rugged power lantern with red night vision mode',
    sku: 'PLT-SURV-001',
    price: 115.00,
    compareAtPrice: 125.00,
    category: 'Power Lanterns',
    subCategory: 'Lanterns',
    tags: ['new', 'camping', 'emergency', 'phone-charger', 'solar', 'red-light'],
    images: [
      {
        url: '/images/products/SurvivorThumbnai.jpg',
        altText: 'PackLite Survivor Power Lantern',
        isPrimary: true
      }
    ],
    specifications: [
      { name: 'Brightness', value: '350 lumens (white), 50 lumens (red)' },
      { name: 'Runtime', value: '100 hours on low' },
      { name: 'Waterproof', value: 'IP67' },
      { name: 'Weight', value: '11 oz' },
      { name: 'Battery Capacity', value: '6000mAh' },
      { name: 'Charging Time', value: '10-14 hours solar' },
      { name: 'Dimensions', value: '7" x 7" x 1.75"' }
    ],
    features: [
      'Charges phones and tablets',
      'Red night vision mode',
      'Twist-to-inflate design',
      'Emergency SOS mode',
      'Heavy-duty solar panel',
      'Floats in water'
    ],
    stock: 35,
    trackInventory: true,
    status: 'active',
    featured: true,
    bestseller: false,
    rating: 4.9,
    reviewCount: 523
  },
  {
    name: 'Solar String Light',
    slug: 'solar-string-light',
    description: 'Create ambiance anywhere with our solar-powered string lights. Features 10 inflatable LED cubes that provide warm, welcoming light for patios, camping, or special events.',
    shortDescription: 'Portable solar string lights with warm glow',
    sku: 'SSL-001',
    price: 75.00,
    compareAtPrice: 85.00,
    category: 'String Lights',
    subCategory: 'Decorative',
    tags: ['new', 'gifting', 'home-garden', 'decorative', 'solar'],
    images: [
      {
        url: '/images/products/StringLightatSunset.jpg',
        altText: 'Solar String Light',
        isPrimary: true
      }
    ],
    specifications: [
      { name: 'Brightness', value: '75 lumens total' },
      { name: 'Runtime', value: '6-8 hours' },
      { name: 'Waterproof', value: 'IP65' },
      { name: 'Weight', value: '14 oz' },
      { name: 'Length', value: '15 feet' },
      { name: 'Charging Time', value: '6-8 hours solar' },
      { name: 'Bulbs', value: '10 LED cubes' }
    ],
    features: [
      'Twist-to-inflate cubes',
      'Warm white and multi-color modes',
      'Portable and packable',
      'Weather resistant',
      'No outlet needed',
      'Perfect for parties and camping'
    ],
    stock: 60,
    trackInventory: true,
    status: 'active',
    featured: true,
    bestseller: false,
    rating: 4.7,
    reviewCount: 892
  },
  {
    name: 'PackLite Max 2-in-1 Power Lantern',
    slug: 'packlite-max-power-lantern',
    description: 'Compact yet powerful, the PackLite Max offers excellent brightness and phone charging in a budget-friendly package. Great for everyday emergencies and weekend camping trips.',
    shortDescription: 'Affordable power lantern with essential features',
    sku: 'PLT-MAX-001',
    price: 60.00,
    compareAtPrice: 70.00,
    category: 'Power Lanterns',
    subCategory: 'Lanterns',
    tags: ['camping', 'emergency', 'phone-charger', 'solar', 'budget'],
    images: [
      {
        url: '/images/products/0196-150_Max_QI_product_image.jpg',
        altText: 'PackLite Max Power Lantern',
        isPrimary: true
      }
    ],
    specifications: [
      { name: 'Brightness', value: '150 lumens' },
      { name: 'Runtime', value: '40 hours on low' },
      { name: 'Waterproof', value: 'IP67' },
      { name: 'Weight', value: '7 oz' },
      { name: 'Battery Capacity', value: '2000mAh' },
      { name: 'Charging Time', value: '5-7 hours solar' },
      { name: 'Dimensions', value: '5" x 5" x 1.25"' }
    ],
    features: [
      'Charges phones',
      'Magnetic mounting',
      '3 brightness settings',
      'Waterproof',
      'Integrated solar panel',
      'Ultra-compact'
    ],
    stock: 75,
    trackInventory: true,
    status: 'active',
    featured: true,
    bestseller: true,
    rating: 4.6,
    reviewCount: 2104
  },
  {
    name: 'PackLite Nova Solar Lantern',
    slug: 'packlite-nova-solar-lantern',
    description: 'Fun and functional, the Nova features multiple color modes making it perfect for kids, festivals, and adding ambiance to any adventure. Lightweight and easy to use.',
    shortDescription: 'Multi-color solar lantern perfect for kids',
    sku: 'PLT-NOVA-001',
    price: 33.00,
    compareAtPrice: 40.00,
    category: 'Gifts',
    subCategory: 'Lanterns',
    tags: ['gifting', 'kids', 'travel', 'solar', 'colorful'],
    images: [
      {
        url: '/images/products/Trio_Circle.png',
        altText: 'PackLite Nova Solar Lantern',
        isPrimary: true
      }
    ],
    specifications: [
      { name: 'Brightness', value: '75 lumens' },
      { name: 'Runtime', value: '24 hours on low' },
      { name: 'Waterproof', value: 'IP67' },
      { name: 'Weight', value: '3 oz' },
      { name: 'Battery Capacity', value: '1000mAh' },
      { name: 'Charging Time', value: '4-6 hours solar' },
      { name: 'Dimensions', value: '4.5" x 4.5" x 1"' }
    ],
    features: [
      'Multi-color LED options',
      'Ultra-lightweight',
      'Inflatable design',
      'Kid-friendly',
      'Perfect for travel',
      'Long battery life'
    ],
    stock: 100,
    trackInventory: true,
    status: 'active',
    featured: false,
    bestseller: false,
    rating: 4.5,
    reviewCount: 687
  },
  {
    name: 'LuminAID Accessories Bundle',
    slug: 'luminaid-accessories-bundle',
    description: 'Complete accessory kit including carabiners, charging cables, storage pouches, and mounting accessories. Everything you need to get the most out of your LuminAID products.',
    shortDescription: 'Essential accessories for your solar gear',
    sku: 'ACC-BUNDLE-001',
    price: 29.99,
    compareAtPrice: 39.99,
    category: 'Accessories',
    subCategory: 'Bundles',
    tags: ['accessories', 'bundle', 'value'],
    images: [
      {
        url: '/images/products/Accessories.jpg',
        altText: 'LuminAID Accessories Bundle',
        isPrimary: true
      }
    ],
    specifications: [
      { name: 'Included', value: '4 carabiners, 2 USB cables, 2 storage pouches, 1 mounting strap' },
      { name: 'Weight', value: '6 oz' },
      { name: 'Compatibility', value: 'All LuminAID products' }
    ],
    features: [
      'Premium carabiners',
      'Fast-charging USB cables',
      'Water-resistant pouches',
      'Adjustable mounting strap',
      'Great value bundle'
    ],
    stock: 150,
    trackInventory: true,
    status: 'active',
    featured: false,
    bestseller: false,
    rating: 4.4,
    reviewCount: 234
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');

    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created successfully!`);

    // Display created products
    createdProducts.forEach(product => {
      console.log(`- ${product.name} (${product.sku}) - $${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

// Run seeder
seedProducts();
