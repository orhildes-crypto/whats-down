import { SxProps, Theme } from '@mui/material';

export const toggleButtonStyle: SxProps<Theme> = {
    backgroundColor: '#636e72',
    border: '1px solid #ffffff',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#ffffff',
    width: '110px',
    textTransform: 'none',
    boxShadow: 'none',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: '#404040',
        borderColor: '#ffffff',
        boxShadow: 'none',
    },
};