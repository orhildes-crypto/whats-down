import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import { useRegister } from './useRegister';
import { type CreateLocalUserPayload } from '../../../../shared/types/user-interfaces';

export const RegisterPage: React.FC = () => {
    const [registerData, setRegisterData] = useState<CreateLocalUserPayload>({ email: '', username: '', password: '', role: 'VIEWER' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const navigate = useNavigate();

    const { mutateAsync: register, isPending, error } = useRegister();

    const validateForm = () => {
        let tempErrors: { username?: string; email?: string; password?: string } = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!registerData.username.trim()) {
            tempErrors.username = 'Username is required.';
        } else if (registerData.username.length < 3) {
            tempErrors.username = 'Username must be at least 3 characters.';
        }

        if (!registerData.email) {
            tempErrors.email = 'Email is required.';
        } else if (!emailRegex.test(registerData.email)) {
            tempErrors.email = 'Please enter a valid email address.';
        }

        if (!registerData.password) {
            tempErrors.password = 'Password is required.';
        } else if (registerData.password.length < 8) {
            tempErrors.password = 'Password must be at least 8 characters.';
        }

        setErrors(tempErrors);

        // Returns true if the errors object has no keys (form is valid)
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                await register(registerData);
                navigate('/login');
            } catch {
                // Error is already handeled
            }
        } else {
            // WHAT SHOULD HAPPEM HERE?
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setRegisterData({ ...registerData, [id]: value });

        if (errors[id]) {
            setErrors({ ...errors, [id]: '' });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>הרשמה למערכת</h1>
                <p className={styles.subtitle}>צור חשבון חדש כדי להתחיל</p>

                {error && <div className={styles.errorMessage}>{`could not register - ${error.message}`}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>
                            שם משתמש
                        </label>
                        <input id="username" type="text" className={styles.input} required value={registerData.username} onChange={handleChange} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            אימייל
                        </label>
                        <input id="email" type="email" className={styles.input} required value={registerData.email} onChange={handleChange} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            סיסמה
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={styles.input}
                            required
                            value={registerData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={isPending}>
                        {isPending ? 'נרשם...' : 'הרשם'}
                    </button>
                </form>

                <div className={styles.loginSection}>
                    <p className={styles.loginText}>כבר יש לך חשבון?</p>
                    <button
                        type="button"
                        className={styles.loginButton}
                        onClick={() => {
                            navigate('/login');
                        }}
                    >
                        התחברות למערכת
                    </button>
                </div>
            </div>
        </div>
    );
};
