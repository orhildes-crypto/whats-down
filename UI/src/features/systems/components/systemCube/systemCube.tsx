import React from 'react';
import { type SystemCubeDTO } from '../../../../shared/types/system-interfaces';
import styles from './systemCube.module.css';

export interface SystemCubeProps {
    system: SystemCubeDTO;
    role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export const SystemCube: React.FC<SystemCubeProps> = ({ system, role }) => {
    const isUp = system.status === 'UP';

    const containerStatusClass = isUp ? styles.statusUp : styles.statusDown;
    const badgeStatusClass = isUp ? styles.badgeUp : styles.badgeDown;

    return (
        <div className={`${styles.cubeContainer} ${containerStatusClass}`}>
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

            <div className={styles.cubeActions}>{/* לוגיקת כפתורים בהמשך */}</div>
        </div>
    );
};
