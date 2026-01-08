'use client'
import { useI18n } from '@/app/i18n/I18nContext';

export default function PaymentMethodSelector({ paymentMethod, setPaymentMethod, setCryptoType }) {
    const { t } = useI18n();

    return (
        <div className="form-group" style={{marginBottom: '30px'}}>
            <div className="label" style={{marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', color: '#333'}}>
                {t('order.paymentMethod')}
            </div>
            <div className="payment-methods-container">
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
    );
}
