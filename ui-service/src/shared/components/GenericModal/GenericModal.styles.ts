import { SxProps, Theme } from '@mui/material';

export const dialogPaperStyle: SxProps<Theme> = {
    borderRadius: '8px',
    minWidth: '320px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    margin: '16px',
};

export const dialogTitleStyle: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
};

export const titleTextStyle: SxProps<Theme> = {
    gridColumn: 2,
    fontSize: '24px',
    fontWeight: 600,
    margin: 0,
    textAlign: 'center',
};

export const closeButtonStyle: SxProps<Theme> = {
    gridColumn: 3,
    justifySelf: 'end',
    color: '#6b7280',
    padding: '4px',
    '&:hover': {
        color: '#111827',
        backgroundColor: 'transparent',
    },
};

export const dialogContentStyle: SxProps<Theme> = {
    marginTop: '20px',
    padding: '20px',
};

export const dialogActionsStyle: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px 20px',
};