// Sample product data
// Real product images from assets/images/products

export const featuredProducts = [
  {
    id: 1,
    name: 'PackLite Max 2-in-1',
    price: 39.95,
    rating: 5,
    reviews: 1250,
    image: '/src/assets/images/products/0196-150_Max_QI_product_image.jpg',
    badge: 'Bestseller'
  },
  {
    id: 2,
    name: 'Titan Power Lantern',
    price: 49.95,
    rating: 5,
    reviews: 890,
    image: '/src/assets/images/products/PLTNRProductImage_sizerelative_withphone_lightgraybackground.jpg',
    badge: 'New'
  },
  {
    id: 3,
    name: 'Solar String Lights',
    price: 34.95,
    rating: 5,
    reviews: 650,
    image: '/src/assets/images/products/StringLightatSunset.jpg',
    badge: null
  },
  {
    id: 4,
    name: 'Survivor Series',
    price: 44.95,
    rating: 5,
    reviews: 520,
    image: '/src/assets/images/products/SurvivorThumbnai.jpg',
    badge: null
  }
];

export const allProducts = [
  ...featuredProducts,
  // Add more products as needed
];
