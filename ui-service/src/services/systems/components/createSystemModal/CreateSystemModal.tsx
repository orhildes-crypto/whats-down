import { GenericModal } from '@/shared/components/GenericModal/GenericModal';
import type { TFunction } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import styles from './CreateSystemModal.module.css';
import { useCreateSystem } from './useCreateSystem';
import { SYSTEM_MIN_NAME_LENGTH, SYSTEM_MAX_NAME_LENGTH } from '@whats-down/shared/common';

const createSystemSchema = (t: TFunction<'createSystemModal'>) =>
    z.object({
        name: z
            .string()
            .min(SYSTEM_MIN_NAME_LENGTH, t('nameTooShort', { min: SYSTEM_MIN_NAME_LENGTH }))
            .max(SYSTEM_MAX_NAME_LENGTH, t('nameTooLong', { max: SYSTEM_MAX_NAME_LENGTH })),
    });

type CreateSystemModalProps = {
    isOpen: boolean;
    onClose: () => void;
    parentId: string | null;
};

export const CreateSystemModal = ({ isOpen, onClose, parentId }: CreateSystemModalProps) => {
    const { t } = useTranslation('createSystemModal');

    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { mutate: createSystem, isPending } = useCreateSystem();

    const handleClose = () => {
        setName('');
        setError(null);
        onClose();
    };

    const handleSubmit = () => {
        const schema = createSystemSchema(t);
        const result = schema.safeParse({ name });

        if (!result.success) {
            setError(result.error.issues[0]!.message);
            return;
        }

        setError(null);

        createSystem(
            { payload: { name: result.data.name, parentId } },
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
            title={t('title')}
            confirmButton={
                <button type="button" className={styles.confirmButton} onClick={handleSubmit} disabled={isPending}>
                    {isPending ? t('submitting') : t('submitButton')}
                </button>
            }
        >
            <div className={styles.field}>
                <label htmlFor="system-name" className={styles.label}>
                    {t('systemName')}
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
