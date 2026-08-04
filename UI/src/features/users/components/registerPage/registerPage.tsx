import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './registerPage.module.css';
import { useRegister } from './useRegister';
import { type CreateLocalUserPayload } from '../../../../shared/types/user-interfaces';
import { createLocalUserSchema } from '@whats-down/shared/common';
import { getErrorMessage } from '../../../../shared/utils/zodErrorMessages';
import { LanguageToggle } from '../../../../shared/components/LanguageToggle/LanguageToggle';
import { useTranslation } from 'react-i18next';

export const RegisterPage: React.FC = () => {
    const [registerData, setRegisterData] = useState<CreateLocalUserPayload>({ email: '', username: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const navigate = useNavigate();

    const { t } = useTranslation('registerPage');

    type FieldName = keyof CreateLocalUserPayload;

    const { mutateAsync: register, isPending, error } = useRegister();

    const validateSingleField = (name: FieldName, value: unknown): string => {
        const fieldSchema = createLocalUserSchema.shape[name];

        if (!fieldSchema) return '';

        const result = fieldSchema.safeParse(value);

        if (!result.success) {
            return getErrorMessage(result.error.issues[0], name);
        }

        return '';
    };

    const validateForm = (): boolean => {
        const result = createLocalUserSchema.safeParse(registerData);

        if (result.success) {
            setErrors({});
            return true;
        } else {
            result.error.issues.forEach((issue) => {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [issue.path[0]]: getErrorMessage(issue),
                }));
            });

            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await register(registerData);
            navigate('/login');
        } catch {
            // Error is already handeled
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const fieldName = id as FieldName;
        setRegisterData({ ...registerData, [id]: value });

        const errorMessage = validateSingleField(fieldName, value);

        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: errorMessage,
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttonContainer}>
                <LanguageToggle />
            </div>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>

                {error && <div className={styles.errorMessage}>{`t('registerError') - ${error.message}`}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>
                            {t('username')}
                        </label>
                        <input id="username" type="text" className={styles.input} value={registerData.username} onChange={handleChange} />
                        {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            {t('email')}
                        </label>
                        <input id="email" type="email" className={styles.input} value={registerData.email} onChange={handleChange} />
                        {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            {t('password')}
                        </label>
                        <div className={styles.passwordWrapper}>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className={`${styles.input} ${styles.passwordInput}`}
                                value={registerData.password}
                                onChange={handleChange}
                            />
                            <button type="button" className={styles.togglePasswordButton} onClick={() => setShowPassword((prev) => !prev)}>
                                {'👁️'}
                            </button>
                        </div>
                        {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isPending}>
                        {isPending ? t('registerPending') : t('registerButton')}
                    </button>
                </form>

                <div className={styles.loginSection}>
                    <p className={styles.loginText}>{t('loginText')}</p>
                    <button
                        type="button"
                        className={styles.loginButton}
                        onClick={() => {
                            navigate('/login');
                        }}
                    >
                        {t('loginLink')}
                    </button>
                </div>
            </div>
        </div>
    );
};
