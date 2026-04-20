import React from "react";
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Typography } from '@mui/material';

import AuthLogin from './AuthLogin';
import MainCard from 'ui-component/cards/MainCard';

const Login = () => {
    const theme = useTheme();

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100vh", backgroundColor: (theme) => theme.palette.primary.light }}
        >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                <MainCard
                    sx={{
                        maxWidth: { xs: 400, lg: 475 },
                        margin: { xs: 2.5, md: 3 },
                        '& > *': {
                            flexGrow: 1,
                            flexBasis: '50%'
                        }
                    }}
                    content={false}
                >
                    <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                            <Typography variant='h2' color={theme.palette.secondary.main}>
                                Hi, Welcome Back
                            </Typography>
                            <Typography variant="caption">
                                Enter your credentials to continue
                            </Typography>
                        </Stack>
                        <AuthLogin />
                    </Box>
                </MainCard>
        </Grid>
        </Grid >
    );
};

export default Login;
