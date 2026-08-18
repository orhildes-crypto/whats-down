import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import { useTranslation } from 'react-i18next';
import * as styles from './ErrorPage.styles';

interface ErrorPageProps {
    message?: string;
    onRetry?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ message, onRetry }) => {
    const { t } = useTranslation('errorPage');

    return (
        <Box sx={styles.containerStyle}>
            <CancelIcon sx={styles.iconStyle} />

            <Typography component="h2" sx={styles.titleStyle}>
                {t('title')}
            </Typography>

            <Typography sx={styles.messageStyle}>
                {message ? message : t('defaultMessage')}
            </Typography>

            {onRetry && (
                <Button
                    type="button"
                    variant="outlined"
                    onClick={onRetry}
                    sx={styles.retryButtonStyle}
                >
                    {t('displayMessage')}
                </Button>
            )}
        </Box>
    );
};