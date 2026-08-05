import i18next from 'i18next';

export const formatDate = (date: string | Date, namespace = 'utils'): string => {
    const parsed = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(parsed.getTime())) return '';

    const diffMs = Date.now() - parsed.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) {
        return i18next.t(`${namespace}:time.justNow`);
    }

    if (diffMinutes < 60) {
        return i18next.t(`${namespace}:time.minute`, { count: diffMinutes });
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return i18next.t(`${namespace}:time.hour`, { count: diffHours });
    }
    
    const currentLang = i18next.language || 'he';
    return new Intl.DateTimeFormat(currentLang, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(parsed);
};
