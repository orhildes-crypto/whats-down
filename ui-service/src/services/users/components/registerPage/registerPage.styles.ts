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
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '450px',
};

export const titleStyle: SxProps<Theme> = {
    margin: '0 0 0.5rem 0',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#1f2937',
    textAlign: 'center',
};

export const subtitleStyle: SxProps<Theme> = {
    margin: '0 0 2rem 0',
    fontSize: '0.95rem',
    color: '#6b7280',
    textAlign: 'center',
};

export const formStyle: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
};

export const errorMessageStyle: SxProps<Theme> = {
    marginBottom: '1.25rem',
    fontSize: '0.875rem',
};

export const submitButtonStyle: SxProps<Theme> = {
    marginTop: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#636e72',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '6px',
    textTransform: 'none',
    boxShadow: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
        backgroundColor: '#404040',
        boxShadow: 'none',
    },
    '&:disabled': {
        opacity: 0.6,
        backgroundColor: '#636e72',
        color: '#ffffff',
    },
};

export const loginSectionStyle: SxProps<Theme> = {
    marginTop: '1.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid #e5e7eb',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
};

export const loginTextStyle: SxProps<Theme> = {
    fontSize: '0.875rem',
    color: '#4b5563',
    margin: 0,
};

export const loginButtonStyle: SxProps<Theme> = {
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