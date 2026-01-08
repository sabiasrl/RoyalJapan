/**
 * Development utilities for testing
 * These functions can be called from the browser console for testing
 */

import { mockProducts, MOCK_USER_ID, populateCartWithMockProducts } from './mockApi';

/**
 * Setup dev utilities - call this from CartContext
 * Usage: In browser console, type: window.addMockProductsToCart()
 * @param {Function} getCartContext - Function that returns the current cart context
 */
export const setupDevUtils = (getCartContext) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Make mock products available globally for console access
    window.mockProducts = mockProducts;
    window.MOCK_USER_ID = MOCK_USER_ID;
    
    // Function to add mock products to cart
    window.addMockProductsToCart = () => {
      const cartContextValue = getCartContext();
      if (cartContextValue && cartContextValue.addToCart) {
        populateCartWithMockProducts(cartContextValue);
        console.log('✅ Mock products added to cart!');
        // Show cart contents after adding
        setTimeout(() => {
          const cart = JSON.parse(localStorage.getItem('cart') || '[]');
          console.log('Cart items:', cart);
          console.log('Cart count:', cart.length, 'items');
        }, 100);
      } else {
        console.error('❌ Cart context not available. Make sure you are in development mode.');
      }
    };

    // Function to clear cart
    window.clearCart = () => {
      const cartContextValue = getCartContext();
      if (cartContextValue && cartContextValue.clearCart) {
        cartContextValue.clearCart();
        console.log('✅ Cart cleared!');
      } else {
        console.error('❌ Cart context not available');
      }
    };

    // Function to show cart contents
    window.showCart = () => {
      const cartContextValue = getCartContext();
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('Cart items:', cart);
      if (cartContextValue) {
        console.log('Cart count:', cartContextValue.getCartCount());
        console.log('Cart total:', cartContextValue.getCartTotal());
      }
    };

    // Auto-populate cart on first load if cart is empty
    const checkAndPopulateCart = () => {
      try {
        const cartContextValue = getCartContext();
        const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (existingCart.length === 0 && cartContextValue && cartContextValue.addToCart) {
          // Auto-add mock products to cart
          setTimeout(() => {
            const currentContext = getCartContext();
            if (currentContext && currentContext.addToCart) {
              populateCartWithMockProducts(currentContext);
              console.log('✅ Auto-populated cart with mock products!');
            }
          }, 1500); // Small delay to ensure context is ready
        }
      } catch (e) {
        console.log('Could not auto-populate cart:', e);
      }
    };

    // Check and populate on load
    setTimeout(checkAndPopulateCart, 500);

    console.log('🔧 Dev utilities loaded!');
    console.log('Available commands:');
    console.log('  - window.addMockProductsToCart() - Add sample products to cart');
    console.log('  - window.clearCart() - Clear the cart');
    console.log('  - window.showCart() - Show cart contents');
    console.log('  - window.mockProducts - View mock products data');
  }
};
