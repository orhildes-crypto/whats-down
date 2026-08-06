import { type SystemCubeDTO } from '@/shared/types/system-interfaces';
import { formatDate } from '@/shared/utils/formatDate';
import { SystemStatus, UserRole } from '@whats-down/shared/common';
import { PencilLine, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DeleteSystemModal } from '../deleteSystemModal/deleteSystemModal';
import { useChangeStatus } from './hooks/useChangeStatus';
import { useRename } from './hooks/useRename';
import styles from './systemCube.module.css';

export interface SystemCubeProps {
    system: SystemCubeDTO;
    role: UserRole;
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

    const isUp = system.status === SystemStatus.UP;
    const canEdit = role === UserRole.ADMIN || role === UserRole.EDITOR;

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

            const newStatus = isUp ? SystemStatus.DOWN : SystemStatus.UP;
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
                    <span className={styles.infoLabel}>{formatDate(system.createdAt)}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t('statusUpdateTime')}</span>
                    <span className={styles.infoLabel}>{formatDate(system.statusUpdatedAt)}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>{t('createdByUsername')}</span>
                    <span className={styles.infoLabel}>{system.createdByUsername}</span>
                </div>
            </div>

            <div className={styles.footerContainer}>
                <div className={styles.changeStatusMessage}>{system.hasChildren ? t('watchChildrenMessage') : canEdit ? t('changeStatusMessage'): ''}</div>
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
                            <PencilLine size={16} color='#34383b'/>
                        </button>
                    )}

                    {role === UserRole.ADMIN && (
                        <button
                            type="button"
                            className={styles.actionButton}
                            aria-label="delete"
                            onClick={() => {
                                openDeleteModal()
                            }}
                        >
                            <Trash2 size={16} color='#34383b'/>
                        </button>
                    )}

                    {canEdit && (
                        <button type="button" className={styles.actionButton} aria-label="create" onClick={onAddChild}>
                            <Plus size={16} color='#34383b'/>
                        </button>
                    )}
                </div>
            </div>
            <DeleteSystemModal 
                isOpen={isDeleteModalOpen} 
                onClose={closeDeleteModal} 
                system={system} />
        </div>
    );
};
