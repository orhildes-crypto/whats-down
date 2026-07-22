import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '../../features/users/hooks/useMe';
import { Spinner } from './Spinner';

export const RequireAuth = () => {
    const { data: user, isLoading, isError } = useMe();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (isError || !user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};