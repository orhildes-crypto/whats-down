import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '../../../features/users/hooks/useMe';

export const RequireAdmin = () => {
    const { data: user } = useMe();

    if (user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
