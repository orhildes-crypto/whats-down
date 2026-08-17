import { useParents } from '@/services/systems/hooks/useParents';
import { useGetById } from '@/services/systems/hooks/useGetById';
import { useSystems } from '@/services/systems/hooks/useSystems';
import { useMe } from '@/services/users/hooks/useMe';
import { ErrorPage } from '@/shared/components/ErrorPage/ErrorPage';
import { router } from '@/shared/router';
import { colors } from '@/theme/colorsConfig';
import AddIcon from '@mui/icons-material/Add';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box, Button, CircularProgress, Skeleton, Typography } from '@mui/material';
import { useParams } from '@tanstack/react-router';
import { UserRole } from '@whats-down/shared/common';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, type BreadcrumbItem } from '../Breadcrumbs/Breadcrumbs';
import { CreateSystemModal } from '../createSystemModal/createSystemModal';
import { SystemCube } from '../systemCube/systemCube';
import * as styles from './systemGridPage.styles';

export const SystemsGridPage: React.FC = () => {
    const { t } = useTranslation('systemsPage');
    const navigate = router.navigate;

    const { id } = useParams({ strict: false });
    const parentId = id ?? null;

    const { data: user, isLoading: isUserLoading } = useMe();
    const { data: parentSystem, isLoading: isParentSystemLoading } = useGetById(parentId);
    const { data: parents, isLoading: isParentsLoading } = useParents(parentId);
    const { data: systems, isLoading: isSystemsLoading, isError, refetch } = useSystems({ parentId: parentId ?? undefined, step: 0 });

    const items: BreadcrumbItem[] = parents ? [...parents].reverse().map((anc) => ({ id: anc._id, name: anc.name })) : [];

    const [createModalState, setCreateModalState] = useState<{
        isOpen: boolean;
        parentId: string | null;
    }>({
        isOpen: false,
        parentId: null,
    });

    const openCreateModal = (targetParentId: string | null) => {
        setCreateModalState({ isOpen: true, parentId: targetParentId });
    };

    const closeCreateModal = () => {
        setCreateModalState((prev) => ({ ...prev, isOpen: false }));
    };

    if (isUserLoading || isSystemsLoading) {
        return (
            <Box sx={styles.centeredStateStyle}>
                <CircularProgress size={48} sx={{ color: colors.text.onDark }} />
                <Typography sx={styles.loadingTextStyle}>{t('loadingSystem')}</Typography>
            </Box>
        );
    }

    if (isError) {
        return <ErrorPage message={t('loadingError')} onRetry={refetch} />;
    }

    if (!user) {
        return <ErrorPage message={t('userError')} />;
    }

    const isEmpty = !systems || !systems.length;
    const isBreadcrumbsLoading = parentId ? isParentSystemLoading || isParentsLoading : false;

    return (
        <Box sx={styles.pageContainerStyle}>
            {isBreadcrumbsLoading ? (
                <Skeleton variant="rounded" width={220} height={28} sx={{ marginBottom: '16px', backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
            ) : (
                <Breadcrumbs items={items} currentSystem={parentSystem ? { id: parentSystem._id, name: parentSystem.name } : null} />
            )}

            {isEmpty ? (
                <Box sx={styles.emptyStateStyle}>
                    <Typography>{t('emptyPage')}</Typography>
                </Box>
            ) : (
                <Box component="main" sx={styles.gridStyle}>
                    {systems.map((system) => (
                        <SystemCube key={system._id} system={system} role={user.role} onAddChild={() => openCreateModal(system._id)} />
                    ))}
                </Box>
            )}

            {(user.role === UserRole.ADMIN || user.role === UserRole.EDITOR) && (
                <Button
                    type="button"
                    variant="contained"
                    onClick={() => openCreateModal(parentId)}
                    startIcon={<AddIcon sx={{ color: colors.action.iconDefault, fontSize: 16 }} />}
                    sx={styles.addButtonStyle}
                >
                    {t('addSystemButton')}
                </Button>
            )}

            {user.role === UserRole.ADMIN && (
                <Button
                    type="button"
                    variant="contained"
                    onClick={() => navigate({ to: '/admin/users' })}
                    startIcon={<ManageAccountsIcon sx={{ color: colors.action.iconDefault, fontSize: 16 }} />}
                    sx={styles.manageUsersButtonStyle}
                >
                    {t('manageUsersButton')}
                </Button>
            )}

            <CreateSystemModal isOpen={createModalState.isOpen} onClose={closeCreateModal} parentId={createModalState.parentId} />
        </Box>
    );
};
