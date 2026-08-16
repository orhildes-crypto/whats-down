import { colors } from '@/theme/colorsConfig';
import { SxProps, Theme } from '@mui/material';

export const confirmButtonStyle: SxProps<Theme> = {
    backgroundColor: colors.action.primaryDefault,
    color: colors.text.onDark,
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: '6px',
    '&:hover': {
        backgroundColor: colors.action.primaryHover,
    },
    '&:disabled': {
        backgroundColor: colors.background.disabled,
        color: colors.text.muted,
    },
};


export const formContainerStyle: SxProps<Theme> = {
    marginTop: 1,

    '& .MuiInputBase-input': {
        color: colors.text.onLight,
    },

    '& input:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 100px ${colors.text.onDark} inset !important`,
        transition: 'background-color 5000s ease-in-out 0s',
    },
};