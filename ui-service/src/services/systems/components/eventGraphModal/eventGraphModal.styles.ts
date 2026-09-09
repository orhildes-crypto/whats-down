import { SxProps, Theme } from '@mui/material';
import { colors } from '@/theme/colorsConfig';

export const dialogContentStyle: SxProps<Theme> = {
    pt: 2,
    pb: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};

export const controlsWrapperStyle: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'flex-start',
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

export const closeButtonStyle: SxProps<Theme> = {
    backgroundColor: colors.action.primaryDefault,
    color: colors.text.onDark,
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '15px',
    fontWeight: 800,
    textTransform: 'none',
    boxShadow: 'none',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: colors.action.primaryHover,
        boxShadow: 'none',
    },
};
