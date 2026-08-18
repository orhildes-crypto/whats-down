import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { UsersTable } from './UsersTable/UsersTable';
import * as styles from './ManageUsersPage.styles';

export const ManageUsersPage: React.FC = () => {
    const { t } = useTranslation('manageUsers');
    const navigate = useNavigate();

    const handleBack = () => {
        navigate({ to: '/' });
    };

    return (
        <Box sx={styles.containerStyle}>
            <Typography component="h1" sx={styles.titleStyle}>
                {t('pageTitle')}
            </Typography>

            <UsersTable />

            <Button
                type="button"
                variant="contained"
                onClick={handleBack}
                startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                sx={styles.backButtonStyle}
            >
                {t('backButton')}
            </Button>
        </Box>
    );
};