import React from "react";
import { Box, Typography } from "@mui/material";
import { noData } from '@assets/images';

const NoItemFound = () => {
    return (
        <Box textAlign="center" my={10}>
        <img src={noData} alt="Empty Cart" width="150" />
        <Typography variant='subtitle1' my={1}>
            Sorry! No product match your criteria
        </Typography>
        <Typography variant='subtitle1' fontSize={14} my={1}>
            Try adjusting your search or filter to find what you're looking for.
        </Typography>
    </Box>
    )
}

export default NoItemFound;