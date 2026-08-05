import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../../i18n';
import styles from './LanguageToggle.module.css';

export const LanguageToggle: React.FC = () => {
    const { i18n } = useTranslation();
    const isHebrew = i18n.language === 'he';

    const handleToggle = () => {
        changeLanguage(isHebrew ? 'en' : 'he');
    };

    return (
        <button type="button" className={styles.toggleButton} onClick={handleToggle}>
            {isHebrew ? 'english' : 'עברית'}
        </button>
    );
};
