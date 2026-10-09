const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const donationProducts = [
  {
    name: 'Give Light - RS 10 Donation',
    slug: 'give-light-rs-10',
    sku: 'DON-10',
    description: 'Support communities in need with a RS 10 donation to provide solar lights to those without access to electricity.',
    price: 10,
    compareAtPrice: null,
    category: 'Donation',
    tags: ['donation', 'give-light', 'charity', 'solar-lights'],
    images: [
      {
        url: '/images/about/Give_Light_IMage_600x_600x_ecd10507-0713-4923-8679-9b4659179ffe_600x.jpg',
        alt: 'Give Light Donation Program',
        isPrimary: true
      },
      {
        url: '/images/about/Consumer_Use_Cases_600x_600x_74f78713-261e-4a82-81cc-b35f6283092b_600x.jpg',
        alt: 'LuminAID in action'
      },
      {
        url: '/images/about/Homepage_Our_Founders_1400x.png',
        alt: 'LuminAID Founders'
      }
    ],
    specifications: [
      { name: 'Donation Amount', value: 'RS 10' },
      { name: 'Impact', value: 'Contributes to disaster relief and refugee support' },
      { name: 'Tax Deductible', value: 'Yes (pending nonprofit status)' }
    ],
    features: [
      'Support disaster relief efforts',
      'Provide light to families in need',
      'Help refugee communities',
      '100% goes to providing solar lights'
    ],
    dimensions: null,
    weight: null,
    warranty: null,
    stock: 9999,
    trackInventory: false,
    status: 'active',
    isFeatured: true,
    isDonation: true,
    metaTitle: 'Give Light RS 10 Donation | LuminAID',
    metaDescription: 'Support communities in need with a RS 10 donation to provide solar lights.',
    metaKeywords: ['donation', 'charity', 'solar lights', 'give light']
  },
  {
    name: 'Give Light - RS 20 Donation',
    slug: 'give-light-rs-20',
    sku: 'DON-20',
    description: 'Make a meaningful impact with a RS 20 donation to bring safe, sustainable light to communities around the world.',
    price: 20,
    compareAtPrice: null,
    category: 'Donation',
    tags: ['donation', 'give-light', 'charity', 'solar-lights'],
    images: [
      {
        url: '/images/about/Give_Light_IMage_600x_600x_ecd10507-0713-4923-8679-9b4659179ffe_600x.jpg',
        alt: 'Give Light Donation Program',
        isPrimary: true
      }
    ],
    specifications: [
      { name: 'Donation Amount', value: 'RS 20' },
      { name: 'Impact', value: 'Provides significant support for solar light distribution' },
      { name: 'Tax Deductible', value: 'Yes (pending nonprofit status)' }
    ],
    features: [
      'Support disaster relief efforts',
      'Provide light to families in need',
      'Help refugee communities',
      '100% goes to providing solar lights'
    ],
    stock: 9999,
    trackInventory: false,
    status: 'active',
    isFeatured: true,
    isDonation: true,
    metaTitle: 'Give Light RS 20 Donation | LuminAID',
    metaDescription: 'Make an impact with a RS 20 donation to provide solar lights to those in need.',
    metaKeywords: ['donation', 'charity', 'solar lights', 'give light']
  },
  {
    name: 'Give Light - RS 50 Donation',
    slug: 'give-light-rs-50',
    sku: 'DON-50',
    description: 'Your RS 50 donation helps provide multiple solar lights to families affected by disasters and living in areas without electricity.',
    price: 50,
    compareAtPrice: null,
    category: 'Donation',
    tags: ['donation', 'give-light', 'charity', 'solar-lights'],
    images: [
      {
        url: '/images/about/Give_Light_IMage_600x_600x_ecd10507-0713-4923-8679-9b4659179ffe_600x.jpg',
        alt: 'Give Light Donation Program',
        isPrimary: true
      }
    ],
    specifications: [
      { name: 'Donation Amount', value: 'RS 50' },
      { name: 'Impact', value: 'Helps provide multiple solar lights to families' },
      { name: 'Tax Deductible', value: 'Yes (pending nonprofit status)' }
    ],
    features: [
      'Support disaster relief efforts',
      'Provide light to families in need',
      'Help refugee communities',
      '100% goes to providing solar lights'
    ],
    stock: 9999,
    trackInventory: false,
    status: 'active',
    isFeatured: true,
    isDonation: true,
    metaTitle: 'Give Light RS 50 Donation | LuminAID',
    metaDescription: 'Your RS 50 donation helps provide solar lights to multiple families in need.',
    metaKeywords: ['donation', 'charity', 'solar lights', 'give light']
  },
  {
    name: 'Give Light - RS 100 Donation',
    slug: 'give-light-rs-100',
    sku: 'DON-100',
    description: 'Make a substantial impact with a RS 100 donation. Help us bring safe, sustainable light to communities that need it most.',
    price: 100,
    compareAtPrice: null,
    category: 'Donation',
    tags: ['donation', 'give-light', 'charity', 'solar-lights'],
    images: [
      {
        url: '/images/about/Give_Light_IMage_600x_600x_ecd10507-0713-4923-8679-9b4659179ffe_600x.jpg',
        alt: 'Give Light Donation Program',
        isPrimary: true
      }
    ],
    specifications: [
      { name: 'Donation Amount', value: 'RS 100' },
      { name: 'Impact', value: 'Major contribution to solar light distribution' },
      { name: 'Tax Deductible', value: 'Yes (pending nonprofit status)' }
    ],
    features: [
      'Support disaster relief efforts',
      'Provide light to families in need',
      'Help refugee communities',
      '100% goes to providing solar lights'
    ],
    stock: 9999,
    trackInventory: false,
    status: 'active',
    isFeatured: true,
    isDonation: true,
    metaTitle: 'Give Light RS 100 Donation | LuminAID',
    metaDescription: 'Make a substantial impact with a RS 100 donation to bring light to those in need.',
    metaKeywords: ['donation', 'charity', 'solar lights', 'give light']
  }
];

const seedDonations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Delete existing donation products
    await Product.deleteMany({ isDonation: true });
    console.log('Existing donation products deleted');

    // Insert new donation products
    await Product.insertMany(donationProducts);
    console.log('Donation products seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding donations:', error);
    process.exit(1);
  }
};

seedDonations();
