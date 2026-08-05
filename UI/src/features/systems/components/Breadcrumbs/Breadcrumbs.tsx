import React from 'react';
import styles from './Breadcrumbs.module.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export type BreadcrumbItem = {
    id: string | null;
    name: string;
};
export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    currentSystem?: BreadcrumbItem | null;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, currentSystem }) => {
    const navigate = useNavigate();

    const { t } = useTranslation('systemCube');

    const isAtRoot = items.length === 0 && !currentSystem;

    const handleNavigate = (id: string | null) => {
        if (id) {
            navigate(`/systems/${id}`);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className={styles.breadcrumbsContainer} aria-label="Breadcrumb">
            {isAtRoot ? (
                <span className={styles.currentSystem}>{t('breadcrumbsHome')}</span>
            ) : (
                <span className={styles.breadcrumbLink} onClick={() => handleNavigate(null)}>
                    {t('breadcrumbsHome')}
                </span>
            )}
            {items.map((item) => (
                <React.Fragment key={item.id ?? 'root'}>
                    <span className={styles.separator}>{`=>`}</span>
                    <span className={styles.breadcrumbLink} onClick={() => handleNavigate(item.id)}>
                        {item.name}
                    </span>
                </React.Fragment>
            ))}

            {currentSystem && (
                <>
                    <span className={styles.separator}>{`=>`}</span>
                    <span className={styles.currentSystem}>{currentSystem.name}</span>
                </>
            )}
        </nav>
    );
};
