import { SxProps, Theme } from '@mui/material';

export const containerStyle: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    padding: '40px 20px',
    textAlign: 'center',
    color: '#e4e7eb',
};

export const iconStyle: SxProps<Theme> = {
    fontSize: 100,
    color: '#CC071E',
    marginBottom: '16px',
    opacity: 0.85,
};

export const titleStyle: SxProps<Theme> = {
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#f5f6f7',
    marginBottom: '8px',
};

export const messageStyle: SxProps<Theme> = {
    fontSize: '0.95rem',
    color: '#8b93a1',
    maxWidth: '400px',
    lineHeight: 1.5,
    marginBottom: '24px',
};

export const retryButtonStyle: SxProps<Theme> = {
    backgroundColor: 'transparent',
    border: '1px solid #3a4048',
    borderRadius: '6px',
    padding: '8px 20px',
    color: '#e4e7eb',
    fontSize: '0.9rem',
    textTransform: 'none',
    boxShadow: 'none',
    transition: 'background 0.15s ease, border-color 0.15s ease',
    '&:hover': {
        backgroundColor: '#21262d',
        borderColor: '#4a5058',
        boxShadow: 'none',
    },
};