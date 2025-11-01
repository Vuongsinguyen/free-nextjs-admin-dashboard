"use client";

import React from 'react';
import { useLocale } from '@/context/LocaleContext';

const Tagline: React.FC = () => {
  const { t } = useLocale();
  return (
    <p className="text-center text-gray-400 dark:text-white/60">
      {t('marketing.facilitiesTagline')}
    </p>
  );
};

export default Tagline;
