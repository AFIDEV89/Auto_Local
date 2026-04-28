import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';

// constant
const headerSX = {
    padding: 2,
    '& .MuiCardHeader-action': { mr: 0 }
}

const MainCard = ({
    children,
    content = true,
    contentClass = '',
    secondary,
    title,
    ...others
}) => {
    return (
        <Card {...others}>
            {title && <CardHeader sx={headerSX} title={title} action={secondary} />}
            {title && <Divider />}
            {content && (
                <CardContent className={contentClass}>
                    {children}
                </CardContent>
            )}
            {!content && children}
        </Card>
    );
}


MainCard.propTypes = {
    children: PropTypes.node,
    content: PropTypes.bool,
    contentClass: PropTypes.string,
    secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

export default MainCard;
