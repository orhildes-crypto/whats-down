import { createTheme } from '@mui/material/styles';

export const createAppTheme = (direction: 'rtl' | 'ltr') => {
    return createTheme({
        direction,
        palette: {
            mode: 'dark',
            background: {
                default: '#636e72', 
                paper: '#1e2227',   
            },
            text: {
                primary: '#e4e7eb',  
                secondary: '#9aa1ac', 
            },
            divider: '#2a2f36',
        },
        typography: {
            fontFamily:
                direction === 'rtl'
                    ? '"Assistant", "Heebo", "Roboto", "Arial", sans-serif'
                    : '"Roboto", "Arial", sans-serif',
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
                        backgroundColor: '#636e72',
                    },
                    '#root': {
                        minHeight: '100vh',
                    },
                },
            },
        },
    });
};