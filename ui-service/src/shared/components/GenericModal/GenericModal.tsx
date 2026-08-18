import { type ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as styles from './GenericModal.styles';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    confirmButton: ReactNode;
    cancelButton?: ReactNode;
};

export const GenericModal = ({ isOpen, onClose, title, children, confirmButton, cancelButton }: ModalProps) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: styles.dialogPaperStyle,
                },
            }}
        >
            <DialogTitle component="div" sx={styles.dialogTitleStyle}>
                <Typography component="h2" sx={styles.titleTextStyle}>
                    {title}
                </Typography>
                <IconButton aria-label="close" onClick={onClose} sx={styles.closeButtonStyle}>
                    <CloseIcon sx={{ fontSize: '22px' }} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={styles.dialogContentStyle}>{children}</DialogContent>

            <DialogActions sx={styles.dialogActionsStyle}>
                {cancelButton}
                {confirmButton}
            </DialogActions>
        </Dialog>
    );
};
