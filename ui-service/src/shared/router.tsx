import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequireAuth } from './components/RequireRoles/RequireAuth';
import { RequireAdmin } from './components/RequireRoles/RequireAdmin';
import { LoginPage } from '../services/users/components/loginForm/loginForm';
import { RegisterPage } from '../services/users/components/registerPage/registerPage';
import { SystemsGridPage } from '../services/systems/components/systemGridPage/systemGridPage';
import { RequireGuest } from './components/RequireRoles/RequireGuest';
import { AppLayout } from './components/AppLayout/AppLayout';

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
