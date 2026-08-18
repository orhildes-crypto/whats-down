import { SxProps, Theme } from '@mui/material';
import { colors } from '@/theme/colorsConfig';

export const containerStyle: SxProps<Theme> = {
    padding: '32px',
};

export const titleStyle: SxProps<Theme> = {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '24px',
    color: colors.text.onDark,
};

export const backButtonStyle: SxProps<Theme> = {
    position: 'fixed',
    bottom: '28px',
    insetInlineStart: '28px',
    zIndex: 1000,
    backgroundColor: colors.text.onDark,
    color: colors.text.onLight,
    border: `1px solid ${colors.divider.onLight}`,
    borderRadius: '50px',
    padding: '9px 18px',
    fontSize: '1rem',
    fontWeight: 500,
    textTransform: 'none',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background 0.15s ease, border-color 0.15s ease, transform 0.15s ease',
    '&:hover': {
        backgroundColor: '#4a4d54',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(74, 91, 127, 0.4)',
    },
};