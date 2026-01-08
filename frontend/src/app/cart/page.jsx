'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useI18n } from '@/app/i18n/I18nContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Sitemap from '@/app/components/Sitemap';
import axios from 'axios';
import '@/app/styles/productCards.css';

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CartPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [couponDiscounts, setCouponDiscounts] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch coupon discounts for each item
  useEffect(() => {
    const fetchCouponDiscounts = async () => {
      const discounts = {};
      for (const item of cartItems) {
        if (item.coupon) {
          try {
            const data = JSON.stringify({
              user: item.user_id,
              coupon: item.coupon,
            });
            const config = {
              method: 'post',
              url: `${baseurl}/api/coupon`,
              headers: {
                'Content-Type': 'application/json',
              },
              data: data,
            };
            const response = await axios(config);
            discounts[item.product_id] = response.data.percent || 0;
          } catch (err) {
            console.error('Error fetching coupon:', err);
          }
        }
      }
      setCouponDiscounts(discounts);
    };

    if (cartItems.length > 0) {
      fetchCouponDiscounts();
    }
  }, [cartItems]);

  const calculateItemTotal = (item) => {
    const discount = couponDiscounts[item.product_id] || 0;
    const priceAfterDiscount = item.price_sell * (1 - discount / 100);
    return priceAfterDiscount * item.quantity;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // For now, redirect to order page with first item
    // In a full implementation, you'd create a multi-item checkout
    const firstItem = cartItems[0];
    router.push(`/order/${firstItem.user_id}/${firstItem.product_id}/${firstItem.coupon}?count=${firstItem.quantity}`);
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="product" style={{ paddingTop: '120px' }}>
          <section className="list">
            <div className="list-title">{t('cart.title')}</div>
            <div className="contain">
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <p style={{ fontSize: '18px', marginBottom: '20px' }}>{t('cart.empty')}</p>
                <a
                  onClick={() => {
                    const userID = localStorage.getItem('userID');
                    if (userID) {
                      router.push(`/${userID}`);
                    } else {
                      router.push('/');
                    }
                  }}
                  className="site-link"
                  style={{ cursor: 'pointer', display: 'inline-block' }}
                >
                  <p>{t('cart.viewProducts')}</p>
                  <span></span>
                </a>
              </div>
            </div>
          </section>
        </div>
        <Footer />
        <Sitemap />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="product" style={{ paddingTop: '120px' }}>
        <section className="list">
          <div className="list-title">{t('cart.title')}</div>
          <div className="contain">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              {cartItems.map((item, index) => {
                const discount = couponDiscounts[item.product_id] || 0;
                const priceAfterDiscount = item.price_sell * (1 - discount / 100);
                const itemTotal = priceAfterDiscount * item.quantity;

                return (
                  <div
                    key={index}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '20px',
                      display: 'flex',
                      gap: '20px',
                    }}
                  >
                    <div className="cart-item-image-container" style={{ flex: '0 0 180px', minHeight: '180px' }}>
                      <img
                        src={item.image || '/assets/images/producta.png'}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/assets/images/producta.png';
                        }}
                      />
                    </div>
                    <div style={{ flex: '1' }}>
                      <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>{item.title}</h3>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ marginRight: '10px' }}>{t('common.quantity')}:</label>
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(index, e.target.value)}
                          style={{
                            padding: '5px 10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={15}>15</option>
                          <option value={20}>20</option>
                          <option value={25}>25</option>
                          <option value={30}>30</option>
                        </select>
                      </div>
                      {item.coupon && (
                        <div style={{ marginBottom: '10px', color: '#8F121A' }}>
                          {t('cart.coupon')}: {item.coupon} ({discount}% {t('cart.discount')})
                        </div>
                      )}
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {discount > 0 && (
                          <span
                            style={{
                              textDecoration: 'line-through',
                              color: '#999',
                              marginRight: '10px',
                            }}
                          >
                            {parseInt(item.price_sell * item.quantity).toLocaleString('en-US')}{t('common.yen')}
                          </span>
                        )}
                        {parseInt(itemTotal).toLocaleString('en-US')}{t('common.yen')}
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        style={{
                          marginTop: '10px',
                          padding: '5px 15px',
                          background: '#8F121A',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        {t('common.remove')}
                      </button>
                    </div>
                  </div>
                );
              })}

              <div
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  marginTop: '30px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{t('common.total')}:</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8F121A' }}>
                    {parseInt(calculateTotal()).toLocaleString('en-US')}{t('common.yen')}
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="site-link"
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  <p>{t('cart.proceedToCheckout')}</p>
                  <span></span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <Sitemap />
    </>
  );
}
