import { lazy } from 'react';
import GuestGuard from 'utils/route-guard/GuestGuard';
import { Outlet } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';

const AuthLogin = Loadable(lazy(() => import('views/application/authentication/Login')));

const LoginRoutes = {
    path: '/',
    element: (
        <GuestGuard>
            <Outlet />
        </GuestGuard>
    ),
    children: [
        {
            path: '/login',
            element: <AuthLogin />
        }
    ]
};

export default LoginRoutes;
