import { useEffect } from 'react';
import i18next from 'i18next';

const RTL_LANGUAGES = ['he'];

export const useSyncDocumentDir = () => {
    useEffect(() => {
        const applyDir = (lang: string) => {
            document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
            document.documentElement.lang = lang;
        };

        // Apply immediately for the language i18next already initialized with
        applyDir(i18next.language);

        i18next.on('languageChanged', applyDir);

        return () => {
            i18next.off('languageChanged', applyDir);
        };
    }, []);
};
