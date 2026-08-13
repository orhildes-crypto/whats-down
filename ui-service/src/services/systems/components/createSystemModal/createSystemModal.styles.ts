import { SxProps, Theme } from '@mui/material';

export const confirmButtonStyle: SxProps<Theme> = {
    backgroundColor: '#636e72',
    color: '#ffffff',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: '6px',
    '&:hover': {
        backgroundColor: '#404040',
    },
    '&:disabled': {
        backgroundColor: '#ededed',
        color: '#9e9e9e',
    },
};

export const formContainerStyle: SxProps<Theme> = {
    marginTop: 1,

    '& .MuiInputBase-input': {
        color: '#ffffff',
    },

    '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 100px #1e2227 inset !important',
        transition: 'background-color 5000s ease-in-out 0s',
    },
};