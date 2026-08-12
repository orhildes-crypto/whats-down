import { useAncestors } from '@/services/systems/hooks/useAncestors';
import { useGetById } from '@/services/systems/hooks/useGetById';
import { useSystems } from '@/services/systems/hooks/useSystems';
import { useMe } from '@/services/users/hooks/useMe';
import { ErrorPage } from '@/shared/components/ErrorPage/ErrorPage';
import { Spinner } from '@/shared/components/Spinner/Spinner';
import { UserRole } from '@whats-down/shared/common';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Breadcrumbs, type BreadcrumbItem } from '../Breadcrumbs/Breadcrumbs';
import { CreateSystemModal } from '../createSystemModal/createSystemModal';
import { SystemCube } from '../systemCube/systemCube';
import styles from './systemGridPage.module.css';

export const SystemsGridPage: React.FC = () => {
    const { t } = useTranslation('systemsPage');

    const { id } = useParams<{ id?: string }>();
    const parentId = id ?? null;

    const { data: user, isLoading: isUserLoading } = useMe();
    const { data: parentSystem, isLoading: isParentSystemLoading } = useGetById(parentId);
    const { data: ancestors, isLoading: isAncestorsLoading } = useAncestors(parentId);
    const { data: systems, isLoading: isSystemsLoading, isError, refetch } = useSystems({ parentId: parentId ?? undefined, step: 0 });

    const items: BreadcrumbItem[] = ancestors ? [...ancestors].reverse().map((anc) => ({ id: anc._id, name: anc.name })) : [];

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
            <div className={styles.centeredState}>
                <Spinner size="lg" className={styles.spinner}/>
                <p className={styles.loadingText}>{t('loadingSystem')}</p>
            </div>
        );
    }

    if (isError) {
        return <ErrorPage message={t('loadingError')} onRetry={refetch} />;
    }

    if (!user) {
        return <ErrorPage message={t('userError')} />;
    }

    const isEmpty = !systems || systems.length === 0;
    const isBreadcrumbsLoading = parentId ? isParentSystemLoading || isAncestorsLoading : false;

    return (
        <div className={styles.pageContainer}>
            {isBreadcrumbsLoading ? (
                <div className={styles.breadcrumbsSkeleton}>{t('loadingBreadcrumbs')}</div>
            ) : (
                <Breadcrumbs items={items} currentSystem={parentSystem ? { id: parentSystem._id, name: parentSystem.name } : null} />
            )}

            {isEmpty ? (
                <div className={styles.emptyState}>
                    <p>{t('emptyPage')}</p>
                </div>
            ) : (
                <main className={styles.grid}>
                    {systems.map((system) => (
                        <SystemCube key={system._id} system={system} role={user.role} onAddChild={() => openCreateModal(system._id)} />
                    ))}
                </main>
            )}
            {(user.role === UserRole.ADMIN || user.role === UserRole.EDITOR) && (
                <button type="button" className={styles.addButton} onClick={() => openCreateModal(parentId)}>
                    <Plus size={16} color='#34383b'/> {t(`addSystemButton`)}
                </button>
            )}

            <CreateSystemModal isOpen={createModalState.isOpen} onClose={closeCreateModal} parentId={createModalState.parentId} />
        </div>
    );
};
