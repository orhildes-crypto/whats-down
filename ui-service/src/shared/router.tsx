import { SystemsGridPage } from '@/services/systems/components/systemGridPage/systemGridPage';
import { RegisterPage } from '@/services/users/components/registerPage/registerPage';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../services/users/components/loginForm/loginForm';
import { AppLayout } from './components/AppLayout/AppLayout';
import { RequireAdmin } from './components/RequireRoles/RequireAdmin';
import { RequireAuth } from './components/RequireRoles/RequireAuth';
import { RequireGuest } from './components/RequireRoles/RequireGuest';

export default createBrowserRouter([
    {
        element: <RequireGuest />,
        children: [
            {
                path: '/login',
                element: <LoginPage />,
            },
            {
                path: '/register',
                element: <RegisterPage />,
            },
        ],
    },
    {
        element: <RequireAuth />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        path: '/',
                        element: <SystemsGridPage />,
                    },
                    {
                        path: '/systems/:id',
                        element: <SystemsGridPage />,
                    },
                    {
                        element: <RequireAdmin />,
                        children: [
                            {
                                path: '/admin/users',
                                // element: <ManageUsersPage />
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
