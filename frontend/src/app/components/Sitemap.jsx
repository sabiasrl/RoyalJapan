'use client'
import { useI18n } from '@/app/i18n/I18nContext';

function SiteMap(){
    const { t } = useI18n();

    return (
        <div className="sitemap">
			<div className="contain">
				<div className="footer-logo sp">
					<img src="/assets/images/header_logo_sp.svg" alt=""/>
				</div>
				<div className="sitemap-left">
					<div className="sitemap-part">
						<div className="sitemap-item">
							{t('sitemap.legal')}
						</div>
						<div className="sitemap-item">
							{t('sitemap.privacy')}
						</div>
						<div className="sitemap-item">
							{t('sitemap.terms')}
						</div>
						<div className="sitemap-item">
							{t('sitemap.sitemap')}
						</div>
					</div>
					<div className="sitemap-copyright pc">
						{/* ※「タカミスキンピール」は株式会社タカミの登録商標です。 ※「タカミ式」はタカミクリニックの登録商標です。<br/> */}
						Copyright © ROYAL JAPAN All rights reserved. <br/>
						MALYSIA
					</div>
					<div className="sitemap-copyright sp">
						Copyright © ROYAL JAPAN All rights reserved. <br/>
						MALYSIA
					</div>
				</div>
				<div className="sitemap-right pc">
					<img src="/assets/images/logo.svg" alt=""/>
					<div className="sitemap-title">
						{t('sitemap.officialSite')}
					</div>
				</div>
			</div>
		</div>
    )
}
export default SiteMap;