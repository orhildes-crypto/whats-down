import { useLogout } from '@/services/users/hooks/useLogout';
import { useMe } from '@/services/users/hooks/useMe';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '../LanguageToggle/LanguageToggle';
import * as styles from './Navbar.styles';

export const Navbar: React.FC = () => {
    const { data: user } = useMe();
    const { mutate: logout, isPending } = useLogout();

    const { t } = useTranslation('navbar');

    const handleLogout = () => {
        logout();
    };

    return (
        <Box component="nav" sx={styles.navbarStyle}>
            <Box sx={styles.startSideStyle}>
                {user && (
                    <Typography component="span" sx={styles.welcomeTextStyle}>
                        {t('welcome', { username: user.username })}
                    </Typography>
                )}
            </Box>

            <Box sx={styles.centerStyle}>
                <Typography component="h1" sx={styles.titleStyle}>
                    What's Down
                </Typography>
            </Box>

            <Box sx={styles.endSideStyle}>
                <Box>
                    <LanguageToggle />
                </Box>
                <Button
                    type="button"
                    variant="outlined"
                    onClick={handleLogout}
                    disabled={isPending}
                    startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={styles.logoutButtonStyle}
                >
                    {isPending ? t('logoutPending') : t('logoutButton')}
                </Button>
            </Box>
        </Box>
    );
};
