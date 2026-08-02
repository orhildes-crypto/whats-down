import React from 'react';
import { type SystemCubeDTO } from '../../../../shared/types/system-interfaces';
import styles from './systemCube.module.css';
import { useChangeStatus } from './hooks/useChangeStatus';
import { useNavigate } from 'react-router-dom';

export interface SystemCubeProps {
    system: SystemCubeDTO;
    role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export const SystemCube: React.FC<SystemCubeProps> = ({ system, role }) => {
    const navigate = useNavigate();

    const { mutate: changeStatus, isPending } = useChangeStatus();

    const isUp = system.status === 'UP';
    const canEdit = role === 'ADMIN' || role === 'EDITOR';

    const containerStatusClass = isUp ? styles.statusUp : styles.statusDown;
    const badgeStatusClass = isUp ? styles.badgeUp : styles.badgeDown;

    const handleStatusToggle = () => {
        if (system.hasChildren) {
            navigate(`/systems/${system._id}`);
        } else {
            if (!canEdit || isPending) return;

            const newStatus = isUp ? 'DOWN' : 'UP';
            changeStatus({ systemId: system._id, status: newStatus });
        }
    };

    return (
        <div className={`${styles.cubeContainer} ${containerStatusClass}`} onClick={handleStatusToggle}>
            <div className={`${styles.statusBadge} ${badgeStatusClass}`}>{system.status}</div>

            <div className={styles.cubeHeader}>
                <h3 className={styles.cubeTitle}>{system.name}</h3>
            </div>

            <div className={styles.cubeContent}>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>זמן יצירה:</span>
                    <span>{system.createdAt}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>עדכון סטטוס אחרון:</span>
                    <span>{system.statusUpdatedAt}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>יוצר:</span>
                    <span>{system.createdByUsername}</span>
                </div>
            </div>

            <div className={styles.footerContainer}>
                <div className={styles.cubeActions} onClick={(e) => e.stopPropagation()}>
                    {canEdit && (
                        <button
                            type="button"
                            className={styles.actionButton}
                            aria-label="שנה שם מערכת"
                            onClick={() => {
                                /* TODO: rename */
                            }}
                        >
                            ✏️
                        </button>
                    )}

                    {role === 'ADMIN' && (
                        <button
                            type="button"
                            className={styles.actionButton}
                            aria-label="מחק מערכת"
                            onClick={() => {
                                /* TODO: delete modal */
                            }}
                        >
                            🗑️
                        </button>
                    )}

                    {canEdit && (
                        <button
                            type="button"
                            className={styles.actionButton}
                            aria-label="הוסף מערכת חדשה"
                            onClick={() => {
                                /* TODO: create modal */
                            }}
                        >
                            ➕
                        </button>
                    )}
                </div>

                <div className={styles.changeStatusMessage}>{system.hasChildren ? 'לחץ כדי לצפות בילדים' : 'לחץ כדי לשנות סטטוס'}</div>
            </div>
        </div>
    );
};
