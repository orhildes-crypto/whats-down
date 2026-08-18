import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { createLocalUserSchema } from '@whats-down/shared/common';
import { useTranslation } from 'react-i18next';
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { LanguageToggle } from '@/shared/components/LanguageToggle/LanguageToggle';
import { type CreateLocalUserPayload } from '@/shared/types/user-interfaces';
import { router } from '@/shared/router';
import { useRegister } from './useRegister';
import * as styles from './registerPage.styles';
import { formatFieldError } from '@/shared/utils/zodErrorMessages';

export const RegisterPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { t } = useTranslation('registerPage');
    const navigate = router.navigate;
    const { mutateAsync: register, isPending } = useRegister();

    const form = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
        } as CreateLocalUserPayload,
        validators: {
            onChange: createLocalUserSchema,
        },
        onSubmit: async ({ value }) => {
            await register(value);
            navigate({ to: '/login' });
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
                        children={(field) => {
                            const showFieldError = field.state.meta.isTouched || form.state.isSubmitted;
                            const rawError = showFieldError ? field.state.meta.errors[0] : undefined;
                            const errorMessage = formatFieldError(rawError, 'username');

                            return (
                                <TextField
                                    id={field.name}
                                    name={field.name}
                                    label={t('username')}
                                    variant="outlined"
                                    fullWidth
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={Boolean(errorMessage)}
                                    helperText={errorMessage}
                                    disabled={isPending}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            color: 'black',
                                        },
                                    }}
                                />
                            );
                        }}
                    />

                    <form.Field
                        name="email"
                        children={(field) => {
                            const showFieldError = field.state.meta.isTouched || form.state.isSubmitted;
                            const rawError = showFieldError ? field.state.meta.errors[0] : undefined;
                            const errorMessage = formatFieldError(rawError, 'email');

                            return (
                                <TextField
                                    id={field.name}
                                    name={field.name}
                                    type="email"
                                    label={t('email')}
                                    variant="outlined"
                                    fullWidth
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={Boolean(errorMessage)}
                                    helperText={errorMessage}
                                    disabled={isPending}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            color: 'black',
                                        },
                                    }}
                                />
                            );
                        }}
                    />

                    <form.Field
                        name="password"
                        children={(field) => {
                            const showFieldError = field.state.meta.isTouched || form.state.isSubmitted;
                            const rawError = showFieldError ? field.state.meta.errors[0] : undefined;
                            const errorMessage = formatFieldError(rawError, 'password');

                            return (
                                <TextField
                                    id={field.name}
                                    name={field.name}
                                    type={showPassword ? 'text' : 'password'}
                                    label={t('password')}
                                    variant="outlined"
                                    fullWidth
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    error={Boolean(errorMessage)}
                                    helperText={errorMessage}
                                    disabled={isPending}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            color: 'black',
                                        },
                                    }}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                        edge="end"
                                                        sx={{ color: 'black' }}
                                                    >
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            );
                        }}
                    />

                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!canSubmit || isPending || isSubmitting}
                                startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : null}
                                sx={styles.submitButtonStyle}
                            >
                                {isPending ? t('registerPending') : t('registerButton')}
                            </Button>
                        )}
                    />
                </Box>

                <Box sx={styles.loginSectionStyle}>
                    <Typography sx={styles.loginTextStyle}>{t('loginText')}</Typography>

                    <Button type="button" variant="outlined" onClick={() => navigate({ to: '/login' })} sx={styles.loginButtonStyle}>
                        {t('loginLink')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
