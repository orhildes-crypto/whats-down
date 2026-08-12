import { SxProps, Theme } from '@mui/material';

export const STATUS_COLORS = {
    up: {
        background: '#2f9e5f',
        borderInlineStart: '3px solid #2f9e5f',
        boxShadow: 'none',
    },
    down: {
        background: '#d61219',
        borderInlineStart: '3px solid #e5484d',
        boxShadow: '0 0 0 1px rgba(229, 72, 77, 0.15), 0 4px 24px rgba(229, 72, 77, 0.18)',
    },
};

export const cubeContainerStyle = (statusStyle: typeof STATUS_COLORS.up): SxProps<Theme> => ({
    position: 'relative',
    borderRadius: '10px',
    padding: '20px 20px 16px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '200px',
    width: '100%',
    minWidth: 0,
    transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
    color: '#fbfbfb',
    cursor: 'pointer',
    backgroundColor: statusStyle.background,
    borderInlineStart: statusStyle.borderInlineStart,
    boxShadow: statusStyle.boxShadow,
    '&:hover': {
        transform: 'translateY(-2px)',
    },
});

export const statusBadgeStyle: SxProps<Theme> = {
    position: 'absolute',
    top: '14px',
    right: '14px',
    fontSize: '0.9rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    padding: '3px 9px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    color: '#000000',
};

export const editTextFieldStyle: SxProps<Theme> = {
    marginBottom: '6px',
    width: '100%',
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#020000',
        color: '#ffffff',
        fontSize: '1.15rem',
        fontWeight: 600,
        borderRadius: '4px',
        '& fieldset': {
            borderColor: '#18222b',
            borderWidth: '2px',
        },
        '&:hover fieldset': {
            borderColor: '#18222b',
        },
    },
    '& .MuiOutlinedInput-input': {
        padding: '2px 6px',
    },
};

export const titleTypographyStyle: SxProps<Theme> = {
    fontSize: '1.15rem',
    fontWeight: 600,
    lineHeight: 1.3,
    color: '#f5f6f7',
    wordBreak: 'break-word',
};

export const infoTextStyle: SxProps<Theme> = {
    color: '#fafafa',
    fontWeight: 500,
    fontSize: '0.95rem',
};

export const actionButtonStyle: SxProps<Theme> = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    '&:hover': { backgroundColor: '#8d8d8e' },
};

export const actionIconStyle: SxProps<Theme> = {
    fontSize: 16,
    color: '#34383b',
};