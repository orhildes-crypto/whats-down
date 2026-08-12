import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { createEmotionCache } from './emotionCache';
import { createAppTheme } from './theme';

export const RtlThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { i18n } = useTranslation();
    const direction = i18n.dir() === 'rtl' ? 'rtl' : 'ltr';

    const cache = useMemo(() => createEmotionCache(direction), [direction]);
    const theme = useMemo(() => createAppTheme(direction), [direction]);

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
};