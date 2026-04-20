import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const CollapsibleSeoFooterLinks = ({ footerSeo, titleKey }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const collapseContent = () => {
        setIsCollapsed(prev => !prev)
    }

    return (
        <Box className='seoLinkWrapper'>
            <Box className="seoHeader" onClick={collapseContent}>
                <Typography className='sectionTitle'>
                    {titleKey}
                </Typography>

                <FontAwesomeIcon icon={isCollapsed ? faPlus : faMinus} color="#fff" fontSize={12} />
            </Box>
            <Box className={['seoLinksWrapper', isCollapsed ? "collapsed" : ""].join(" ")}>
                {
                    footerSeo[titleKey].map((data) => {
                        return (<Link
                            key={data.url_text}
                            to={`/products/${data.canonical_url}`}
                            title={data.url_text}>
                            {data.url_text}
                        </Link>)
                    })
                }
            </Box>
        </Box>
    )
}

export default CollapsibleSeoFooterLinks;