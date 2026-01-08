'use client'
import { useI18n } from '@/app/i18n/I18nContext';

export default function OrderSteps({ currentTab }) {
    const { t } = useI18n();

    return (
        <div className="form-step">
            <div className={`form-step-part ${currentTab === 1 ? "active" : ""}`}>
                <div className="form-step-part-number">1</div>
                <div className="form-step-part-title">
                    {t('order.customerInfo')}
                </div>
            </div>
            <div className={`form-step-part ${currentTab === 2 ? "active" : ""}`}>
                <div className="form-step-part-number">2</div>
                <div className="form-step-part-title">
                    {t('order.orderConfirmation')}
                </div>
            </div>
            <div className={`form-step-part ${currentTab === 3 ? "active" : ""}`}>
                <div className="form-step-part-number">3</div>
                <div className="form-step-part-title">
                    {t('order.orderComplete')}
                </div>
            </div>
        </div>
    );
}
