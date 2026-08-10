import { z } from 'zod';
import i18next from 'i18next';

export const getErrorMessage = (issue: z.ZodIssue, fieldNameOverride?: string, namespace = 'registerPage'): string => {
    const field = fieldNameOverride ?? issue.path[0];

    if (issue.code === 'too_small' && issue.minimum === 1 && issue.type === 'string') {
        return i18next.t(`${namespace}:validation.required`);
    }

    switch (field) {
        case 'username':
            if (issue.code === 'too_small') {
                return i18next.t(`${namespace}:validation.usernameMin`, { min: issue.minimum });
            }
            break;

        case 'email':
            if (issue.code === 'invalid_string' && issue.validation === 'email') {
                return i18next.t(`${namespace}:validation.invalidEmail`);
            }
            break;

        case 'password':
            if (issue.code === 'too_small') {
                return i18next.t(`${namespace}:validation.passwordMin`, { min: issue.minimum });
            }
            break;
    }

    return issue.message || i18next.t(`${namespace}:validation.invalidField`);
};
