import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUsers } from '@/services/users/hooks/useUsers';
import { useChangeRole } from '@/services/users/hooks/useChangeRole';
import { useMe } from '@/services/users/hooks/useMe';
import { RoleSelect } from '../RoleSelect/RoleSelect';
import { ErrorPage } from '@/shared/components/ErrorPage/ErrorPage';
import { UserRole } from '@whats-down/shared/common';
import * as styles from './UsersTable.styles';

export const UsersTable: React.FC = () => {
    const { t } = useTranslation('manageUsers');
    const { data: currentUser } = useMe();
    const { data: users, isLoading, isError, refetch } = useUsers({ step: 0 });
    const { mutate: changeRole } = useChangeRole();

    if (isLoading) {
        return (
            <Box sx={styles.centeredStateStyle}>
                <CircularProgress size={40} />
            </Box>
        );
    }

    if (isError || !users) {
        return <ErrorPage onRetry={refetch} />;
    }

    const handleRoleChange = (userId: string, role: UserRole) => {
        changeRole({ userId, role });
    };

    return (
        <TableContainer component={Paper} sx={styles.tableContainerStyle}>
            <Table>
                <TableHead>
                    <TableRow sx={styles.headerRowStyle}>
                        <TableCell>{t('table.username')}</TableCell>
                        <TableCell>{t('table.email')}</TableCell>
                        <TableCell>{t('table.role')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => {
                        const isCurrentUser = user._id === currentUser?._id;

                        return (
                            <TableRow key={user._id} sx={isCurrentUser ? styles.currentUserRowStyle : styles.bodyRowStyle}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell sx={styles.secondaryCellStyle}>{user.email}</TableCell>
                                <TableCell>
                                    <RoleSelect value={user.role} disabled={isCurrentUser} onChange={(role) => handleRoleChange(user._id, role)} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
