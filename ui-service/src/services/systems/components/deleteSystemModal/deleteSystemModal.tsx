import { GenericModal } from '../../../../shared/components/GenericModal/GenericModal';
import { useDeleteSystem } from './useDeleteSystem';
import styles from './deleteSystemModal.module.css';
import { useTranslation } from 'react-i18next';
import type { SystemCubeDTO } from '@/shared/types/system-interfaces';

type DeleteSystemModalProps = {
    isOpen: boolean;
    onClose: () => void;
    system: SystemCubeDTO;
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
                <button type="button" className={styles.confirmButton} onClick={handleSubmit} disabled={isPending}>
                    {isPending ? t('deleting') : t('confirmButton')}
                </button>
            }
            cancelButton={
                <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isPending}>
                    {t('cancelDelete')}
                </button>
            }
        >
            <div className={styles.validationMessage}>
                {t(system.hasChildren ? 'validationMessageWithChildren' : 'validationMessage', { systemName: system.name })}
            </div>
        </GenericModal>
    );
};
