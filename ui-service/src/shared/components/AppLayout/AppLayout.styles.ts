import { SxProps, Theme } from '@mui/material';

export const layoutContainerStyle: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
};

export const mainContentStyle: SxProps<Theme> = {
    flex: 1,
    padding: '24px',
};