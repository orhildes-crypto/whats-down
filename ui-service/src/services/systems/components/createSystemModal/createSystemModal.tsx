import { GenericModal } from '@/shared/components/GenericModal/GenericModal';
import { Box, Button, CircularProgress, TextField, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { SYSTEM_MAX_NAME_LENGTH, SYSTEM_MIN_NAME_LENGTH, SystemStatus, createSystemBodySchema } from '@whats-down/shared/common';
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
    const [status, setStatus] = useState<SystemStatus>(SystemStatus.UP);
    const [error, setError] = useState<string | null>(null);

    const { mutateAsync: createSystemAsync, isPending } = useCreateSystem();

    const handleClose = () => {
        setName('');
        setStatus(SystemStatus.UP);
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        const result = createSystemBodySchema.safeParse({ name, parentId, status });

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

        try {
            await createSystemAsync({ name: result.data.name, parentId, status: result.data.status });
            handleClose();
        } catch (err) {}
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

            <FormControl fullWidth disabled={isPending} sx={{ mt: 1 }}>
                <InputLabel id="system-status-select-label">{t('statusLabel')}</InputLabel>
                <Select
                    labelId="system-status-select-label"
                    id="system-status-select"
                    value={status}
                    label={t('statusLabel')}
                    onChange={(e) => setStatus(e.target.value as SystemStatus)}
                >
                    {Object.values(SystemStatus).map((statusValue) => (
                        <MenuItem key={statusValue} value={statusValue}>
                            {statusValue}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </GenericModal>
    );
};
