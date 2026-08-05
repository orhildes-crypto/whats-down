import { GenericModal } from '../../../../shared/components/GenericModal/GenericModal';
import { useDeleteSystem } from './useDeleteSystem';
import styles from './deleteSystemModal.module.css';
import { useTranslation } from 'react-i18next';

type DeleteSystemModalProps = {
    isOpen: boolean;
    onClose: () => void;
    systemId: string;
    systemName: string;
};

export const DeleteSystemModal = ({ isOpen, onClose, systemId, systemName }: DeleteSystemModalProps) => {
    const { t } = useTranslation('deleteSystemModal');
    const { mutate: deleteSystem, isPending } = useDeleteSystem();

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = () => {
        deleteSystem(
            { systemId: systemId },
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
            title={t('title', { systemName: systemName })}
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
            <div className={styles.validationMessage}>{t('validationMessage', { systemName: systemName })}</div>
        </GenericModal>
    );
};
