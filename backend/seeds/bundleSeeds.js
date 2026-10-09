/**
 * Bundle Products Seed Script
 * Seeds Titan, Solar String Light, and Backyard Bundle products for testing
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB Connected for seeding');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Bundle products data
const bundleProducts = [
  {
    name: 'Titan 4-Pack',
    slug: 'titan-4-pack',
    description: 'For all adventurers: day to night. The Titan is our most popular product: 300 lumens of ultra-bright, inflatable solar light. High efficiency solar power with USB port for keeping your devices charged. Perfect for camping, hiking, and emergency backup use.',
    shortDescription: 'Ultra-bright 300 lumen solar lantern with phone charging capability',
    price: 290.99,
    compareAtPrice: 388.00,
    costPrice: 150.00,
    sku: 'TITAN-4PACK',
    stock: 50,
    lowStockThreshold: 10,
    trackInventory: true,
    category: 'Bundles',
    subCategory: 'Power Lanterns',
    tags: ['titan', 'bundle', 'solar', 'lantern', 'power', 'camping'],
    images: [
      {
        url: '/images/products/0196-150_Max_QI_product_image.jpg',
        altText: 'Titan 4-Pack Solar Lantern Bundle',
        isPrimary: true
      },
      {
        url: '/images/products/0196-150_Max_QI_product_image.jpg',
        altText: 'Titan Lantern Close Up',
        isPrimary: false
      },
      {
        url: '/images/products/0196-150_Max_QI_product_image.jpg',
        altText: 'Titan Lantern In Use',
        isPrimary: false
      },
      {
        url: '/images/products/0196-150_Max_QI_product_image.jpg',
        altText: 'Titan Lantern Features',
        isPrimary: false
      }
    ],
    specifications: [
      { name: 'Brightness', value: '300 lumens' },
      { name: 'Battery Capacity', value: '2000mAh' },
      { name: 'Charge Time', value: '6-8 hours (solar)' },
      { name: 'Run Time', value: '50+ hours on low' },
      { name: 'Weight', value: '5.3 oz' },
      { name: 'Waterproof Rating', value: 'IP67' },
      { name: 'USB Output', value: '5V/1A' }
    ],
    features: [
      '4 x Titan Solar Lanterns',
      '300 lumens maximum brightness',
      'USB phone charging port',
      'Inflatable and packable design',
      'Multiple light modes',
      'Solar powered - no batteries needed',
      'Waterproof and dustproof (IP67)',
      'Collapsible for easy storage'
    ],
    weight: 1.33,
    dimensions: {
      length: 6,
      width: 6,
      height: 6
    },
    freeShipping: true,
    rating: 4.8,
    reviewCount: 127,
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
    badges: [
      {
        text: 'BEST SELLER',
        type: 'bestseller',
        color: '#e53e3e'
      }
    ],
    metaTitle: 'Titan 4-Pack Solar Lantern Bundle | LuminAID',
    metaDescription: 'Get 4 ultra-bright Titan solar lanterns. 300 lumens, phone charging, waterproof. Perfect for camping and emergencies.',
    metaKeywords: ['titan lantern', 'solar lantern', 'camping light', 'emergency light']
  },
  {
    name: 'Solar String Light 4-Pack',
    slug: 'solar-string-light-4-pack',
    description: 'Meet the newest addition to the LuminAID lineup: our solar string light that does triple duty as a 300-lumen lantern and 2000mAh phone charger! With 48 feet of warm white LED bulbs across 4 strings, you can add a magical glow to your tent, RV, backyard, or bedroom. No batteries or outlets needed!',
    shortDescription: 'Solar-powered string lights with 48 feet of warm LED coverage',
    price: 250.00,
    compareAtPrice: 300.00,
    costPrice: 130.00,
    sku: 'STRING-4PACK',
    stock: 75,
    lowStockThreshold: 15,
    trackInventory: true,
    category: 'String Lights',
    subCategory: 'Solar Lights',
    tags: ['string lights', 'solar', 'outdoor', 'camping', 'patio', 'bundle'],
    images: [
      {
        url: '/images/products/StringLightatSunset.jpg',
        altText: 'Solar String Light 4-Pack',
        isPrimary: true
      },
      {
        url: '/images/products/StringLightatSunset.jpg',
        altText: 'String Lights at Night',
        isPrimary: false
      },
      {
        url: '/images/products/StringLightatSunset.jpg',
        altText: 'String Lights in Tent',
        isPrimary: false
      },
      {
        url: '/images/products/StringLightatSunset.jpg',
        altText: 'String Lights Outdoor',
        isPrimary: false
      },
      {
        url: '/images/products/StringLightatSunset.jpg',
        altText: 'String Lights Setup',
        isPrimary: false
      },
      {
        url: '/images/products/StringLightatSunset.jpg',
        altText: 'String Lights Detail',
        isPrimary: false
      }
    ],
    specifications: [
      { name: 'Total Length', value: '48 feet (4 x 12ft strings)' },
      { name: 'LED Count', value: '48 LEDs (12 per string)' },
      { name: 'Light Color', value: 'Warm White' },
      { name: 'Battery Capacity', value: '2000mAh per string' },
      { name: 'Charge Time', value: '6-8 hours (solar)' },
      { name: 'Run Time', value: '8-10 hours' },
      { name: 'Waterproof Rating', value: 'IP67' }
    ],
    features: [
      '4 x Solar String Lights (12 LEDs each)',
      'Total of 48 feet of lighting coverage',
      'Warm white LED color',
      'Weather-resistant design',
      'No batteries or outlets needed',
      'USB charging backup option',
      'Built-in hanging loops',
      'Compact and portable'
    ],
    weight: 2.0,
    dimensions: {
      length: 8,
      width: 6,
      height: 4
    },
    freeShipping: true,
    rating: 4.9,
    reviewCount: 89,
    status: 'active',
    featured: true,
    bestseller: true,
    newArrival: false,
    badges: [
      {
        text: 'BEST SELLER',
        type: 'bestseller',
        color: '#e53e3e'
      }
    ],
    metaTitle: 'Solar String Light 4-Pack | LuminAID',
    metaDescription: '48 feet of solar-powered string lights. Perfect for camping, patios, and outdoor events. Waterproof and easy to use.',
    metaKeywords: ['solar string lights', 'outdoor lights', 'camping lights', 'patio lights']
  },
  {
    name: 'Backyard Bundle',
    slug: 'backyard-bundle',
    description: 'Light up your backyard with this set of our newest products! With over 100 feet of string lights to brighten any space, plus magnetic mini lanterns wherever you need extra light. The Trio lanterns offer three-fold functionality and the string lights create perfect ambiance for outdoor entertaining.',
    shortDescription: 'Complete backyard lighting solution with string lights and magnetic lanterns',
    price: 199.99,
    compareAtPrice: 287.00,
    costPrice: 110.00,
    sku: 'BACKYARD-BUNDLE',
    stock: 40,
    lowStockThreshold: 8,
    trackInventory: true,
    category: 'Bundles',
    subCategory: 'Outdoor Lighting',
    tags: ['backyard', 'bundle', 'string lights', 'lantern', 'outdoor', 'patio'],
    images: [
      {
        url: '/images/products/StringLightatSunset.jpg',
        altText: 'Backyard Bundle',
        isPrimary: true
      },
      {
        url: '/images/products/0196-150_Max_QI_product_image.jpg',
        altText: 'Backyard Bundle Lantern',
        isPrimary: false
      },
      {
        url: '/images/products/StringLightatSunset.jpg',
        altText: 'String Lights in Backyard',
        isPrimary: false
      },
      {
        url: '/images/products/0196-150_Max_QI_product_image.jpg',
        altText: 'Magnetic Lantern Detail',
        isPrimary: false
      }
    ],
    specifications: [
      { name: 'String Light Length', value: '12 feet (warm white)' },
      { name: 'Multi-Color Strings', value: '4 x 12 feet' },
      { name: 'Trio Lanterns', value: '1 magnetic system' },
      { name: 'Total Coverage', value: '60+ feet' },
      { name: 'Waterproof Rating', value: 'IP67' },
      { name: 'Power Source', value: 'Solar + USB backup' }
    ],
    features: [
      '1 x Solar String Light - Warm White',
      '4 x Solar String Light - Multi Color',
      '1 x Trio Magnetic Light System',
      'Over 60 feet of total lighting',
      'Mix and match colors',
      'Magnetic mounting options',
      'Perfect for entertaining',
      'Weatherproof and durable'
    ],
    weight: 3.5,
    dimensions: {
      length: 12,
      width: 10,
      height: 6
    },
    freeShipping: true,
    rating: 4.7,
    reviewCount: 64,
    status: 'active',
    featured: false,
    bestseller: false,
    newArrival: true,
    badges: [
      {
        text: 'NEW',
        type: 'new',
        color: '#38a169'
      }
    ],
    metaTitle: 'Backyard Bundle - String Lights & Lanterns | LuminAID',
    metaDescription: 'Complete backyard lighting package with solar string lights and magnetic lanterns. Perfect for outdoor entertaining.',
    metaKeywords: ['backyard lights', 'outdoor bundle', 'patio lights', 'solar lights']
  }
];

// Seed function
const seedBundles = async () => {
  try {
    console.log('\n🌱 Starting Bundle Products Seeding...\n');

    // Connect to database
    await connectDB();

    // Clear existing bundle products (optional - comment out if you want to keep existing products)
    const deleteResult = await Product.deleteMany({
      slug: { $in: ['titan-4-pack', 'solar-string-light-4-pack', 'backyard-bundle'] }
    });
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing bundle products\n`);

    // Insert bundle products
    const insertedProducts = await Product.insertMany(bundleProducts);
    console.log(`✅ Successfully seeded ${insertedProducts.length} bundle products:\n`);
    
    insertedProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name}`);
      console.log(`      - SKU: ${product.sku}`);
      console.log(`      - Category: ${product.category}`);
      console.log(`      - Price: RS ${product.price}`);
      console.log(`      - Stock: ${product.stock} units`);
      console.log(`      - ID: ${product._id}\n`);
    });

    console.log('✓ Bundle seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Total products seeded: ${insertedProducts.length}`);
    console.log(`   - Titan 4-Pack: Available`);
    console.log(`   - Solar String Light 4-Pack: Available`);
    console.log(`   - Backyard Bundle: Available`);
    console.log('\n🌐 You can now view these products at:');
    console.log('   - http://localhost:5173/bundles/titan');
    console.log('   - http://localhost:5173/bundles/string-lights');
    console.log('   - http://localhost:5173/bundles/backyard');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding bundles:', error);
    process.exit(1);
  }
};

// Run the seed function
seedBundles();
