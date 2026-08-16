import { SxProps, Theme } from '@mui/material';
// import { colors } from '@/theme/colorsConfig';

export const selectStyle: SxProps<Theme> = {
    minWidth: '140px',
    fontSize: '0.875rem',

    '&.Mui-disabled': {
        opacity: 0.5,
    },
};