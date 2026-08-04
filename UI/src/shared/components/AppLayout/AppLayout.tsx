import React from 'react';
import { useSyncDocumentDir } from '../../../i18n/useSyncDocumentDir';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';
import styles from './AppLayout.module.css';

export const AppLayout: React.FC = () => {
    useSyncDocumentDir();
    return (
        <div className={styles.layoutContainer}>
            <Navbar />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};
