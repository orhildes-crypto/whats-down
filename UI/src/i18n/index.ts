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
import systemsPageHe from '../features/systems/components/systemGridPage/locales/systemPage.he.json';
import systemsPageEn from '../features/systems/components/systemGridPage/locales/systemPage.en.json';
import createSystemModalHe from '../features/systems/components/createSystemModal/locales/createModal.he.json';
import createSystemModalEn from '../features/systems/components/createSystemModal/locales/createModal.en.json';
import deleteSystemModalHe from '../features/systems/components/deleteSystemModal/locales/deleteModal.he.json';
import deleteSystemModalEn from '../features/systems/components/deleteSystemModal/locales/deleteModal.en.json';
import errorPageHe from '../shared/components/ErrorPage/locales/errorPage.he.json';
import errorPageEn from '../shared/components/ErrorPage/locales/errorPage.en.json';
import spinnerHe from '../shared/components/Spinner/locales/spinner.he.json';
import spinnerEn from '../shared/components/Spinner/locales/spinner.en.json';

const STORAGE_KEY = 'lang';

const savedLang = (localStorage.getItem(STORAGE_KEY) as 'he' | 'en') || 'he';

const updateDocumentAttributes = (lang: string) => {
    const dir = i18next.dir(lang);
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
};

i18next.use(initReactI18next).init({
    resources: {
        he: {
            loginForm: loginFormHe,
            registerPage: registerPageHe,
            navbar: navbarHe,
            systemCube: systemCubeHe,
            systemsPage: systemsPageHe,
            createSystemModal: createSystemModalHe,
            deleteSystemModal: deleteSystemModalHe,
            errorPage: errorPageHe,
            spinner: spinnerHe,
        },
        en: {
            loginForm: loginFormEn,
            registerPage: registerPageEn,
            navbar: navbarEn,
            systemCube: systemCubeEn,
            systemsPage: systemsPageEn,
            createSystemModal: createSystemModalEn,
            deleteSystemModal: deleteSystemModalEn,
            errorPage: errorPageEn,
            spinner: spinnerEn,
        },
    },
    lng: savedLang ?? 'he',
    fallbackLng: 'he',
    interpolation: {
        escapeValue: false, // React already escapes values, no need for i18next to do it too
    },
});

updateDocumentAttributes(savedLang);

i18next.on('languageChanged', (lang) => {
    updateDocumentAttributes(lang);
});

export const changeLanguage = (lang: 'he' | 'en') => {
    i18next.changeLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
};

export default i18next;
