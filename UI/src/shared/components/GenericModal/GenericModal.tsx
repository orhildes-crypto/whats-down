import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './GenericModal.module.css';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    confirmButton: ReactNode;
};

export const GenericModal = ({ isOpen, onClose, title, children, confirmButton }: ModalProps) => {
    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="close"
                    >
                        &times;
                    </button>
                </div>

                <div className={styles.body}>{children}</div>

                <div className={styles.footer}>{confirmButton}</div>
            </div>
        </div>,
        document.body
    );
};