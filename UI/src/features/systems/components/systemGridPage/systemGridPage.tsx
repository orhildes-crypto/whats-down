import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMe } from '../../../users/hooks/useMe';
import { useSystems } from '../../hooks/useSystems';
import { SystemCube } from '../systemCube/systemCube';
import { Spinner } from '../../../../shared/components/Spinner/Spinner';
import { ErrorPage } from '../../../../shared/components/ErrorPage/ErrorPage';
import styles from './systemGridPage.module.css';
import { CreateSystemModal } from '../createSystemModal/CreateSystemModal';
import { useGetById } from '../../hooks/useGetById';
import { useAncestors } from '../../hooks/useAncestors';
import { Breadcrumbs, type BreadcrumbItem } from '../Breadcrumbs/Breadcrumbs';
import { useTranslation } from 'react-i18next';

export const SystemsGridPage: React.FC = () => {
    const { t } = useTranslation('systemsPage');

    const { id } = useParams<{ id?: string }>();
    const parentId = id ?? null;

    const { data: user, isLoading: isUserLoading } = useMe();
    const { data: parentSystem, isLoading: isParentSystemLoading } = useGetById(parentId);
    const { data: ancestors, isLoading: isAncestorsLoading } = useAncestors(parentId);
    const { data: systems, isLoading: isSystemsLoading, isError, refetch } = useSystems({ parentId, step: 0 });

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
                <Spinner size="lg" />
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
                <div className={styles.breadcrumbsSkeleton}>{t('loadingBreacrumbs')}</div>
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
            {(user.role === 'ADMIN' || user.role === 'EDITOR') && (
                <button type="button" className={styles.addButton} onClick={() => openCreateModal(parentId)}>
                    ➕ {t(`addSystemButton`)}
                </button>
            )}

            <CreateSystemModal isOpen={createModalState.isOpen} onClose={closeCreateModal} parentId={createModalState.parentId} />
        </div>
    );
};
