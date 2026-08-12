import { Box, Typography } from '@mui/material';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLoginWithGoogle } from '../hooks/useLoginWithGoogle';
import * as styles from './GoogleLoginButton.styles';

export const GoogleLoginButton: React.FC = () => {
    const navigate = useNavigate();
    const { mutate: loginWithGoogle, error } = useLoginWithGoogle();

    const { t } = useTranslation('loginForm');

    const handleSuccess = (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            return;
        }

        loginWithGoogle(credentialResponse.credential, {
            onSuccess: () => {
                navigate('/', { replace: true });
            },
        });
    };

    return (
        <Box sx={styles.containerStyle}>
            <GoogleLogin onSuccess={handleSuccess} />
            {error && (
                <Typography sx={styles.errorTextStyle}>
                    {t('googleErrorMessage')}
                </Typography>
            )}
        </Box>
    );
};
