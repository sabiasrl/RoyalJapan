'use client'
import { useI18n } from '@/app/i18n/I18nContext';

export default function BankTransferDetails({ price }) {
    const { t } = useI18n();

    return (
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
    );
}
