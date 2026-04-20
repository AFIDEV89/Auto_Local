import { Navigate, useRoutes } from 'react-router-dom';

import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

export default function ThemeRoutes() {
    return useRoutes([
        { 
            path: '/', 
            element: <Navigate to="category" />
        }, 
        LoginRoutes, 
        MainRoutes
    ]);
}
