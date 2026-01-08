'use client'
import { useState, useEffect } from 'react';
import { useI18n } from '@/app/i18n/I18nContext';

export default function CryptoPaymentForm({ onSuccess, amount, cryptoType }) {
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
