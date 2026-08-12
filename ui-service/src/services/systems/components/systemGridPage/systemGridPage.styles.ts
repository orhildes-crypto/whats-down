import { SxProps, Theme } from '@mui/material';

export const pageContainerStyle: SxProps<Theme> = {
    padding: '32px 40px',
};

export const gridStyle: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(296px, 1fr))',
    gap: '32px',
};

export const addButtonStyle: SxProps<Theme> = {
    position: 'fixed',
    bottom: '28px',
    insetInlineStart: '28px',
    zIndex: 1000,
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #2a2f36',
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

export const emptyStateStyle: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '30vh',
    color: '#8b93a1',
    fontSize: '1rem',
};

export const breadcrumbsSkeletonStyle: SxProps<Theme> = {
    color: '#8b93a1',
    fontSize: '0.9rem',
    marginBottom: '16px',
};

export const centeredStateStyle: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '24px',
};

export const loadingTextStyle: SxProps<Theme> = {
    color: '#e5e7ea',
    fontSize: '1.3rem',
};