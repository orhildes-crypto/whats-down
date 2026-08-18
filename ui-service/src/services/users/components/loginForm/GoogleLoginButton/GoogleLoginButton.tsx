import { Box, Typography } from '@mui/material';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginWithGoogle } from '../hooks/useLoginWithGoogle';
import * as styles from './GoogleLoginButton.styles';
import { router } from '@/shared/router';

export const GoogleLoginButton: React.FC = () => {
    const navigate = router.navigate;
    const { mutate: loginWithGoogle, error } = useLoginWithGoogle();

    const { t } = useTranslation('loginForm');

    const handleSuccess = (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            return;
        }

        loginWithGoogle(credentialResponse.credential, {
            onSuccess: () => {
                navigate({to: '/', replace: true });
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
