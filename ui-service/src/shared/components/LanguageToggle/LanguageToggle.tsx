import { changeLanguage } from '@/i18n';
import { Button } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from './LanguageToggle.styles';

export const LanguageToggle: React.FC = () => {
    const { i18n } = useTranslation();
    const isHebrew = i18n.language === 'he';

    const handleToggle = () => {
        changeLanguage(isHebrew ? 'en' : 'he');
    };

    return (
        <Button type="button" variant="contained" onClick={handleToggle} sx={styles.toggleButtonStyle}>
            {isHebrew ? 'english' : 'עברית'}
        </Button>
    );
};
