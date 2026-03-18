import { Box, Skeleton } from "@mui/material";
import React from "react";

const Templates = {
    "full-width-card": () => {
        return (
            <Box my={4} display="flex">
                <Box mr={2}>
                    <Skeleton variant="rectangular" width={120} height={120} />
                </Box>
                <Box width="100%">
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Box>
            </Box>
        )
    }
}

const SkeletonLoader = ({
    type = "full-width-card",
    count = 1
}) => {
    const LoaderElement = Templates[type];

    return (<>
        {
            [...Array(count)].map((v, i) => <LoaderElement key={`loader-${i}`} />)
        }
    </>
    )
}

export default SkeletonLoader;