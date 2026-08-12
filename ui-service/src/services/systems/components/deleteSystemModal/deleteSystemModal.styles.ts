import { SxProps, Theme } from '@mui/material';

export const confirmButtonStyle: SxProps<Theme> = {
    backgroundColor: '#df3535',
    color: '#ffffff',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '15px',
    fontWeight: 799,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: '#e24f4f',
        boxShadow: 'none',
    },
    '&:disabled': {
        backgroundColor: '#191f26',
        color: 'rgba(255, 255, 255, 0.5)',
    },
};

export const cancelButtonStyle: SxProps<Theme> = {
    backgroundColor: '#888383',
    color: '#ffffff',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '15px',
    fontWeight: 799,
    textTransform: 'none',
    boxShadow: 'none',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: '#494545',
        boxShadow: 'none',
    },
};

export const messageContainerStyle: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'center',
};

export const messageTypographyStyle: SxProps<Theme> = {
    fontSize: '21px',
    textAlign: 'center',
};