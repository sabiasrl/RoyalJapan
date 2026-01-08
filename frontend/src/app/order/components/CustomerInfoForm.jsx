'use client'
import { useI18n } from '@/app/i18n/I18nContext';

export default function CustomerInfoForm({ name, setName, address1, setAddress1, address, setAddress, phone, setPhone, email, setEmail }) {
    const { t } = useI18n();

    return (
        <div className="form-group">
            <div className="form-input">
                <div className="label">{t('order.name')}</div>
                <div className="input">
                    <input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        type="text" 
                        name="name" 
                        placeholder={t('order.namePlaceholder')}
                    />
                </div>
            </div>
            <div className="form-input">
                <div className="label">{t('order.shippingAddress')}</div>
                <div className="input">
                    <input 
                        value={address1} 
                        onChange={(e) => setAddress1(e.target.value)} 
                        type="text" 
                        name="order-address" 
                        placeholder={t('order.addressPlaceholder')}
                    />
                </div>
            </div>
            <div className="form-input">
                <div className="label">{t('order.address')}</div>
                <div className="input">
                    <input 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        type="text" 
                        name="address" 
                        placeholder={t('order.addressPlaceholder')}
                    />
                </div>
            </div>
            <div className="form-input">
                <div className="label">{t('order.phone')}</div>
                <div className="input">
                    <input 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        type="text" 
                        name="phone" 
                        placeholder={t('order.phonePlaceholder')}
                    />
                </div>
            </div>
            <div className="form-input">
                <div className="label">{t('order.email')}</div>
                <div className="input">
                    <input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="text" 
                        name="email" 
                        placeholder={t('order.emailPlaceholder')}
                    />
                </div>
            </div>
        </div>
    );
}
