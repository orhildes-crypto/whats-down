import { colors } from '@/theme/colorsConfig';
import { SxProps, Theme } from '@mui/material';

export const dialogPaperStyle: SxProps<Theme> = {
    borderRadius: '8px',
    minWidth: '320px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    margin: '16px',
};

export const dialogTitleStyle: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: `1px solid ${colors.divider.onLight}`,
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
    color: '#c0c4cd',
    padding: '4px',
    transition: 'background 0.15s ease, border-color 0.15s ease, transform 0.15s ease',
    '&:hover': {
        color: colors.text.onLight,
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