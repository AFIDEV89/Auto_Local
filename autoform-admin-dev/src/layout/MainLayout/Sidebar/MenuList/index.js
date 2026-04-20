import React, { memo } from 'react';
import { Typography } from '@mui/material';
import NavGroup from './NavGroup';
import menuItems from 'menu-items';
import { USER_TYPE } from 'constants/User';
import usePermission from 'hooks/usePermission';

const filterRoutesOnRole = (routesCollection = [], role = USER_TYPE.moderator) => {
    const routes = routesCollection.filter(routeGroup => {
        const children = routeGroup.children.filter(route => {
            return (!route.allowedRole || (route?.allowedRole?.length && route.allowedRole.includes(role)))
        });

        return children.length;
    })

    return [...routes];
}


const MenuList = () => {
    const { role } = usePermission();

    const filteredRoutes = filterRoutesOnRole(menuItems.items, role);

    const navItems = filteredRoutes.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

export default memo(MenuList);
