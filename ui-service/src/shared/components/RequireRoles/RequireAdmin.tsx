import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '../../../services/users/hooks/useMe';
import { UserRole } from '@whats-down/shared/common';

export const RequireAdmin = () => {
    const { data: user } = useMe();

    if (user?.role !== UserRole.ADMIN) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
