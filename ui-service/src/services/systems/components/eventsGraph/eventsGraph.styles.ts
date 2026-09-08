import { colors } from '@/theme/colorsConfig';

export const chartContainerStyle = {
    width: '100%',
    height: 520,
    '& .recharts-wrapper, & .recharts-surface, & *:focus': {
        outline: 'none !important',
        border: 'none !important',
    },
};

export const chartColors = {
    up: colors.status.up.main,
    down: colors.status.down.main,
    line: colors.action.primaryDefault,
    axis: colors.text.onLight,
    grid: colors.divider.onLight,
    tooltipBg: colors.table.background.header,
    tooltipBorder: colors.table.border,
    tooltipText: colors.text.primary,
};

export const axisTickStyle = {
    fontSize: 12,
    fill: chartColors.axis,
};

export const tooltipStyle = {
    backgroundColor: chartColors.tooltipBg,
    border: `1px solid ${chartColors.tooltipBorder}`,
    borderRadius: '8px',
    color: chartColors.tooltipText,
    fontSize: '0.85rem',
    padding: '8px 12px',
};
