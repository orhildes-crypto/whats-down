import { useSyncDocumentDir } from '@/i18n/useSyncDocumentDir';
import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { Navbar } from '../Navbar/Navbar';
import * as styles from './AppLayout.styles';

export const AppLayout: React.FC = () => {
    useSyncDocumentDir();

    return (
        <Box sx={styles.layoutContainerStyle}>
            <Navbar />
            <Box component="main" sx={styles.mainContentStyle}>
                <Outlet />
            </Box>
        </Box>
    );
};
