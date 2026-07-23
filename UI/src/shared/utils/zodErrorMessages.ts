import { z } from 'zod';

export const getErrorMessage = (issue: z.ZodIssue, fieldNameOverride?: string): string => {
    const field = fieldNameOverride ?? issue.path[0];

    if (issue.code === 'too_small' && issue.minimum === 1 && issue.type === 'string') {
        return 'שדה חובה';
    }

    switch (field) {
        case 'username':
            if (issue.code === 'too_small') {
                return `שם המשתמש חייב להכיל לפחות ${issue.minimum} תווים`;
            }
            break;

        case 'email':
            if (issue.code === 'invalid_string' && issue.validation === 'email') {
                return 'כתובת אימייל לא תקינה';
            }
            break;

        case 'password':
            if (issue.code === 'too_small') {
                return `הסיסמה חייבת להכיל לפחות ${issue.minimum} תווים`;
            }
            break;
    }

    return issue.message || 'שדה לא תקין';
}