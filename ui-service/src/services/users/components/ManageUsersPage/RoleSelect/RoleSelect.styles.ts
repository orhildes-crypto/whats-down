import { colors } from '@/theme/colorsConfig';
import { SxProps, Theme } from '@mui/material';

export const selectStyle: SxProps<Theme> = {
    minWidth: '140px',
    fontSize: '0.875rem',
    color: colors.table.text.primary,

    '& .MuiSelect-select': {
        color: colors.table.text.primary,
    },
    '& .MuiSvgIcon-root': {
        color: colors.table.text.secondary,
    },

    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.table.muiSelect.border,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.table.muiSelect.borderHover,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.table.text.primary,
    },

    '&.Mui-disabled': {
        opacity: 0.5,

        '& .MuiSelect-select': {
            color: `${colors.table.text.primary} !important`,
            WebkitTextFillColor: `${colors.table.text.primary} !important`, // עוקף את ההשחרה של הדפדפן
        },
        '& .MuiSvgIcon-root': {
            color: `${colors.table.text.secondary} !important`,
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.table.muiSelect.border,
        },
    },
};

export const optionsStyle: SxProps<Theme> = {
    backgroundColor: colors.table.background.header,
    color: colors.text.onDark,
    border: `1px solid ${colors.table.border}`,
    '& .MuiMenuItem-root': {
        fontSize: '0.875rem',
    },
    '& .MuiMenuItem-root:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '& .MuiMenuItem-root.Mui-selected': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    '& .MuiMenuItem-root.Mui-selected:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
};
