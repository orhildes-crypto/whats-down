import { LanguageToggle } from '@/shared/components/LanguageToggle/LanguageToggle';
import { type CreateLocalUserPayload } from '@/shared/types/user-interfaces';
import { getErrorMessage } from '@/shared/utils/zodErrorMessages';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { createLocalUserSchema } from '@whats-down/shared/common';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from './registerPage.styles';
import { useRegister } from './useRegister';
import { router } from '@/shared/router';

export const RegisterPage: React.FC = () => {
    const [registerData, setRegisterData] = useState<CreateLocalUserPayload>({ email: '', username: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState<boolean>(false);

    type FieldName = keyof CreateLocalUserPayload;

    const navigate = router.navigate;

    const { t } = useTranslation('registerPage');

    const { mutateAsync: register, isPending } = useRegister();

    const validateSingleField = (name: FieldName, value: unknown): string => {
        const fieldSchema = createLocalUserSchema.shape[name];

        if (!fieldSchema) return '';

        const result = fieldSchema.safeParse(value);

        if (!result.success) {
            if (!result.error.issues[0]) return '';

            return getErrorMessage(result.error.issues[0], name);
        }

        return '';
    };

    const validateForm = (): boolean => {
        const result = createLocalUserSchema.safeParse(registerData);

        if (result.success) {
            setErrors({});
            return true;
        } else {
            result.error.issues.forEach((issue) => {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [issue.path[0] as string]: getErrorMessage(issue),
                }));
            });

            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        await register(registerData);
        navigate({ to: '/login' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const fieldName = id as FieldName;
        setRegisterData({ ...registerData, [id]: value });

        const errorMessage = validateSingleField(fieldName, value);

        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: errorMessage,
        }));
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

                <Box component="form" sx={styles.formStyle} onSubmit={handleSubmit}>
                    <TextField
                        id="username"
                        name="username"
                        label={t('username')}
                        variant="outlined"
                        fullWidth
                        value={registerData.username}
                        onChange={handleChange}
                        error={Boolean(errors.username)}
                        helperText={errors.username}
                        disabled={isPending}
                    />

                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        label={t('email')}
                        variant="outlined"
                        fullWidth
                        value={registerData.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        disabled={isPending}
                    />

                    <TextField
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        label={t('password')}
                        variant="outlined"
                        fullWidth
                        value={registerData.password}
                        onChange={handleChange}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        disabled={isPending}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending}
                        startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : null}
                        sx={styles.submitButtonStyle}
                    >
                        {isPending ? t('registerPending') : t('registerButton')}
                    </Button>
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
