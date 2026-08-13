// src/app/router.tsx
import { SystemsGridPage } from '@/services/systems/components/systemGridPage/systemGridPage';
import { usersService } from '@/services/users/api/usersApi';
import { RegisterPage } from '@/services/users/components/registerPage/registerPage';
import { AUTH_USER_QUERY_KEY, authUserQueryOptions } from '@/services/users/hooks/useMe';
import { Box, CircularProgress } from '@mui/material';
import { createRootRouteWithContext, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router';
import { LoginPage } from '../services/users/components/loginForm/loginForm';
import { queryClient } from './api/queryClient';
import { AppLayout } from './components/AppLayout/AppLayout';
import { SafeUserDocument } from './types/user-interfaces';
import { UserRole } from '@whats-down/shared/common';

export interface RouterContext {
    user?: SafeUserDocument | null;
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
    component: () => <Outlet />,
});

const tryLoadUser = async (): Promise<SafeUserDocument | null> => {
    try {
        return await queryClient.ensureQueryData(authUserQueryOptions);
    } catch {
        return null;
    }
};


const guestLayoutRoute = createRoute({
    id: 'guest-layout',
    getParentRoute: () => rootRoute,
    beforeLoad: async () => {
        const user = await tryLoadUser();
        if (user) {
            throw redirect({ to: '/' });
        }
    },
    component: Outlet,
});

const loginRoute = createRoute({
    path: '/login',
    getParentRoute: () => guestLayoutRoute,
    component: LoginPage,
});

const registerRoute = createRoute({
    path: '/register',
    getParentRoute: () => guestLayoutRoute,
    component: RegisterPage,
});

const authLayoutRoute = createRoute({
    id: 'auth-layout',
    getParentRoute: () => rootRoute,
    beforeLoad: async () => {
        const user = await tryLoadUser();
        if (!user) {
            throw redirect({ to: '/login'});
        }
        return { user };
    },
    pendingComponent: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <CircularProgress size={40} />
        </Box>
    ),
    component: Outlet,
});

const appShellRoute = createRoute({
    id: 'app-shell',
    getParentRoute: () => authLayoutRoute,
    component: AppLayout,
});

const homeRoute = createRoute({
    path: '/',
    getParentRoute: () => appShellRoute,
    component: SystemsGridPage,
});

const systemRoute = createRoute({
    path: '/systems/$id',
    getParentRoute: () => appShellRoute,
    component: SystemsGridPage,
});

const adminLayoutRoute = createRoute({
    id: 'admin-layout',
    getParentRoute: () => appShellRoute,
    beforeLoad: ({ context }) => {
        if (context.user?.role !== UserRole.ADMIN) { 
            throw redirect({ to: '/' });
        }
    },
    component: Outlet,
});

const adminUsersRoute = createRoute({
    path: '/admin/users',
    getParentRoute: () => adminLayoutRoute,
    component: () => null, // TODO: <ManageUsersPage />
});

const catchAllRoute = createRoute({
    path: '$',
    getParentRoute: () => rootRoute,
    beforeLoad: () => {
        throw redirect({ to: '/' });
    },
});

const routeTree = rootRoute.addChildren([
    guestLayoutRoute.addChildren([loginRoute, registerRoute]),
    authLayoutRoute.addChildren([appShellRoute.addChildren([homeRoute, systemRoute, adminLayoutRoute.addChildren([adminUsersRoute])])]),
    catchAllRoute,
]);

export const router = createRouter({
    routeTree,
    context: { user: undefined },
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}