import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import loginFormHe from '../features/users/components/loginForm/locales/loginform.he.json';
import loginFormEn from '../features/users/components/loginForm/locales/loginform.en.json';
import registerPageHe from '../features/users/components/registerPage/locales/registerPage.he.json';
import registerPageEn from '../features/users/components/registerPage/locales/registerPage.en.json';
import navbarHe from '../shared/components/Navbar/locales/navbar.he.json';
import navbarEn from '../shared/components/Navbar/locales/navbar.en.json';
import systemCubeHe from '../features/systems/components/systemCube/locales/systemCube.he.json';
import systemCubeEn from '../features/systems/components/systemCube/locales/systemCube.en.json';

const STORAGE_KEY = 'lang';

const savedLang = localStorage.getItem(STORAGE_KEY);

i18next.use(initReactI18next).init({
    resources: {
        he: {
            loginForm: loginFormHe,
            registerPage: registerPageHe,
            navbar: navbarHe,
            systemCube: systemCubeHe,
        },
        en: {
            loginForm: loginFormEn,
            registerPage: registerPageEn,
            navbar: navbarEn,
            systemCube: systemCubeEn,
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
