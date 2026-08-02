import React from 'react';
import { useParams } from 'react-router-dom';
import { useMe } from '../../../users/hooks/useMe';
import { useSystems } from '../../hooks/useSystems';
import { SystemCube } from '../systemCube/systemCube';
import { Spinner } from '../../../../shared/components/Spinner';
import { ErrorPage } from '../../../../shared/components/ErrorPage/ErrorPage';
import styles from './systemGridPage.module.css';

export const SystemsGridPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const parentId = id ?? null;

    const { data: user, isLoading: isUserLoading } = useMe();
    const { data: systems, isLoading: isSystemsLoading, isError, refetch } = useSystems({ parentId, step: 0 });

    if (isUserLoading || isSystemsLoading) {
        return (
            <div className={styles.centeredState}>
                <Spinner size="lg" />
                <p className={styles.loadingText}>טוען מערכות...</p>
            </div>
        );
    }

    if (isError) {
        return <ErrorPage message="לא הצלחנו לטעון את המערכות" onRetry={refetch} />;
    }

    if (!user) {
        return <ErrorPage message="לא הצלחנו לזהות את המשתמש המחובר" />;
    }

    const isEmpty = !systems || systems.length === 0;

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1 className={styles.pageTitle}>{parentId ? 'תת-מערכות' : 'עמוד הבית'}</h1>
                <h1 className={styles.pageTitle}>{`ברוך שובך, ${user.username}`}</h1>
                <button type="button" className={styles.addButton}>
                    ➕ הוסף מערכת
                </button>
            </header>

            {isEmpty ? (
                <div className={styles.emptyState}>
                    <p>אין מערכות כאן עדיין</p>
                </div>
            ) : (
                <main className={styles.grid}>
                    {systems.map((system) => (
                        <SystemCube key={system._id} system={system} role={user.role} />
                    ))}
                </main>
            )}
        </div>
    );
};
