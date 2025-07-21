import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from './en.json';
import ar from './ar.json';
import bn from './bn.json';

const resources = {
  en: {
    translation: en
  },
  ar: {
    translation: ar
  },
  bn: {
    translation: bn
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already does escaping
    },
    react: {
      useSuspense: false // disable suspense for SSR
    }
  });

export default i18n;
