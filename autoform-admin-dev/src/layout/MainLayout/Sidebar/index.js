import PropTypes from 'prop-types';
import { memo } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';

import PerfectScrollbar from 'react-perfect-scrollbar';

import MenuList from './MenuList';
import LogoSection from '../LogoSection';
import { openDrawer } from 'store/slices/menu';
import { useDispatch, useSelector } from 'store';
import { drawerWidth } from 'store/constant';

const Sidebar = ({ window }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);

    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <Box
            component="nav"
            sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }}
        >
            <Drawer
                container={container}
                variant={matchUpMd ? 'persistent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={() => dispatch(openDrawer(!drawerOpen))}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderRight: 'none',
                        [theme.breakpoints.up('md')]: {
                            top: '88px'
                        }
                    }
                }}
                ModalProps={{ keepMounted: true }}
                color="inherit"
            >
                {
                    drawerOpen && (<Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
                            <LogoSection />
                        </Box>
                    </Box>)
                }
                {
                    drawerOpen && (
                        <PerfectScrollbar
                            component="div"
                            style={{
                                height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
                                paddingLeft: '16px',
                                paddingRight: '16px'
                            }}
                        >
                            <MenuList />
                        </PerfectScrollbar>
                    )
                }
            </Drawer>
        </Box>
    );
};

Sidebar.propTypes = {
    window: PropTypes.object
};

export default memo(Sidebar);
