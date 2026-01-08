'use client'
// import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {loadStripe} from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe('pk_test_51PvaMkKQfMI1g1n87ugCQsYOo89kYseL4FdkLHSaajuNu1nCrcSJJE0nWoxEDkbQp3wo8m8meUn0NlIfbhUv07YG00Lp2SEk4U');
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import Sitemap from '@/app/components/Sitemap';
import Detail from '@/app/components/Detail';
import axios from 'axios';
import {useParams, useSearchParams} from "next/navigation";
import { useI18n } from '@/app/i18n/I18nContext';
import { mockApi } from '@/app/utils/mockApi';
import '@/app/styles/paymentMethods.css';
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Mock Payment Form Component (for testing without real Stripe)
function MockPaymentForm({ onSuccess, name, email, amount }) {
    const { t } = useI18n();
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setErrorMessage('');

        // Simulate payment processing
        setTimeout(() => {
            // Validate mock card (accept any card for testing)
            if (cardNumber.length >= 13 && expiry.length >= 5 && cvc.length >= 3) {
                // Simulate successful payment
                setIsProcessing(false);
                onSuccess();
            } else {
                setErrorMessage(t('order.paymentError'));
                setIsProcessing(false);
            }
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
            <div style={{marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd'}}>
                <div style={{marginBottom: '15px'}}>
                    <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold'}}>
                        {t('order.cardNumber')}
                    </label>
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                        placeholder="4242 4242 4242 4242"
                        maxLength="19"
                        style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px'}}
                        required
                    />
                </div>
                <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
                    <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold'}}>
                            {t('order.expiryDate')}
                        </label>
                        <input
                            type="text"
                            value={expiry}
                            onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, '');
                                if (val.length >= 2) {
                                    val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                }
                                setExpiry(val);
                            }}
                            placeholder="MM/YY"
                            maxLength="5"
                            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px'}}
                            required
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold'}}>
                            {t('order.cvc')}
                        </label>
                        <input
                            type="text"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                            placeholder="123"
                            maxLength="4"
                            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px'}}
                            required
                        />
                    </div>
                </div>
                <div style={{padding: '10px', background: '#fff3cd', borderRadius: '4px', fontSize: '12px', color: '#856404'}}>
                    {t('order.mockPaymentNote')}
                </div>
            </div>
            {errorMessage && (
                <div style={{color: 'red', marginBottom: '15px', fontSize: '14px'}}>
                    {errorMessage}
                </div>
            )}
            <button 
                type="submit" 
                disabled={isProcessing}
                className="form-btn"
                style={{opacity: isProcessing ? 0.6 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer'}}
            >
                <p>{isProcessing ? t('order.processing') : t('order.payNow')}</p>
                <span></span>
            </button>
        </form>
    );
}

// Stripe Checkout Form Component (for real Stripe integration)
function StripeCheckoutForm({ onSuccess, name, email }) {
    const stripe = useStripe();
    const elements = useElements();
    const { t } = useI18n();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.href,
                    payment_method_data: {
                        billing_details: {
                            name: name,
                            email: email,
                        },
                    },
                },
                redirect: 'if_required',
            });

            if (error) {
                setErrorMessage(error.message || t('order.paymentError'));
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                onSuccess();
            } else {
                setIsProcessing(false);
            }
        } catch (err) {
            console.error('Payment error:', err);
            setErrorMessage(t('order.paymentError'));
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
            <div style={{marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
                <PaymentElement />
            </div>
            {errorMessage && (
                <div style={{color: 'red', marginBottom: '15px', fontSize: '14px'}}>
                    {errorMessage}
                </div>
            )}
            <button 
                type="submit" 
                disabled={!stripe || isProcessing}
                className="form-btn"
                style={{opacity: (!stripe || isProcessing) ? 0.6 : 1, cursor: (!stripe || isProcessing) ? 'not-allowed' : 'pointer'}}
            >
                <p>{isProcessing ? t('order.processing') : t('order.payNow')}</p>
                <span></span>
            </button>
        </form>
    );
}

// Cryptocurrency Payment Form Component
function CryptoPaymentForm({ onSuccess, amount, cryptoType }) {
    const { t } = useI18n();
    const [isProcessing, setIsProcessing] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [cryptoAmount, setCryptoAmount] = useState(0);

    // Mock exchange rates (in a real app, these would come from an API)
    const exchangeRates = {
        bitcoin: 0.000015, // 1 JPY = 0.000015 BTC (example rate)
        ethereum: 0.000025, // 1 JPY = 0.000025 ETH
        usdt: 0.0067, // 1 JPY = 0.0067 USDT
    };

    useEffect(() => {
        // Calculate crypto amount based on JPY price
        const rate = exchangeRates[cryptoType] || 0.000015;
        const calculatedAmount = (amount * rate).toFixed(8);
        setCryptoAmount(calculatedAmount);
        
        // Generate mock wallet address
        const mockAddress = generateMockAddress(cryptoType);
        setWalletAddress(mockAddress);
    }, [amount, cryptoType]);

    const generateMockAddress = (type) => {
        const prefixes = {
            bitcoin: 'bc1',
            ethereum: '0x',
            usdt: '0x', // USDT on Ethereum
        };
        const prefix = prefixes[type] || '0x';
        const random = Math.random().toString(36).substring(2, 34);
        return prefix + random;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!transactionHash || transactionHash.length < 10) {
            setErrorMessage(t('order.cryptoTransactionRequired'));
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        // Simulate payment verification
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 2000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert(t('order.copied'));
    };

    return (
        <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
            <div style={{marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd'}}>
                <div style={{marginBottom: '20px', textAlign: 'center'}}>
                    <h3 style={{marginBottom: '10px', fontSize: '18px', fontWeight: 'bold'}}>
                        {t(`order.crypto.${cryptoType}.title`)}
                    </h3>
                    <div style={{fontSize: '24px', fontWeight: 'bold', color: '#8F121A', marginBottom: '5px'}}>
                        {cryptoAmount} {t(`order.crypto.${cryptoType}.symbol`)}
                    </div>
                    <div style={{fontSize: '14px', color: '#666'}}>
                        ≈ {parseInt(amount).toLocaleString('en-US')} {t('common.yen')}
                    </div>
                </div>

                <div style={{marginBottom: '20px'}}>
                    <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold'}}>
                        {t('order.crypto.walletAddress')}
                    </label>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <input
                            type="text"
                            value={walletAddress}
                            readOnly
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                background: '#fff'
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => copyToClipboard(walletAddress)}
                            style={{
                                padding: '10px 15px',
                                background: '#8F121A',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            {t('order.copy')}
                        </button>
                    </div>
                </div>

                <div style={{marginBottom: '20px', textAlign: 'center'}}>
                    <div style={{
                        width: '200px',
                        height: '200px',
                        margin: '0 auto',
                        background: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: '#999'
                    }}>
                        {t('order.crypto.qrCode')}
                    </div>
                </div>

                <div style={{marginBottom: '20px', padding: '15px', background: '#fff3cd', borderRadius: '4px', fontSize: '12px', color: '#856404'}}>
                    <strong>{t('order.crypto.instructions')}</strong>
                    <ol style={{marginTop: '10px', paddingLeft: '20px'}}>
                        <li>{t('order.crypto.step1')}</li>
                        <li>{t('order.crypto.step2')}</li>
                        <li>{t('order.crypto.step3')}</li>
                        <li>{t('order.crypto.step4')}</li>
                    </ol>
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold'}}>
                        {t('order.crypto.transactionHash')}
                    </label>
                    <input
                        type="text"
                        value={transactionHash}
                        onChange={(e) => setTransactionHash(e.target.value)}
                        placeholder={t('order.crypto.transactionHashPlaceholder')}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontFamily: 'monospace'
                        }}
                        required
                    />
                </div>

                {errorMessage && (
                    <div style={{color: 'red', marginBottom: '15px', fontSize: '14px'}}>
                        {errorMessage}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isProcessing || !transactionHash}
                    className="form-btn"
                    style={{
                        opacity: (isProcessing || !transactionHash) ? 0.6 : 1,
                        cursor: (isProcessing || !transactionHash) ? 'not-allowed' : 'pointer',
                        width: '100%'
                    }}
                >
                    <p>{isProcessing ? t('order.verifying') : t('order.confirmPayment')}</p>
                    <span></span>
                </button>
            </div>
        </form>
    );
}

function Order({}) {

    const searchParams = useSearchParams();
    const { t } = useI18n();

    // const [searchParams, setSearchParams] = useSearchParams();
    let searchParamCount = searchParams?.get("count")
    const [count, setCount] = useState(searchParamCount);
    // const [trigger, setTrigger] = useState(0);
    const {user_id, product_id, coupon } = useParams()
    const [tab, setTab] = useState(1)
    const [name, setName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("bank"); // "bank", "stripe", "bitcoin", "ethereum", "usdt"
    const [cryptoType, setCryptoType] = useState("bitcoin");
    const [loading, setLoading] = useState(false);
    const [isMockMode, setIsMockMode] = useState(false);
    const [price, setPrice] = useState(0);

    // Create payment intent when moving to tab 2 with Stripe selected
    useEffect(() => {
        if (tab === 2 && paymentMethod === "stripe" && !clientSecret && price > 0 && product_id) {
            createPaymentIntent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab, paymentMethod]);

    const createPaymentIntent = async () => {
        setLoading(true);
        try {
            let data = JSON.stringify({
                "product": product_id,
                'coupon': coupon ? coupon : "",
                'count': count
            });
            let config = {
                method: 'post',
                url: `${baseurl}/api/create-payment-intent`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            
            const response = await axios(config);
            // Check if client secret is valid Stripe format
            if (response.data.clientSecret && response.data.clientSecret.includes('_secret_') && !response.data.clientSecret.includes('mock')) {
                setClientSecret(response.data.clientSecret);
                setIsMockMode(false);
            } else {
                throw new Error('Invalid client secret format');
            }
        } catch (err) {
            console.log('API failed, using mock payment mode');
            // Use mock mode instead of trying to create fake Stripe client secret
            setIsMockMode(true);
            setClientSecret(''); // Don't set a fake client secret
        } finally {
            setLoading(false);
        }
    };

    const handleClick = async () => {
        if(tab==1){

            if(name=="" || email==""){
                return
            }
            // else{
            //     localStorage.setItem("customerData", JSON.stringify({
            //         count:count,
            //         name:name,
            //         email:email,
            //         phone:phone,
            //         address:address,
            //         address1:address1
            //     }))
            // }
            setTab(2)
        }
        if(tab==2){
            if (paymentMethod === "stripe") {
                // Stripe payment will be handled by CheckoutForm component
                return;
            } else if (paymentMethod === "bitcoin" || paymentMethod === "ethereum" || paymentMethod === "usdt") {
                // Cryptocurrency payment will be handled by CryptoPaymentForm component
                return;
            } else {
                // Bank transfer - proceed to completion
                await completeOrder();
            }
        }
    }

    const completeOrder = async () => {
        setLoading(true);
        try {
            let data = JSON.stringify({
                "product":product_id,
                'user':user_id,
                'coupon':coupon ? coupon : "",
                'count':count,
                'email':email,
                'name':name,
                'phone':phone,
                'address':address,
                'address1':address1
            });
            let config = {
                method: 'post',
                url: `${baseurl}/api/sold`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data : data,
            };
            await axios(config);
            setTab(3);
        } catch (err) {
            console.error('API failed, using mock completion');
            // Fallback to mock API
            try {
                await mockApi.completePayment({
                    product: product_id,
                    user: user_id,
                    coupon: coupon || '',
                    count: count,
                    email: email,
                    name: name,
                    phone: phone,
                    address: address,
                    address1: address1
                });
                setTab(3);
            } catch (mockErr) {
                console.error('Mock completion failed:', mockErr);
                // Still proceed to completion for demo purposes
                setTab(3);
            }
        } finally {
            setLoading(false);
        }
    }

    // const createPaymentIntent =  (priceId) => {
    //     let data = JSON.stringify({
    //         "product":product_id,
    //         'coupon':coupon ? coupon : "",
    //         'count':count
    //     });
    //     let config = {
    //         method: 'post',
    //         url: `${baseurl}/api/create-payment-intent`,
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         data : data
    //     };
    //     axios(config)
    //     .then(async (response) => {
    //         setOption({...option, clientSecret:response.data.clientSecret})
    //         setTab(2)
    //     })
    //     .catch((err)=>{
    //     })
    // };

    // useEffect(() => {
    //     const clientSecret = new URLSearchParams(window.location.search).get(
    //         'payment_intent_client_secret'
    //     );
    //     const redirect_status = new URLSearchParams(window.location.search).get(
    //         'redirect_status'
    //     );
    //     if(redirect_status=="succeeded"){

    //         var customer_data =  JSON.parse(localStorage.getItem("customerData")) || null;
    //         if(customer_data){
    //             setCount(customer_data.count)
    //             let data = JSON.stringify({
    //                 "product":product_id,
    //                 'user':user_id,
    //                 'coupon':coupon ? coupon : "",
    //                 "name":customer_data.name,
    //                 "email":customer_data.email,
    //                 'count':customer_data.count,
    //                 "phone":customer_data.phone,
    //                 "address":customer_data.address,
    //                 "address1":customer_data.address1,
    //             });
    //             let config = {
    //                 method: 'post',
    //                 url: `${baseurl}/api/sold`,
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                     data : data,
    //             };
    //             axios(config)
    //             .then(async (response) => {
    //                 setTab(3)
    //             })
    //             .catch((err)=>{
    //             })
    //         }
    //     }

    // },[])

    return(
        <>
            <Header/>
            <div className="product" id="order" style={{ paddingTop: '120px' }}>
                <section className="top pc">
                    <div className="top-img">
                        <img src="/assets/images/top-img.png" alt=""/>
                        <img src="/assets/images/top-img02.png" className="sp" alt=""/>
                    </div>
                    <img src="/assets/images/logo.svg" alt=""/>
                    <p className="top-text1">{t('productDetail.royalJapan')}<br/>{t('productDetail.officialOnline')}</p>
                    <p className="top-text2">{t('productDetail.tagline1')}</p>
                    <p className="top-text3">{t('productDetail.tagline2')}</p>
                </section>
                <section className="order">
                    <div className="contain">
                        {tab!==3 && <Detail id={product_id} coupon={coupon} user={user_id} count={count} setPrice={setPrice}/>}
                        <div className="order-form">
                            {tab==1 && <div className="form-notice">{t('order.enterCustomerInfo')}</div>}
                            <div className="form-step">
                                <div className={`form-step-part ${tab==1?"active":""}`}>
                                    <div className="form-step-part-number">
                                        1
                                    </div>
                                    <div className="form-step-part-title">
                                        {t('order.customerInfo')}
                                    </div>
                                </div>
                                <div className={`form-step-part ${tab==2?"active":""}`}>
                                    <div className="form-step-part-number">
                                        2
                                    </div>
                                    <div className="form-step-part-title">
                                        {t('order.orderConfirmation')}
                                    </div>
                                </div>
                                <div className={`form-step-part ${tab==3?"active":""}`}>
                                    <div className="form-step-part-number">
                                        3
                                    </div>
                                    <div className="form-step-part-title">
                                        {t('order.orderComplete')}
                                    </div>
                                </div>
                            </div>

                            {tab==1&&<div className="form-group">
                                <div className="form-input">
                                    <div className="label">{t('order.name')}</div>
                                    <div className="input">
                                        <input value={name} onChange={(e)=>setName(e.target.value)} type="text" name="name" placeholder={t('order.namePlaceholder')}/>
                                    </div>
                                </div>
                                <div className="form-input">
                                    <div className="label">{t('order.shippingAddress')}</div>
                                    <div className="input">
                                        <input value={address1} onChange={(e)=>setAddress1(e.target.value)} type="text" name="order-address" placeholder={t('order.addressPlaceholder')}/>
                                    </div>
                                </div>
                                <div className="form-input">
                                    <div className="label">{t('order.address')}</div>
                                    <div className="input">
                                        <input value={address} onChange={(e)=>setAddress(e.target.value)} type="text" name="address" placeholder={t('order.addressPlaceholder')}/>
                                    </div>
                                </div>
                                <div className="form-input">
                                    <div className="label">{t('order.phone')}</div>
                                    <div className="input">
                                        <input value={phone} onChange={(e)=>setPhone(e.target.value)} type="text" name="phone" placeholder={t('order.phonePlaceholder')}/>
                                    </div>
                                </div>
                                <div className="form-input">
                                    <div className="label">{t('order.email')}</div>
                                    <div className="input">
                                        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" name="email" placeholder={t('order.emailPlaceholder')}/>
                                    </div>
                                </div>
                            </div>}
                            {tab==2&&
                                <div className='card-container'>
                                    {/* Payment Method Selection - Horizontal Layout */}
                                    <div className="form-group" style={{marginBottom: '30px'}}>
                                        <div className="label" style={{marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', color: '#333'}}>
                                            {t('order.paymentMethod')}
                                        </div>
                                        <div className="payment-methods-container">
                                                {/* All Payment Methods in Horizontal Row */}
                                                <div className="payment-methods-section">
                                                    <div className="payment-methods-grid">
                                                        {/* Bank Transfer */}
                                                        <label className={`payment-method-card ${paymentMethod === "bank" ? "selected" : ""}`}>
                                                            <input 
                                                                type="radio" 
                                                                name="paymentMethod" 
                                                                value="bank" 
                                                                checked={paymentMethod === "bank"}
                                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                            />
                                                            <div className="payment-method-icon bank">🏦</div>
                                                            <div className="payment-method-content">
                                                                <div className="payment-method-name">{t('order.bankTransfer')}</div>
                                                                <div className="payment-method-description">{t('order.bankTransferDesc')}</div>
                                                            </div>
                                                            <div className="payment-method-check"></div>
                                                        </label>
                                                        
                                                        {/* Credit Card */}
                                                        <label className={`payment-method-card ${paymentMethod === "stripe" ? "selected" : ""}`}>
                                                            <input 
                                                                type="radio" 
                                                                name="paymentMethod" 
                                                                value="stripe"
                                                                checked={paymentMethod === "stripe"}
                                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                            />
                                                            <div className="payment-method-icon stripe">💳</div>
                                                            <div className="payment-method-content">
                                                                <div className="payment-method-name">{t('order.creditCard')}</div>
                                                                <div className="payment-method-description">{t('order.creditCardDesc')}</div>
                                                            </div>
                                                            <div className="payment-method-check"></div>
                                                        </label>
                                                        
                                                        {/* Bitcoin */}
                                                        <label className={`crypto-method-card ${paymentMethod === "bitcoin" ? "selected" : ""}`}>
                                                            <input 
                                                                type="radio" 
                                                                name="paymentMethod" 
                                                                value="bitcoin"
                                                                checked={paymentMethod === "bitcoin"}
                                                                onChange={(e) => {
                                                                    setPaymentMethod(e.target.value);
                                                                    setCryptoType("bitcoin");
                                                                }}
                                                            />
                                                            <div className="crypto-method-icon bitcoin">₿</div>
                                                            <div className="crypto-method-name">{t('order.crypto.bitcoin.title')}</div>
                                                            <div className="crypto-method-symbol">BTC</div>
                                                            <div className="crypto-method-check"></div>
                                                        </label>
                                                        
                                                        {/* Ethereum */}
                                                        <label className={`crypto-method-card ${paymentMethod === "ethereum" ? "selected" : ""}`}>
                                                            <input 
                                                                type="radio" 
                                                                name="paymentMethod" 
                                                                value="ethereum"
                                                                checked={paymentMethod === "ethereum"}
                                                                onChange={(e) => {
                                                                    setPaymentMethod(e.target.value);
                                                                    setCryptoType("ethereum");
                                                                }}
                                                            />
                                                            <div className="crypto-method-icon ethereum">Ξ</div>
                                                            <div className="crypto-method-name">{t('order.crypto.ethereum.title')}</div>
                                                            <div className="crypto-method-symbol">ETH</div>
                                                            <div className="crypto-method-check"></div>
                                                        </label>
                                                        
                                                        {/* USDT */}
                                                        <label className={`crypto-method-card ${paymentMethod === "usdt" ? "selected" : ""}`}>
                                                            <input 
                                                                type="radio" 
                                                                name="paymentMethod" 
                                                                value="usdt"
                                                                checked={paymentMethod === "usdt"}
                                                                onChange={(e) => {
                                                                    setPaymentMethod(e.target.value);
                                                                    setCryptoType("usdt");
                                                                }}
                                                            />
                                                            <div className="crypto-method-icon usdt">₮</div>
                                                            <div className="crypto-method-name">{t('order.crypto.usdt.title')}</div>
                                                            <div className="crypto-method-symbol">USDT</div>
                                                            <div className="crypto-method-check"></div>
                                                        </label>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                    
                                    {/* Payment Form - Below Selection */}
                                    {(paymentMethod === "stripe" || paymentMethod === "bitcoin" || paymentMethod === "ethereum" || paymentMethod === "usdt" || paymentMethod === "bank") && (
                                        <div className="payment-form-container">
                                            {paymentMethod === "stripe" && isMockMode ? (
                                                <MockPaymentForm 
                                                    onSuccess={() => completeOrder()}
                                                    name={name}
                                                    email={email}
                                                    amount={price}
                                                />
                                            ) : paymentMethod === "stripe" && clientSecret ? (
                                                <Elements stripe={stripePromise} options={{clientSecret}}>
                                                    <StripeCheckoutForm 
                                                        onSuccess={() => completeOrder()}
                                                        name={name}
                                                        email={email}
                                                    />
                                                </Elements>
                                            ) : paymentMethod === "stripe" && loading ? (
                                                <div style={{padding: '20px', textAlign: 'center'}}>
                                                    {t('order.loadingPayment')}...
                                                </div>
                                            ) : (paymentMethod === "bitcoin" || paymentMethod === "ethereum" || paymentMethod === "usdt") ? (
                                                <CryptoPaymentForm 
                                                    onSuccess={() => completeOrder()}
                                                    amount={price}
                                                    cryptoType={cryptoType}
                                                />
                                            ) : paymentMethod === "bank" ? (
                                        <div className="form-group">
                                        <div className="form-input">
                                            <div className="label">{t('order.bankName')}</div>
                                            <div className="input">
                                                {t('order.bankValue')}
                                            </div>
                                        </div>
                                        <div className="form-input">
                                            <div className="label">{t('order.branchName')}</div>
                                            <div className="input">
                                                {t('order.branchValue')}
                                            </div>
                                        </div>
                                        <div className="form-input">
                                            <div className="label">{t('order.accountNumber')}</div>
                                            <div className="input">
                                                {t('order.accountValue')}
                                            </div>
                                        </div>
                                        <div className="form-input">
                                            <div className="label">{t('order.accountHolder')}</div>
                                            <div className="input">
                                                {t('order.accountHolderValue')}
                                            </div>
                                        </div>
                                        <div className="form-input">
                                            <div className="label">{t('order.transferAmount')}</div>
                                            <div className="input">
                                                {parseInt(price).toLocaleString('en-US').toString()}{t('common.yen')}

                                            </div>
                                        </div>
                                        <div className="form-input">
                                            <div className="label"></div>
                                            <div className="input">
                                                <div style={{fontSize:"12px", color:"red"}}>
                                                    {t('order.paymentNote')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            }
                            {tab==3&&
                                <>
                                    <div className="card-container order-complete">
                                        <div>
                                            <div className='text'>{t('order.orderReceived')}</div>
                                            <div className='text red'>{t('order.shippingNote')}</div>
                                            <div className='text'>
                                                {t('order.shippingEmail')}
                                            </div>
                                            <div className='text'>{t('order.deliveryTime')}</div>

                                            <div className='text red'>{t('order.lineSupport')}</div>
                                        </div>
                                        <div className="detail-right">
                                            <div>
                                                <div className='text'>{t('order.lineSupportTitle')}</div>
                                                <div className='text'>
                                                    {t('order.lineSupportNote')}
                                                </div>
                                                <img src="/assets/images/line1.png"/>
                                            </div>
                                            <div className='qr'>
                                                <img src="/assets/images/QR.png"/>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='card-container order-complete'>
                                        <div className="form-group">
                                            <div className="label" style={{paddingLeft:"20px", marginBottom:"20px", fontSize:"15px"}}> {t('order.orderInfo')}</div>
                                            <div className="form-input">
                                                <div className="label">{t('order.shippingName')}</div>
                                                <div className="input">
                                                    {name}
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">{t('order.shippingAddressLabel')}</div>
                                                <div className="input">
                                                    {address1}
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">{t('order.address')}</div>
                                                <div className="input">
                                                    {address}
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">{t('order.phone')}</div>
                                                <div className="input">
                                                    {phone}
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">{t('order.email')}</div>
                                                <div className="input">
                                                    {email}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">

                                            <div className="label" style={{paddingLeft:"20px", marginBottom:"20px", fontSize:"15px"}}> {t('order.paymentInfo')}</div>

                                            <div className="form-input">
                                                <div className="label">{t('order.bankName')}</div>
                                                <div className="input">
                                                    {t('order.bankValue')}
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">{t('order.branchName')}</div>
                                                <div className="input">
                                                    {t('order.branchValue')}
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">{t('order.accountNumber')}</div>
                                                <div className="input">
                                                    {t('order.accountValue')}
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">{t('order.accountHolder')}</div>
                                                <div className="input">
                                                    {t('order.accountHolderValue')}
                                                </div>
                                            </div>
                                            <div className="form-input">
                                                <div className="label">{t('order.transferAmount')}</div>
                                                <div className="input">
                                                    {parseInt(price).toLocaleString('en-US').toString()}{t('common.yen')}

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </>
                            }
                            {tab!==3 && paymentMethod !== "stripe" && paymentMethod !== "bitcoin" && paymentMethod !== "ethereum" && paymentMethod !== "usdt" && (
                                <button onClick={handleClick} className="form-btn" disabled={loading}>
                                    <p>{tab==1 ? t('common.next') : (loading ? t('order.processing') : t('order.paymentComplete'))}</p>
                                    <span></span>
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </div>
            <Footer/>
            <Sitemap/>
        </>
    )
}

// const CheckoutForm = ({trigger, user_id, product_id, coupon, count}) => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const [errorMessage, setErrorMessage] = useState(null);
//     useEffect(()=>{
//         if(trigger!=0){
//             handleSubmit()
//         }
//     },[trigger])

//     const handleSubmit = async () =>{
//         let coupon_code = ""
//         if(coupon)
//             coupon_code = coupon
//         if (!stripe || !elements) {
//             return;
//         }
//         const {error} = await stripe.confirmPayment({
//         //`Elements` instance that was used to create the Payment Element
//         elements,
//         confirmParams: {
//             return_url: `${mainurl}/order/${user_id}/${product_id}/${coupon_code}`,
//         },
//         });
//         if (error) {
//             // This point will only be reached if there is an immediate error when
//             // confirming the payment. Show error to your customer (for example, payment
//             // details incomplete)
//             setErrorMessage(error.message);
//           } else {
//             // Your customer will be redirected to your `return_url`. For some payment
//             // methods like iDEAL, your customer will be redirected to an intermediate
//             // site first to authorize the payment, then redirected to the `return_url`.
//           }

//     }
//     return (
//         <PaymentElement />
//     );
// };

export default Order;