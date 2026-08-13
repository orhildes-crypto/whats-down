import { SxProps, Theme } from '@mui/material';

export const navbarStyle: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    padding: '12px 56px',
    color: '#ffffff',
};

export const startSideStyle: SxProps<Theme> = {
    justifySelf: 'start',
};

export const centerStyle: SxProps<Theme> = {
    gridColumn: 2,
    justifySelf: 'center',
};

export const endSideStyle: SxProps<Theme> = {
    justifySelf: 'end',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
};

export const welcomeTextStyle: SxProps<Theme> = {
    fontSize: '25px',
};

export const titleStyle: SxProps<Theme> = {
    fontSize: '45px',
    fontWeight: 700,
    margin: 0.5,
};

export const logoutButtonStyle: SxProps<Theme> = {
    backgroundColor: 'transparent',
    border: '1px solid #ffffff',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#ffffff',
    width: '110px',
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: '#404040',
        borderColor: '#ffffff',
        boxShadow: 'none',
    },
    '&:disabled': {
        opacity: 0.6,
        color: '#ffffff',
        borderColor: '#ffffff',
    },
};