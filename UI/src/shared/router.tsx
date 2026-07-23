import { createBrowserRouter } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth';
import { RequireAdmin } from './components/RequireAdmin';
import { LoginPage } from '../features/users/components/loginForm/loginForm';
import { RegisterPage } from '../features/users/components/registerPage/registerPage';
import { SystemCube } from '../features/systems/components/systemCube/systemCube';
import type { SystemCubeDTO } from './types/system-interfaces';

const mockSystemUp: SystemCubeDTO = {
    _id: '66a123456789abcdef012345',
    name: 'Core Authentication Service',
    status: 'UP',
    createdBy: 'user_987',
    createdByUsername: 'alex_dev',
    parentId: null,
    hasChildren: true,
    createdAt: '2026-07-20 10:30',
    statusUpdatedAt: '2026-07-23 18:00',
};

// 2. נתוני דמי למערכת מושבתת (DOWN)
const mockSystemDown: SystemCubeDTO = {
    _id: '66a987654321fedcba543210',
    name: 'Payment Gateway Proxy',
    status: 'DOWN',
    createdBy: 'user_456',
    createdByUsername: 'dana_admin',
    parentId: '66a123456789abcdef012345',
    hasChildren: false,
    createdAt: '2026-07-15 14:15',
    statusUpdatedAt: '2026-07-23 18:12',
};

export const SystemCubePreview: React.FC = () => {
    return (
        <div style={{ display: 'flex', gap: '20px', padding: '24px', backgroundColor: '#f5f5f5' }}>
            {/* קובייה במצב UP */}
            <div style={{ width: '350px' }}>
                <SystemCube system={mockSystemUp} role="ADMIN" />
            </div>

            {/* קובייה במצב DOWN */}
            <div style={{ width: '350px' }}>
                <SystemCube system={mockSystemDown} role="ADMIN" />
            </div>
        </div>
    );
};

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
                element: <SystemCubePreview />,
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