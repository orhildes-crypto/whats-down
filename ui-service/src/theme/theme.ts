import { createTheme } from '@mui/material/styles';

export const createAppTheme = (direction: 'rtl' | 'ltr') => {
    return createTheme({
        direction,
        typography: {
            fontFamily: direction === 'rtl' 
                ? '"Assistant", "Roboto", "Arial", sans-serif' 
                : '"Roboto", "Arial", sans-serif',
        },
    });
};