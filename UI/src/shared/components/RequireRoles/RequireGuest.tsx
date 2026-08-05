import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '../../../features/users/hooks/useMe';

export const RequireGuest = () => {
    const { data: user } = useMe();

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
