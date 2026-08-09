import { ToasterProps } from 'react-hot-toast';

export const toasterOptions: ToasterProps = {
    position: 'bottom-center',
    toastOptions: {
        style: {
            background: '#16191d',
            color: '#e4e7eb',
            border: '1px solid #2a2f36',
            fontFamily: 'system-ui, sans-serif',
        },
        error: {
            iconTheme: { primary: '#e5484d', secondary: '#16191d' },
        },
        success: {
            iconTheme: { primary: '#2f9e5f', secondary: '#16191d' },
        },
    },
};