// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    ListItemIcon,
    Typography
} from '@mui/material';
// project imports
import LogoSection from '../LogoSection';
import MobileSection from './MobileSection';
import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';

// assets
import { IconLogout, IconMenu2 } from '@tabler/icons';
import { removeToken } from 'views/helpers/storageHelpers';
import { errorAlert, successAlert } from 'views/helpers';
import API from "../../../api/axios";
import { useNavigate } from 'react-router-dom';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const navigate = useNavigate();

    const theme = useTheme();
    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);

    const handleLogOut = async () => {
        try {
            const response = await API.put(`/user/logout`);
            if ((response && response.data && response.data.statusCode === 204) || response?.data?.statusCode === 401) {
                removeToken('token', '', 1);
                removeToken('role', '', 1);
                removeToken('accessToken', '', 1);
                successAlert(response.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                errorAlert(response.data.message);
            }

        } catch (error) {
            alert("Something went wrong");
        }
    };
    return (
        <>
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, alignItems: "center" }}>
                    <Typography variant='h3'>AutoForm Admin</Typography>
                </Box>
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        overflow: 'hidden',
                        transition: 'all .2s ease-in-out',
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                        color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                        '&:hover': {
                            background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                            color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
                        }
                    }}
                    onClick={() => dispatch(openDrawer(!drawerOpen))}
                    color="inherit"
                >
                    <IconMenu2 stroke={1.5} size="1.3rem" />
                </Avatar>
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />

            <ListItemIcon style={{ cursor: 'pointer' }} onClick={handleLogOut}>
                <IconLogout stroke={1.5} size="1.3rem" />
                <Typography variant="body2">Logout</Typography>
            </ListItemIcon>

            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <MobileSection />
            </Box>
        </>
    );
};

export default Header;
