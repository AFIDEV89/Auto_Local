import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, Container, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import navigation from 'menu-items';
import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';
import { openDrawer } from 'store/slices/menu';
import { useDispatch, useSelector } from 'store';
import { IconChevronRight } from '@tabler/icons';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter
        }),
        [theme.breakpoints.up('md')]: {
            marginLeft: -(drawerWidth - 20),
            width: `calc(100% - ${drawerWidth}px)`
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
            marginRight: '10px'
        }
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shorter
        }),
        marginLeft: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${drawerWidth}px)`,
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px'
        }
    })
}));

const MainLayout = () => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));

    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);
    const { container } = useConfig();

    useEffect(() => {
        dispatch(openDrawer(!matchDownMd));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownMd]);

    return (
        <Box display='flex'>
            <CssBaseline />
            <AppBar
                enableColorOnDark
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.default,
                    transition: drawerOpen ? theme.transitions.create('width') : 'none'
                }}
            >
                <Toolbar>
                    <Header />
                </Toolbar>
            </AppBar>

            <Sidebar />

            <Main theme={theme} open={drawerOpen}>
                {container && (
                    <Container maxWidth="lg">
                        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
                        <Outlet />
                    </Container>
                )}
                {!container && (
                    <>
                        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
                        <Outlet />
                    </>
                )}
            </Main>
        </Box>
    );
};

export default MainLayout;
