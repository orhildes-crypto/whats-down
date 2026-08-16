import { colors } from '@/theme/colorsConfig';
import { SxProps, Theme } from '@mui/material';

export const containerStyle: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
};

export const errorTextStyle: SxProps<Theme> = {
    color: colors.status.down.main,
    fontSize: '13px',
    textAlign: 'center',
    margin: 0,
};