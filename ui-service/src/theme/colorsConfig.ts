export const colors = {
    status: {
        up: {
            main: '#2f9e5f',
            border: '#2f9e5f',
        },
        down: {
            main: '#d61219',
            border: '#e5484d',
            glow: 'rgba(229, 72, 77, 0.15)',
            glowStrong: 'rgba(229, 72, 77, 0.18)',
        },
    },

    text: {
        primary: '#f5f6f7',
        secondary: '#fafafa',
        onLight: '#000000',
        onDark: '#ffffff',
        muted: '#9e9e9e',
        empty: '#8b93a1',
    },

    background: {
        input: '#020000',
        disabled: '#ededed',
    },

    action: {
        primaryDefault: '#636e72',
        primaryHover: '#404040',
        iconButtonHover: '#8d8d8e',
        iconDefault: '#34383b',
    },

    border: {
        input: '#18222b',
    },

    divider: {
        onLight: '#2a2f36',
        onDark: '#e5e7eb',
    },

    form: {
        title: '#1f2937',
        subtitle:  '#6b7280',
        footerText: '#4b5563',
    }
} as const;

