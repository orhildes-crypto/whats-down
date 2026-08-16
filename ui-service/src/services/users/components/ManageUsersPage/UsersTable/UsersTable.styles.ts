import { colors } from '@/theme/colorsConfig';
import { SxProps, Theme } from '@mui/material';

const TABLE_HEADER_BG = '#4d565a';
const ROW_HOVER_BG = '#d4d4d4';
const BORDER_COLOR = 'rgba(0, 0, 0, 0.1)';
const TEXT_PRIMARY = '#090909';
const TEXT_SECONDARY = 'rgba(245, 245, 245, 0.7)';

export const tableContainerStyle: SxProps<Theme> = {
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#FFFDD0',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
};

export const headerRowStyle: SxProps<Theme> = {
    backgroundColor: TABLE_HEADER_BG,

    '& .MuiTableCell-root': {
        color: TEXT_PRIMARY,
        fontWeight: 900,
        fontSize: '1.4rem',
        borderBottom: `1px solid ${BORDER_COLOR}`,
    },
};

export const bodyRowStyle: SxProps<Theme> = {
    transition: 'background-color 0.15s ease',

    '& .MuiTableCell-root': {
        color: TEXT_PRIMARY,
        borderBottom: `1px solid ${BORDER_COLOR}`,
    },

    '&:hover': {
        backgroundColor: ROW_HOVER_BG,
    },

    '&:last-of-type .MuiTableCell-root': {
        borderBottom: 'none',
    },
};

export const currentUserRowStyle: SxProps<Theme> = {
    ...bodyRowStyle,
    opacity: 0.55,

    '&:hover': {
        backgroundColor: '#FFFDD0',
    },
};

export const secondaryCellStyle: SxProps<Theme> = {
    color: TEXT_SECONDARY,
};

export const centeredStateStyle: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
};