import { GenericModal } from '@/shared/components/GenericModal/GenericModal';
import type { SystemDocument } from '@/shared/types/system-interfaces';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDeleteSystem } from './useDeleteSystem';
import * as styles from './deleteSystemModal.styles';

type DeleteSystemModalProps = {
    isOpen: boolean;
    onClose: () => void;
    system: SystemDocument;
};

export const DeleteSystemModal = ({ isOpen, onClose, system }: DeleteSystemModalProps) => {
    const { t } = useTranslation('deleteSystemModal');
    const { mutate: deleteSystem, isPending } = useDeleteSystem();

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = () => {
        deleteSystem(
            { systemId: system._id },
            {
                onSuccess: () => {
                    handleClose();
                },
            },
        );
    };

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={handleClose}
            title={t('title', { systemName: system.name })}
            confirmButton={
                <Button
                    type="button"
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isPending}
                    startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : null}
                    sx={styles.confirmButtonStyle}
                >
                    {isPending ? t('deleting') : t('confirmButton')}
                </Button>
            }
            cancelButton={
                <Button type="button" variant="contained" onClick={onClose} disabled={isPending} sx={styles.cancelButtonStyle}>
                    {t('cancelDelete')}
                </Button>
            }
        >
            <Box sx={styles.messageContainerStyle}>
                <Typography sx={styles.messageTypographyStyle}>
                    {t(system.hasChildren ? 'validationMessageWithChildren' : 'validationMessage', { systemName: system.name })}
                </Typography>
            </Box>
        </GenericModal>
    );
};
