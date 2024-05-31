import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import ar from 'src/locales/ar.json'
import en from 'src/locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'ar',
    resources: { ar: { translation: ar }, en: { translation: en } },
    fallbackLng: 'ar',
    debug: false,
    keySeparator: false,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  })

export default i18n
