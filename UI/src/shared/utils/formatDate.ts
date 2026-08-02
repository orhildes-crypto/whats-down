export const formatDate = (date: string | Date): string => {
    const parsed = typeof date === 'string' ? new Date(date) : date;
    const diffMs = Date.now() - parsed.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return 'לפני רגע';
    if (diffMinutes < 60) return `לפני ${diffMinutes} דקות`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `לפני ${diffHours} שעות`;

    return new Intl.DateTimeFormat('he-IL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(parsed);
};