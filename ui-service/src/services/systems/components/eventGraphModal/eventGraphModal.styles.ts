import { SxProps, Theme } from '@mui/material';

export const dialogContentStyle: SxProps<Theme> = {
    pt: 2,
    pb: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};

export const controlsWrapperStyle: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    mb: 1,
};

export const selectFormControlStyle: SxProps<Theme> = {
    minWidth: 180,
};

export const stateContainerStyle: SxProps<Theme> = {
    minHeight: 250,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
};
