import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';


const STORAGE_KEY = 'lang';

const savedLang = localStorage.getItem(STORAGE_KEY);

i18next.use(initReactI18next).init({
    resources: {
        he: {
        },
        en: {
        },
    },
    lng: savedLang ?? 'he',
    fallbackLng: 'he',
    interpolation: {
        escapeValue: false, // React already escapes values, no need for i18next to do it too
    },
});

export const changeLanguage = (lang: 'he' | 'en') => {
    i18next.changeLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
};

export default i18next;
