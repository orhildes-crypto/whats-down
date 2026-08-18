import { colors } from '@/theme/colorsConfig';
import { SxProps, Theme } from '@mui/material';

export const containerStyle: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
};

export const buttonContainerStyle: SxProps<Theme> = {
    position: 'fixed',
    top: '3rem',
    insetInlineEnd: '3rem',
};

export const cardStyle: SxProps<Theme> = {
    backgroundColor: colors.text.onDark,
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '400px',
};

export const titleStyle: SxProps<Theme> = {
    margin: '0 0 0.5rem 0',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: colors.form.title,
    textAlign: 'center',
};

export const subtitleStyle: SxProps<Theme> = {
    margin: '0 0 2rem 0',
    fontSize: '0.95rem',
    color: colors.form.subtitle,
    textAlign: 'center',
};

export const errorMessageStyle: SxProps<Theme> = {
    marginBottom: '1.25rem',
    fontSize: '0.875rem',
};

export const formStyle: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',

    '& .MuiInputBase-input': {
        color: colors.text.onLight,
    },

    '& .MuiOutlinedInput-root.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
        borderColor: '#9ca3af',
        borderWidth: '1px',
    },

    '& input:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 100px ${colors.text.onDark} inset !important`,
        WebkitTextFillColor: `${colors.form.title} !important`,
        transition: 'background-color 5000s ease-in-out 0s',
    },
};

export const submitButtonStyle: SxProps<Theme> = {
    marginTop: '0.5rem',
    marginBottom: '20px',
    padding: '0.75rem',
    backgroundColor: colors.action.primaryDefault,
    color: colors.text.onDark,
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '6px',
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: colors.action.primaryHover,
        boxShadow: 'none',
    },
    '&:disabled': {
        opacity: 0.6,
        backgroundColor: colors.action.primaryDefault,
        color: colors.text.onDark,
    },
};

export const registerSectionStyle: SxProps<Theme> = {
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: `1px solid ${colors.divider.onDark}`,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
};

export const registerTextStyle: SxProps<Theme> = {
    fontSize: '0.875rem',
    color: colors.form.footerText,
    margin: 0,
};

export const registerButtonStyle: SxProps<Theme> = {
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    color: '#374151',
    padding: '0.625rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: '#f9fafb',
        borderColor: '#9ca3af',
        boxShadow: 'none',
    },
};