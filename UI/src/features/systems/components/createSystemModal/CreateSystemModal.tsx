import { useState } from 'react';
import { z } from 'zod';
import { GenericModal } from '../../../../shared/components/GenericModal/GenericModal';
import { useCreateSystem } from './useCreateSystem';
import styles from './CreateSystemModal.module.css';

const createSystemSchema = z.object({
    name: z
        .string()
        .min(3, 'שם המערכת חייב להכיל לפחות 3 תווים')
        .max(35, 'שם המערכת יכול להכיל עד 35 תווים'),
});

type CreateSystemModalProps = {
    isOpen: boolean;
    onClose: () => void;
    parentId: string | null;
};

export const CreateSystemModal = ({ isOpen, onClose, parentId }: CreateSystemModalProps) => {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { mutate: createSystem, isPending } = useCreateSystem();

    const handleClose = () => {
        setName('');
        setError(null);
        onClose();
    };

    const handleSubmit = () => {
        const result = createSystemSchema.safeParse({ name });

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setError(null);

        createSystem(
            { payload: { name: result.data.name, parentId }},
            {
                onSuccess: () => {
                    handleClose();
                },
            }
        );
    };

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={handleClose}
            title="הוספת מערכת חדשה"
            confirmButton={
                <button
                    type="button"
                    className={styles.confirmButton}
                    onClick={handleSubmit}
                    disabled={isPending}
                >
                    {isPending ? 'יוצר...' : 'צור מערכת'}
                </button>
            }
        >
            <div className={styles.field}>
                <label htmlFor="system-name" className={styles.label}>
                    שם המערכת
                </label>
                <input
                    id="system-name"
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                    autoFocus
                />
                {error && <span className={styles.error}>{error}</span>}
            </div>
        </GenericModal>
    );
};