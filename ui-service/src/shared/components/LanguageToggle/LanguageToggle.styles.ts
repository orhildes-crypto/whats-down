import { colors } from '@/theme/colorsConfig';
import { SxProps, Theme } from '@mui/material';

export const toggleButtonStyle: SxProps<Theme> = {
    backgroundColor: colors.action.primaryDefault,
    border: `1px solid ${colors.text.onDark}`,
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    color: colors.text.onDark,
    width: '110px',
    textTransform: 'none',
    boxShadow: 'none',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: colors.action.primaryHover,
        borderColor: colors.text.onDark,
        boxShadow: 'none',
    },
};