import { type SystemDocument } from '@/shared/types/system-interfaces';
import { formatDate } from '@/shared/utils/formatDate';
import AddIcon from '@mui/icons-material/AddOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { SYSTEM_MAX_NAME_LENGTH, SYSTEM_MIN_NAME_LENGTH, SystemStatus, UserRole } from '@whats-down/shared/common';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteSystemModal } from '../deleteSystemModal/deleteSystemModal';
import { useChangeStatus } from './hooks/useChangeStatus';
import { useRename } from './hooks/useRename';

import * as styles from './systemCube.styles';
import { router } from '@/shared/router';

export interface SystemCubeProps {
    system: SystemDocument;
    role: UserRole;
    onAddChild: () => void;
}

export const SystemCube: React.FC<SystemCubeProps> = ({ system, role, onAddChild }) => {
    const navigate = router.navigate;

    const { t } = useTranslation('systemCube');

    const { mutate: changeStatus, isPending: statusIsPending } = useChangeStatus();
    const { mutate: rename } = useRename();

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(system.name);
    const inputRef = useRef<HTMLInputElement>(null);

    const isUp = system.status === SystemStatus.UP;
    const canEdit = role === UserRole.ADMIN || role === UserRole.EDITOR;

    const statusStyle = system.status === SystemStatus.UP ? styles.STATUS_COLORS.up : styles.STATUS_COLORS.down;

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
            navigate({ to: `/systems/${system._id}` });
        } else {
            if (!canEdit || statusIsPending) return;

            const newStatus = isUp ? SystemStatus.DOWN : SystemStatus.UP;
            changeStatus({ systemId: system._id, status: newStatus });
        }
    };

    const infoRows = [
        { label: t('creationTime'), value: formatDate(system.createdAt) },
        { label: t('statusUpdateTime'), value: formatDate(system.statusUpdatedAt) },
        { label: t('createdByUsername'), value: system.createdByUsername },
    ];

    return (
        <Box onClick={handleStatusToggle} sx={styles.cubeContainerStyle(statusStyle)}>
            <Box sx={styles.statusBadgeStyle}>{system.status}</Box>

            <Box sx={{ marginTop: '25px', marginBottom: '6px' }}>
                {isEditingName ? (
                    <TextField
                        inputRef={inputRef}
                        size="small"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        slotProps={{
                            htmlInput: {
                                maxLength: SYSTEM_MAX_NAME_LENGTH,
                                minLength: SYSTEM_MIN_NAME_LENGTH,
                            },
                        }}
                        sx={styles.editTextFieldStyle}
                    />
                ) : (
                    <Typography component="h3" sx={styles.titleTypographyStyle}>
                        {system.name}
                    </Typography>
                )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '14px', gap: '7px' }}>
                {infoRows.map((row) => (
                    <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <Typography component="span" sx={styles.infoTextStyle}>
                            {row.label}
                        </Typography>
                        <Typography component="span" sx={styles.infoTextStyle}>
                            {row.value}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '12px' }}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                    {system.hasChildren ? t('watchChildrenMessage') : canEdit ? t('changeStatusMessage') : ''}
                </Typography>

                <Box sx={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                    {canEdit && (
                        <IconButton
                            aria-label="rename"
                            onClick={(e) => {
                                handleStartEdit(e);
                            }}
                            sx={styles.actionButtonStyle}
                        >
                            <EditIcon sx={styles.actionIconStyle} />
                        </IconButton>
                    )}

                    {role === UserRole.ADMIN && (
                        <IconButton
                            aria-label="delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal();
                            }}
                            sx={styles.actionButtonStyle}
                        >
                            <DeleteIcon sx={styles.actionIconStyle} />
                        </IconButton>
                    )}

                    {canEdit && (
                        <IconButton aria-label="create" onClick={onAddChild} sx={styles.actionButtonStyle}>
                            <AddIcon sx={styles.actionIconStyle} />
                        </IconButton>
                    )}
                </Box>
            </Box>

            <DeleteSystemModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} system={system} />
        </Box>
    );
};
