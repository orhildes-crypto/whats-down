import { colors } from '@/theme/colorsConfig';
import { ToasterProps } from 'react-hot-toast';

export const toasterOptions: ToasterProps = {
    position: 'bottom-center',
    toastOptions: {
        style: {
            background: '#16191d',
            color: colors.text.primary,
            border: `1px solid ${colors.divider.onLight}`,
            fontFamily: 'system-ui, sans-serif',
        },
        error: {
            iconTheme: { primary: colors.status.down.border, secondary: '#16191d' },
        },
        success: {
            iconTheme: { primary: colors.status.up.main, secondary: '#16191d' },
        },
    },
};