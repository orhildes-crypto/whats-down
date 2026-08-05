import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Spinner.module.css';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClassMap = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
    const { t } = useTranslation('spinner');

    return (
        <div
            className={`${styles.spinner} ${sizeClassMap[size]} ${className}`}
            role="status"
        >
            <span className={styles.srOnly}>{t('displayMessage')}</span>
        </div>
    );
};
