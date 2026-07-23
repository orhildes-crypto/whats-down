import { createBrowserRouter } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth';
import { RequireAdmin } from './components/RequireAdmin';
import { LoginPage } from '../features/users/components/loginForm/loginForm';
import { RegisterPage } from '../features/users/components/registerPage/registerPage';


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
                // element: <SystemGridPage />,
            },
            {
                path: '/systems/:id',
                // element: <SystemGridPage />,
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