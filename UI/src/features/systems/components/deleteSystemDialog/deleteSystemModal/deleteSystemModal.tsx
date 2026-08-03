import { GenericModal } from '../../../../../shared/components/GenericModal/GenericModal';
import { useDeleteSystem } from './useDeleteSystem';
import styles from './deleteSystemModal.module.css';

type DeleteSystemModalProps = {
    isOpen: boolean;
    onClose: () => void;
    systemId: string;
    systemName: string;
};

export const DeleteSystemModal = ({ isOpen, onClose, systemId, systemName }: DeleteSystemModalProps) => {

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
            title={`מחיקת מערכת ${systemName}`}
            confirmButton={
                <button type="button" className={styles.confirmButton} onClick={handleSubmit} disabled={isPending}>
                    {isPending ? 'מוחק' : 'מחק מערכת'}
                </button>
            }
        >
            <div className={styles.validationMessage}>{`האם אתם בטוחים שאתם רוצים למחוק את המערכת ${systemName}?`}</div>
        </GenericModal>
    );
};
