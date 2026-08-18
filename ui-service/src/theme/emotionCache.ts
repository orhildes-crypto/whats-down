import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

export const createEmotionCache = (direction: 'rtl' | 'ltr') => {
    return createCache({
        key: direction === 'rtl' ? 'muirtl' : 'muiltr',
        stylisPlugins: direction === 'rtl' ? [prefixer, rtlPlugin] : [prefixer],
    });
};