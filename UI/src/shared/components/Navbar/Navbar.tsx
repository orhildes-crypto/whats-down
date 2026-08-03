import React from 'react';
import { useMe } from '../../../features/users/hooks/useMe';
import { useLogout } from '../../../features/users/hooks/useLogout';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
    const { data: user } = useMe();
    const { mutate: logout, isPending } = useLogout();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.side}>
                {user && <span className={styles.welcomeText}>{`ברוך שובך ${user.username}`}</span>}
            </div>

            <div className={styles.center}>
                <h1 className={styles.title}>{`What's Down`}</h1>
            </div>

            <div className={styles.side}>
                <button
                    type="button"
                    className={styles.logoutButton}
                    onClick={handleLogout}
                    disabled={isPending}
                >
                    {isPending ? 'מתנתק...' : 'התנתקות'}
                </button>
            </div>
        </nav>
    );
};
