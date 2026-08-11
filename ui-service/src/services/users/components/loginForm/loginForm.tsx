import { LanguageToggle } from '@/shared/components/LanguageToggle/LanguageToggle';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GoogleLoginButton } from './GoogleLoginButton/GoogleLoginButton';
import styles from './LoginForm.module.css';
import { useLogin } from './hooks/useLogin';

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();

    const { mutateAsync: login, isPending, error } = useLogin();

    const { t } = useTranslation('loginForm');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        login(
            { username, password },
            {
                onSuccess: () => {
                    navigate('/');
                },
            },
        );
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.buttonContainer}>
                    <LanguageToggle />
                </div>
                <div className={styles.card}>
                    <h1 className={styles.title}>{t('title')}</h1>
                    <p className={styles.subtitle}>{t('subtitle')}</p>

                    {error && <div className={styles.errorMessage}>{t('loginError')}</div>}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="username" className={styles.label}>
                                {t('username')}
                            </label>
                            <input
                                id="username"
                                type="text"
                                className={styles.input}
                                required
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>
                                {t('password')}
                            </label>
                            <input
                                id="password"
                                type="password"
                                className={styles.input}
                                required
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={isPending}>
                            {isPending ? t('logingIn') : t('loginButton')}
                        </button>
                    </form>

                    <GoogleLoginButton />

                    <div className={styles.registerSection}>
                        <p className={styles.registerText}>{t('registerText')}</p>
                        <button type="button" className={styles.registerButton} onClick={() => navigate('/register')}>
                            {t('registerLink')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
