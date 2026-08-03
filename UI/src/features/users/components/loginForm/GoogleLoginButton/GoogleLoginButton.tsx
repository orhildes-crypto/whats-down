import React from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useLoginWithGoogle } from '../hooks/useLoginWithGoogle';
import styles from './GoogleLoginButton.module.css';

export const GoogleLoginButton: React.FC = () => {
    const navigate = useNavigate();
    const { mutate: loginWithGoogle, error } = useLoginWithGoogle();

    const handleSuccess = (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            return;
        }

        loginWithGoogle(credentialResponse.credential, {
            onSuccess: () => {
                navigate('/', { replace: true });
            },
        });
    };

    return (
        <div className={styles.container}>
            <GoogleLogin
                onSuccess={handleSuccess}
            />
            {error && (
                <p className={styles.errorText}>
                    ההתחברות עם Google נכשלה. ודא שיש לך חשבון רשום במערכת.
                </p>
            )}
        </div>
    );
};
