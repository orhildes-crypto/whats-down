import { colors } from '@/theme/colorsConfig';
import { SxProps, Theme } from '@mui/material';

export const confirmButtonStyle: SxProps<Theme> = {
    backgroundColor: colors.status.down.main,
    color: colors.text.onDark,
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '15px',
    fontWeight: 800,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: colors.status.down.border,
        boxShadow: 'none',
    },
    '&:disabled': {
        backgroundColor: '#191f26',
        color: 'rgba(255, 255, 255, 0.5)',
    },
};

export const cancelButtonStyle: SxProps<Theme> = {
    backgroundColor: colors.action.primaryDefault,
    color: colors.text.onDark,
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '15px',
    fontWeight: 800,
    textTransform: 'none',
    boxShadow: 'none',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: colors.action.primaryHover,
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