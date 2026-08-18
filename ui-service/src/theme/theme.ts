import { createTheme } from '@mui/material/styles';
import { colors } from './colorsConfig';

export const createAppTheme = (direction: 'rtl' | 'ltr') => {
    return createTheme({
        direction,
        typography: {
            fontFamily: direction === 'rtl' ? '"Assistant", "Heebo", "Roboto", "Arial", sans-serif' : '"Roboto", "Arial", sans-serif',
            h1: {
                fontFamily: '"Rubik", "Heebo", system-ui, sans-serif',
            },
            h2: {
                fontFamily: '"Rubik", "Heebo", system-ui, sans-serif',
            },
            h3: {
                fontFamily: '"Rubik", "Heebo", system-ui, sans-serif',
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    '*': {
                        boxSizing: 'border-box',
                    },
                    'html, body': {
                        margin: 0,
                        padding: 0,
                        minHeight: '100vh',
                        overflowX: 'hidden',
                        lineHeight: 1.55,
                        backgroundColor: colors.action.primaryDefault,
                    },
                    '#root': {
                        minHeight: '100vh',
                    },
                },
            },
        },
    });
};
