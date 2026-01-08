/**
 * Mock API for development and testing
 * Use this when the backend API is not available
 */

// Mock user ID for testing
export const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

// Mock products data
export const mockProducts = [
  {
    id: 1,
    seller: MOCK_USER_ID,
    title: 'Royal Honey Premium',
    description: 'Premium quality royal honey with natural ingredients. Perfect for enhancing your daily wellness routine.',
    price_origin: 5000,
    price_sell: 9800,
    price_id: 'price_mock_1',
    product_id: 'prod_mock_1',
    image: '/assets/images/producta.png',
    image1: '/assets/images/producta.png',
    image2: '/assets/images/productb.png',
    image3: '/assets/images/productc.png',
    package: '30 capsules',
    sold_count: 150,
  },
  {
    id: 2,
    seller: MOCK_USER_ID,
    title: 'Tongkat Ali Extract',
    description: 'Pure Tongkat Ali extract with 7 natural ingredients. Manufactured in Malaysia with authentic Royal Honey.',
    price_origin: 6000,
    price_sell: 12000,
    price_id: 'price_mock_2',
    product_id: 'prod_mock_2',
    image: '/assets/images/productb.png',
    image1: '/assets/images/productb.png',
    image2: '/assets/images/productc.png',
    image3: '/assets/images/productd.png',
    package: '60 capsules',
    sold_count: 89,
  },
  {
    id: 3,
    seller: MOCK_USER_ID,
    title: 'Royal Honey Deluxe',
    description: 'Deluxe edition royal honey with enhanced formula. For harmonious couples and enhanced nightlife.',
    price_origin: 7000,
    price_sell: 15000,
    price_id: 'price_mock_3',
    product_id: 'prod_mock_3',
    image: '/assets/images/productc.png',
    image1: '/assets/images/productc.png',
    image2: '/assets/images/productd.png',
    image3: '/assets/images/producte.png',
    package: '90 capsules',
    sold_count: 234,
  },
];

// Mock API functions
export const mockApi = {
  getUserProducts: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            products: mockProducts,
            status_code: 200,
          },
        });
      }, 500); // Simulate network delay
    });
  },

  getProduct: (productId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockProducts.find((p) => p.id === parseInt(productId));
        if (product) {
          resolve({
            data: {
              price_sell: product.price_sell,
              price_id: product.price_id,
              description: product.description,
              title: product.title,
              image: product.image,
              image1: product.image1,
              image2: product.image2,
              image3: product.image3,
              package: product.package,
              product_id: product.product_id,
              status_code: 200,
            },
          });
        } else {
          reject({ message: 'Product not found' });
        }
      }, 300);
    });
  },

  validateCoupon: (userId, couponCode) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock coupon validation - return 10% discount for any code starting with "TEST"
        const percent = couponCode && couponCode.startsWith('TEST') ? 10 : 0;
        resolve({
          data: {
            percent,
            status_code: 200,
          },
        });
      }, 200);
    });
  },

  createPaymentIntent: (productId, couponCode, count, userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find the product
        const product = mockProducts.find(p => p.id === parseInt(productId)) || mockProducts[0];
        let totalAmount = product.price_sell * parseInt(count);
        
        // Apply coupon discount if exists
        if (couponCode && couponCode.startsWith('TEST')) {
          totalAmount = totalAmount * 0.9; // 10% discount
        }
        
        // Return mock response (but frontend will use MockPaymentForm instead)
        // This is kept for API compatibility but won't be used with Stripe Elements
        resolve({
          data: {
            mockMode: true,
            amount: totalAmount,
            status_code: 200,
          },
        });
      }, 500);
    });
  },

  completePayment: (paymentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock successful payment completion
        resolve({
          data: {
            success: true,
            status_code: 200,
            message: 'Payment completed successfully',
          },
        });
      }, 500);
    });
  },

  createCryptoPayment: (productId, couponCode, count, userId, cryptoType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find the product
        const product = mockProducts.find(p => p.id === parseInt(productId)) || mockProducts[0];
        let totalAmount = product.price_sell * parseInt(count);
        
        // Apply coupon discount if exists
        if (couponCode && couponCode.startsWith('TEST')) {
          totalAmount = totalAmount * 0.9; // 10% discount
        }
        
        // Mock exchange rates
        const exchangeRates = {
          bitcoin: 0.000015,
          ethereum: 0.000025,
          usdt: 0.0067,
        };
        
        const rate = exchangeRates[cryptoType] || 0.000015;
        const cryptoAmount = (totalAmount * rate).toFixed(8);
        
        // Generate mock wallet address
        const prefixes = {
          bitcoin: 'bc1',
          ethereum: '0x',
          usdt: '0x',
        };
        const prefix = prefixes[cryptoType] || '0x';
        const random = Math.random().toString(36).substring(2, 34);
        const walletAddress = prefix + random;
        
        resolve({
          data: {
            walletAddress,
            cryptoAmount,
            jpyAmount: totalAmount,
            cryptoType,
            status_code: 200,
          },
        });
      }, 300);
    });
  },

  verifyCryptoTransaction: (transactionHash, cryptoType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock transaction verification
        // In a real app, this would check the blockchain
        const isValid = transactionHash && transactionHash.length >= 10;
        
        resolve({
          data: {
            verified: isValid,
            status_code: 200,
            message: isValid ? 'Transaction verified' : 'Invalid transaction hash',
          },
        });
      }, 1000);
    });
  },
};

// Helper function to populate cart with sample products
export const populateCartWithMockProducts = (cartContext) => {
  const { addToCart } = cartContext;
  
  // Add first product
  addToCart({
    product_id: mockProducts[0].id,
    user_id: MOCK_USER_ID,
    quantity: 10,
    coupon: '',
    price_sell: mockProducts[0].price_sell,
    title: mockProducts[0].title,
    image: mockProducts[0].image,
  });

  // Add second product with coupon
  addToCart({
    product_id: mockProducts[1].id,
    user_id: MOCK_USER_ID,
    quantity: 15,
    coupon: 'TEST123',
    price_sell: mockProducts[1].price_sell,
    title: mockProducts[1].title,
    image: mockProducts[1].image,
  });

  console.log('✅ Mock products added to cart!');
};
