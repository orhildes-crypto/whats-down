import { useMe } from '@/services/users/hooks/useMe';
import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';

export const RequireAuth = () => {
    const { data: user, isLoading, isError } = useMe();

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                }}
            >
                <CircularProgress size={40} />
            </Box>
        );
    }

    if (isError || !user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
