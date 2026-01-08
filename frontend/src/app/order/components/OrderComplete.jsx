'use client'
import { useI18n } from '@/app/i18n/I18nContext';

export default function OrderComplete({ name, address1, address, phone, email, price }) {
    const { t } = useI18n();

    return (
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
                    <div className="label" style={{paddingLeft:"20px", marginBottom:"20px", fontSize:"15px"}}>
                        {t('order.orderInfo')}
                    </div>
                    <div className="form-input">
                        <div className="label">{t('order.shippingName')}</div>
                        <div className="input">{name}</div>
                    </div>
                    <div className="form-input">
                        <div className="label">{t('order.shippingAddressLabel')}</div>
                        <div className="input">{address1}</div>
                    </div>
                    <div className="form-input">
                        <div className="label">{t('order.address')}</div>
                        <div className="input">{address}</div>
                    </div>
                    <div className="form-input">
                        <div className="label">{t('order.phone')}</div>
                        <div className="input">{phone}</div>
                    </div>
                    <div className="form-input">
                        <div className="label">{t('order.email')}</div>
                        <div className="input">{email}</div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="label" style={{paddingLeft:"20px", marginBottom:"20px", fontSize:"15px"}}>
                        {t('order.paymentInfo')}
                    </div>
                    <div className="form-input">
                        <div className="label">{t('order.bankName')}</div>
                        <div className="input">{t('order.bankValue')}</div>
                    </div>
                    <div className="form-input">
                        <div className="label">{t('order.branchName')}</div>
                        <div className="input">{t('order.branchValue')}</div>
                    </div>
                    <div className="form-input">
                        <div className="label">{t('order.accountNumber')}</div>
                        <div className="input">{t('order.accountValue')}</div>
                    </div>
                    <div className="form-input">
                        <div className="label">{t('order.accountHolder')}</div>
                        <div className="input">{t('order.accountHolderValue')}</div>
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
    );
}
