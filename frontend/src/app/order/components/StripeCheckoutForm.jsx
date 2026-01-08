'use client'
import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useI18n } from '@/app/i18n/I18nContext';

export default function StripeCheckoutForm({ onSuccess, name, email }) {
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
