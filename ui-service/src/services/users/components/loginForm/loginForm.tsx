import { LanguageToggle } from '@/shared/components/LanguageToggle/LanguageToggle';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleLoginButton } from './GoogleLoginButton/GoogleLoginButton';
import * as styles from './LoginForm.styles';
import { useLogin } from './hooks/useLogin';
import { router } from '@/shared/router';

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = router.navigate;

    const { mutateAsync: login, isPending, error } = useLogin();

    const { t } = useTranslation('loginForm');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        login(
            { username, password },
            {
                onSuccess: () => {
                    navigate({ to: '/' });
                },
            },
        );
    };

    return (
        <Box sx={styles.containerStyle}>
            <Box sx={styles.buttonContainerStyle}>
                <LanguageToggle />
            </Box>

            <Box sx={styles.cardStyle}>
                <Typography component="h1" sx={styles.titleStyle}>
                    {t('title')}
                </Typography>
                <Typography sx={styles.subtitleStyle}>{t('subtitle')}</Typography>

                {error && (
                    <Alert severity="error" sx={styles.errorMessageStyle}>
                        {t('loginError')}
                    </Alert>
                )}

                <Box component="form" sx={styles.formStyle} onSubmit={handleSubmit}>
                    <TextField
                        id="username"
                        label={t('username')}
                        variant="outlined"
                        required
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isPending}
                    />

                    <TextField
                        id="password"
                        label={t('password')}
                        type="password"
                        variant="outlined"
                        required
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isPending}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending}
                        startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : null}
                        sx={styles.submitButtonStyle}
                    >
                        {isPending ? t('logingIn') : t('loginButton')}
                    </Button>
                </Box>

                <GoogleLoginButton />

                <Box sx={styles.registerSectionStyle}>
                    <Typography sx={styles.registerTextStyle}>{t('registerText')}</Typography>
                    <Button type="button" variant="outlined" onClick={() => navigate({ to: '/register' })} sx={styles.registerButtonStyle}>
                        {t('registerLink')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
