import { createBrowserRouter } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth';
import { RequireAdmin } from './components/RequireAdmin';
import { LoginPage } from '../features/users/components/loginForm/loginForm';
import { RegisterPage } from '../features/users/components/registerPage/registerPage';
import { SystemsGridPage } from '../features/systems/components/systemGridPage/systemGridPage';

export default createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        element: <RequireAuth />,
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
                    }
                ]
            }
        ]
    }
])