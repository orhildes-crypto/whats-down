import React from 'react';
import styles from './ErrorPage.module.css';
import { useTranslation } from 'react-i18next';

interface ErrorPageProps {
    message?: string;
    onRetry?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ message, onRetry }) => {
    const { t } = useTranslation('errorPage');
    return (
        <div className={styles.container}>
            <div className={styles.icon}>⚠️</div>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.message}>{message ? message : t('defaultMessage')}</p>
            {onRetry && (
                <button type="button" className={styles.retryButton} onClick={onRetry}>
                    {t('displayMessage')}
                </button>
            )}
        </div>
    );
};
