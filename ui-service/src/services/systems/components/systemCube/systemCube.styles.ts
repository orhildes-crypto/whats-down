import { SxProps, Theme } from '@mui/material';
import { colors } from '@/theme/colorsConfig';

export const STATUS_COLORS = {
    up: {
        background: colors.status.up.main,
        borderInlineStart: `3px solid ${colors.status.up.border}`,
        boxShadow: 'none',
    },
    down: {
        background: colors.status.down.main,
        borderInlineStart: `3px solid ${colors.status.down.border}`,
        boxShadow: `0 0 0 1px ${colors.status.down.glow}, 0 4px 24px ${colors.status.down.glowStrong}`,
    },
};

export type StatusColorSet = (typeof STATUS_COLORS)[keyof typeof STATUS_COLORS];

export const cubeContainerStyle = (statusStyle: StatusColorSet): SxProps<Theme> => ({
    position: 'relative',
    borderRadius: '10px',
    padding: '20px 15px 16px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '200px',
    width: '100%',
    minWidth: 0,
    transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
    color: colors.text.onDark,
    cursor: 'pointer',
    backgroundColor: statusStyle.background,
    borderInlineStart: statusStyle.borderInlineStart,
    boxShadow: statusStyle.boxShadow,
    '&:hover': {
        transform: 'translateY(-2px)',
    },
});

export const editTextFieldStyle: SxProps<Theme> = {
    marginBottom: '6px',
    width: '100%',
    '& .MuiOutlinedInput-root': {
        backgroundColor: colors.background.input,
        color: colors.text.onDark,
        fontSize: '1.15rem',
        fontWeight: 600,
        borderRadius: '4px',
        '& fieldset': {
            borderColor: colors.border.input,
            borderWidth: '2px',
        },
        '&:hover fieldset': {
            borderColor: colors.border.input,
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
    color: colors.text.primary,
    wordBreak: 'break-word',
};

export const infoTextStyle: SxProps<Theme> = {
    color: colors.text.secondary,
    fontWeight: 500,
    fontSize: '0.95rem',
};

export const actionButtonStyle: SxProps<Theme> = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    '&:hover': { backgroundColor: colors.action.iconButtonHover },
};

export const actionIconStyle: SxProps<Theme> = {
    fontSize: 20,
    color: colors.action.iconDefault,
};
