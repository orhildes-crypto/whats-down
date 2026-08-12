import { GenericModal } from '@/shared/components/GenericModal/GenericModal';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { SYSTEM_MAX_NAME_LENGTH, SYSTEM_MIN_NAME_LENGTH, createSystemBodySchema } from '@whats-down/shared/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateSystem } from './useCreateSystem';
import * as styles from './createSystemModal.styles';

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
        const result = createSystemBodySchema.safeParse({ name, parentId });

        if (!result.success) {
            const issue = result.error.issues[0];

            if (issue?.code === 'too_small') {
                setError(t('nameTooShort', { min: SYSTEM_MIN_NAME_LENGTH }));
            } else if (issue?.code === 'too_big') {
                setError(t('nameTooLong', { max: SYSTEM_MAX_NAME_LENGTH }));
            } else {
                setError(issue?.message || t('invalidInput'));
            }
            return;
        }
        setError(null);

        createSystem(
            { name: result.data.name, parentId },
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
