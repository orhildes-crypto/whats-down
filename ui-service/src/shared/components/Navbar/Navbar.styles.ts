import { colors } from '@/theme/colorsConfig';
import { SxProps, Theme } from '@mui/material';

export const navbarStyle: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    padding: '12px 56px',
    color: colors.text.onDark,
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
    border: `1px solid ${colors.text.onDark}`,
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    color: colors.text.onDark,
    width: '110px',
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: colors.action.primaryHover,
        borderColor: colors.text.onDark,
        boxShadow: 'none',
    },
    '&:disabled': {
        opacity: 0.6,
        color: colors.text.onDark,
        borderColor: colors.text.onDark,
    },
};