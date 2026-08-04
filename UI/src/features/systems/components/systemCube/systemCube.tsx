import React, { useEffect, useRef, useState, useTransition } from 'react';
import { type SystemCubeDTO } from '../../../../shared/types/system-interfaces';
import styles from './systemCube.module.css';
import { useChangeStatus } from './hooks/useChangeStatus';
import { useNavigate } from 'react-router-dom';
import { useRename } from './hooks/useRename';
import { formatDate } from '../../../../shared/utils/formatDate';
import { DeleteSystemModal } from '../deleteSystemModal/deleteSystemModal';
import { useTranslation } from 'react-i18next';

export interface SystemCubeProps {
    system: SystemCubeDTO;
    role: 'ADMIN' | 'EDITOR' | 'VIEWER';
    onAddChild: () => void;
}

export const SystemCube: React.FC<SystemCubeProps> = ({ system, role, onAddChild }) => {
    const navigate = useNavigate();

    const { t } = useTranslation('systemCube');

    const { mutate: changeStatus, isPending: statusIsPending } = useChangeStatus();
    const { mutate: rename } = useRename();

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(system.name);
    const inputRef = useRef<HTMLInputElement>(null);

    const isUp = system.status === 'UP';
    const canEdit = role === 'ADMIN' || role === 'EDITOR';

    const containerStatusClass = isUp ? styles.statusUp : styles.statusDown;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    useEffect(() => {
        if (isEditingName && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditingName]);

    const handleStartEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditingName(true);
    };

    const handleSaveName = () => {
        const newName = nameValue.trim();
        if (newName && newName !== system.name) {
            rename(
                { systemId: system._id, newName: newName },
                {
                    onError: () => {
                        setNameValue(system.name);
                        setIsEditingName(false);
                    },
                    onSuccess: () => setIsEditingName(false),
                },
            );
        } else {
            setNameValue(system.name);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveName();
            setIsEditingName(false);
        } else if (e.key === 'Escape') {
            setNameValue(system.name);
            setIsEditingName(false);
        }
    };

    const handleStatusToggle = () => {
        if (isEditingName) return;

        if (system.hasChildren) {
            navigate(`/systems/${system._id}`);
        } else {
            if (!canEdit || statusIsPending) return;

            const newStatus = isUp ? 'DOWN' : 'UP';
            changeStatus({ systemId: system._id, status: newStatus });
        }
    };

    return (
        <div className={`${styles.cubeContainer} ${containerStatusClass}`} onClick={handleStatusToggle}>
            <div className={`${styles.statusBadge}`}>{system.status}</div>

            <div className={styles.cubeHeader}>
                {isEditingName ? (
                    <input
                        ref={inputRef}
                        type="text"
                        maxLength={35}
                        className={styles.titleInput}
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <h3 className={styles.cubeTitle}>{system.name}</h3>
                )}
            </div>

            <div className={styles.cubeContent}>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t('creationTime')}</span>
                    <span>{formatDate(system.createdAt)}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t('statusUpdateTime')}</span>
                    <span>{formatDate(system.statusUpdatedAt)}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t('createdByUsername')}</span>
                    <span>{system.createdByUsername}</span>
                </div>
            </div>

            <div className={styles.footerContainer}>
                <div className={styles.changeStatusMessage}>{system.hasChildren ? t('changeStatusMessage') : canEdit ? t('watchChildrenMessage'): ''}</div>
                <div className={styles.cubeActions} onClick={(e) => e.stopPropagation()}>
                    {canEdit && (
                        <button
                            type="button"
                            className={styles.actionButton}
                            aria-label="rename"
                            onClick={(e) => {
                                handleStartEdit(e);
                            }}
                        >
                            ✏️
                        </button>
                    )}

                    {role === 'ADMIN' && !system.hasChildren && (
                        <button
                            type="button"
                            className={styles.actionButton}
                            aria-label="delete"
                            onClick={() => {
                                openDeleteModal()
                            }}
                        >
                            🗑️
                        </button>
                    )}

                    {canEdit && (
                        <button type="button" className={styles.actionButton} aria-label="create" onClick={onAddChild}>
                            ➕
                        </button>
                    )}
                </div>
            </div>
            <DeleteSystemModal 
                isOpen={isDeleteModalOpen} 
                onClose={closeDeleteModal} 
                systemId={system._id} 
                systemName={system.name} />
        </div>
    );
};
