import { GenericModal } from '@/shared/components/GenericModal/GenericModal';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { SYSTEM_MAX_NAME_LENGTH, SYSTEM_MIN_NAME_LENGTH } from '@whats-down/shared/common';
import type { TFunction } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useCreateSystem } from './useCreateSystem';
import * as styles from './createSystemModal.styles';

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
                <Button
                    type="button"
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isPending}
                    startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : null}
                    sx={styles.confirmButtonStyle}
                >
                    {isPending ? t('submitting') : t('submitButton')}
                </Button>
            }
        >
            <Box sx={styles.formContainerStyle}>
                <TextField
                    id="system-name"
                    label={t('systemName')}
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                    error={Boolean(error)}
                    helperText={error || ' '}
                    autoFocus
                />
            </Box>
        </GenericModal>
    );
};
