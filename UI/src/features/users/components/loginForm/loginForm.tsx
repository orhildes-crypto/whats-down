import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { useLogin } from './useLogin';

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();

    const { mutateAsync: login, isPending, error } = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login({ username, password });
            navigate('/');
        } catch {
            // Error is already handeled
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>התחברות למערכת</h1>
                <p className={styles.subtitle}>הזן את פרטי ההתחברות שלך כדי להמשיך</p>

                {error && <div className={styles.errorMessage}>שם משתמש או סיסמה שגויים</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>
                            שם משתמש
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
                            סיסמה
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
                        {isPending ? 'מתחבר...' : 'התחבר'}
                    </button>
                </form>
            </div>
        </div>
    );
};
