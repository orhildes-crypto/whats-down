import { useTranslation } from 'react-i18next';

export const useRtl = () => {
    const { i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    return {
        isRtl,
        dir: isRtl ? 'rtl' : 'ltr',
    };
};