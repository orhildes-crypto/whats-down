import React from 'react';
import styles from './ErrorPage.module.css';

interface ErrorPageProps {
    message?: string;
    onRetry?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
    message = 'לא הצלחנו לטעון את הנתונים',
    onRetry,
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.icon}>⚠️</div>
            <h2 className={styles.title}>משהו השתבש</h2>
            <p className={styles.message}>{message}</p>
            {onRetry && (
                <button type="button" className={styles.retryButton} onClick={onRetry}>
                    נסה שוב
                </button>
            )}
        </div>
    );
};