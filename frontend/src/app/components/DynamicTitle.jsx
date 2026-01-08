'use client'
import { useEffect } from 'react';
import { useI18n } from '@/app/i18n/I18nContext';

export function DynamicTitle() {
  const { locale } = useI18n();

  useEffect(() => {
    const titles = {
      en: 'Products | Royal Japan Official Online Store',
      ja: '商品 | ロイヤルジャパン公式通販サイト',
    };

    const title = titles[locale] || titles.en;
    document.title = title;
  }, [locale]);

  return null;
}
