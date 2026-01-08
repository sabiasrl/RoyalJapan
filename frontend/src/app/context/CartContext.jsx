'use client'
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { setupDevUtils } from '@/app/utils/devUtils';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const cartContextRef = useRef(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from localStorage:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const { product_id, user_id, quantity, coupon, price_sell, title, image } = product;
    
    setCartItems((prevItems) => {
      // Check if product already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product_id === product_id && item.user_id === user_id && item.coupon === coupon
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity = parseInt(quantity);
        return updatedItems;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            product_id,
            user_id,
            quantity: parseInt(quantity),
            coupon: coupon || '',
            price_sell,
            title,
            image,
          },
        ];
      }
    });
  };

  const removeFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 10) return; // Minimum quantity is 10
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = parseInt(newQuantity);
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price_sell * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const cartContextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  // Keep ref updated with latest context
  cartContextRef.current = cartContextValue;

  // Setup dev utilities in development mode (only once)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      setupDevUtils(() => cartContextRef.current);
    }
  }, []); // Setup once on mount

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
