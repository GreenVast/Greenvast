import React, { createContext, useContext, useMemo, useState } from 'react';

type Language = 'en' | 'sw';

type TranslationMap = Record<
  string,
  { en: string; sw: string }
>;

const translations: TranslationMap = {
  'common.language': { en: 'English', sw: 'Kiswahili' },
  'common.toggle': { en: 'SW', sw: 'EN' },
  'farmer.greeting': { en: 'Hello, {name}', sw: 'Habari, {name}' },
  'farmer.location': { en: '{type} • {county}', sw: '{type} • {county}' },
  'farmer.farmingInsights': { en: 'Farming Insights', sw: 'Taarifa za Kilimo' },
  'farmer.quickActions': { en: 'Quick Actions', sw: 'Vitendo vya Haraka' },
  'farmer.weatherTitle': { en: 'Weather Forecast', sw: 'Utabiri wa Hali ya Hewa' },
  'farmer.weatherSubtitle': { en: 'Good to plant next 3 days', sw: 'Ni vizuri kupanda siku 3 zijazo' },
  'farmer.weatherDetail': { en: 'Light showers, Avg temp 24°C', sw: 'Mvua nyepesi, Wastani 24°C' },
  'farmer.outbreakTitle': { en: 'Outbreak Alerts', sw: 'Tahadhari za Mlipuko' },
  'farmer.outbreakSubtitle': { en: 'No current alerts', sw: 'Hakuna tahadhari kwa sasa' },
  'farmer.outbreakDetail': { en: 'Last checked: Today', sw: 'Ilivyokaguliwa mwisho: Leo' },
  'farmer.communities': { en: 'Communities', sw: 'Jamii' },
  'farmer.market': { en: 'Market Prices', sw: 'Bei Sokoni' },
  'farmer.loanTracker': { en: 'Loan Tracker', sw: 'Ufuatiliaji wa Mkopo' },
  'farmer.netWorth': { en: 'Farm Value', sw: 'Thamani ya Shamba' },
  'investor.welcome': { en: 'Welcome, {name}', sw: 'Karibu, {name}' },
  'investor.subtitle': { en: 'Browse farmers seeking funding', sw: 'Tafuta wakulima wanaohitaji ufadhili' },
  'buyer.welcome': { en: 'Welcome, Buyer', sw: 'Karibu, Mnunuzi' },
  'buyer.searchPlaceholder': { en: 'Search crops or farmers...', sw: 'Tafuta mazao au wakulima...' },
  'communities.joined': { en: 'Joined Communities', sw: 'Jamii Zilizojumuishwa' },
  'communities.search': { en: 'Search community...', sw: 'Tafuta jamii...' },
  'communities.newMessage': { en: 'New message', sw: 'Ujumbe mpya' },
  'chat.placeholder': { en: 'Type a message', sw: 'Andika ujumbe' },
  'chat.send': { en: 'Send', sw: 'Tuma' },
};

interface LanguageContextValue {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo<LanguageContextValue>(() => {
    const translate = (key: string, vars?: Record<string, string | number>) => {
      const entry = translations[key];
      const template = entry ? entry[language] : key;
      if (!vars) return template;
      return template.replace(/\{(\w+)\}/g, (_, match: string) =>
        vars[match] !== undefined ? String(vars[match]) : `{${match}}`,
      );
    };

    return {
      language,
      toggleLanguage: () => setLanguage((prev) => (prev === 'en' ? 'sw' : 'en')),
      t: translate,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
};
