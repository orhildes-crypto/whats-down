import { colors } from '@/theme/colorsConfig';
import { SxProps, Theme } from '@mui/material';

export const tableContainerStyle: SxProps<Theme> = {
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: colors.table.background.dark,
    borderRadius: '12px',
    border: `1px solid ${colors.table.border}`,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
};

export const headerRowStyle: SxProps<Theme> = {
    backgroundColor: colors.table.background.header,

    '& .MuiTableCell-root': {
        color: colors.table.text.muted,
        fontWeight: 600,
        fontSize: '1.3rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        padding: '16px 24px',
        borderBottom: `1px solid ${colors.table.border}`,
    },
};

export const bodyRowStyle: SxProps<Theme> = {
    transition: 'background-color 0.15s ease',

    '&:hover': {
        backgroundColor: colors.table.background.rowHover,
    },

    '& .MuiTableCell-root': {
        color: colors.table.text.primary,
        padding: '16px 24px',
        fontSize: '0.875rem',
        borderBottom: `1px solid ${colors.table.border}`,
    },

    '&:last-of-type .MuiTableCell-root': {
        borderBottom: 'none',
    },
};

export const currentUserRowStyle: SxProps<Theme> = {
    ...bodyRowStyle,
    opacity: 0.7,
};

export const secondaryCellStyle: SxProps<Theme> = {
    color: colors.table.text.secondary,
};

export const centeredStateStyle: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    color: colors.table.text.secondary,
};