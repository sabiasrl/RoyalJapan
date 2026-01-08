'use client'
import { CartProvider } from '@/app/context/CartContext';
import { I18nProvider } from '@/app/i18n/I18nContext';

export function Providers({ children }) {
  return (
    <I18nProvider defaultLocale="en">
      <CartProvider>
        {children}
      </CartProvider>
    </I18nProvider>
  );
}
