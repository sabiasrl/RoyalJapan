'use client'
import { useState } from 'react';
import { useI18n } from '@/app/i18n/I18nContext';

export default function MockPaymentForm({ onSuccess, name, email, amount }) {
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
