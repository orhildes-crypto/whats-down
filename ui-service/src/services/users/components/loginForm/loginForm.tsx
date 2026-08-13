import React from 'react';
import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
} from '@mui/material';
import { LanguageToggle } from '@/shared/components/LanguageToggle/LanguageToggle';
import { router } from '@/shared/router';
import { GoogleLoginButton } from './GoogleLoginButton/GoogleLoginButton';
import { useLogin } from './hooks/useLogin';
import * as styles from './LoginForm.styles';

export const LoginPage: React.FC = () => {
    const { t } = useTranslation('loginForm');
    const navigate = router.navigate;
    const { mutateAsync: login, isPending, error } = useLogin();

    const form = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
        onSubmit: async ({ value }) => {
            await login(value);
            navigate({ to: '/' });
        },
    });

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

                <Box
                    component="form"
                    sx={styles.formStyle}
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <form.Field
                        name="username"
                        children={(field) => (
                            <TextField
                                id={field.name}
                                name={field.name}
                                label={t('username')}
                                variant="outlined"
                                fullWidth
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                disabled={isPending}
                            />
                        )}
                    />

                    <form.Field
                        name="password"
                        children={(field) => (
                            <TextField
                                id={field.name}
                                name={field.name}
                                type="password"
                                label={t('password')}
                                variant="outlined"
                                fullWidth
                                autoComplete="current-password"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                disabled={isPending}
                            />
                        )}
                    />

                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!canSubmit || isPending || isSubmitting}
                                startIcon={
                                    isPending ? (
                                        <CircularProgress size={18} color="inherit" />
                                    ) : null
                                }
                                sx={styles.submitButtonStyle}
                            >
                                {isPending ? t('logingIn') : t('loginButton')}
                            </Button>
                        )}
                    />
                </Box>

                <GoogleLoginButton />

                <Box sx={styles.registerSectionStyle}>
                    <Typography sx={styles.registerTextStyle}>{t('registerText')}</Typography>

                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate({ to: '/register' })}
                        sx={styles.registerButtonStyle}
                    >
                        {t('registerLink')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};