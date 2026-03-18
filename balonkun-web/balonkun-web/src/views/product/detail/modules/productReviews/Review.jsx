import React from "react";
import { Avatar, Box } from "@mui/material";
import { dateFormatter } from "@utils/date";

const Review = ({
    img,
    authorName,
    comment,
    time
}) => {
    return (
        <Box className="reviewBox" itemprop="review" itemscope="" itemtype="https://schema.org/Review">
            <Avatar
                alt={authorName}
                imgProps={{
                    loading: "lazy"
                }}
                src={img}
                sx={{ width: 56, height: 56 }}
            />
            <Box className="details">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <p className="author" itemprop="author">{authorName}</p>
                    <p className="time" itemprop="datePublished">{dateFormatter(time)}</p>
                </Box>

                <p className="comment" itemprop="reviewBody">{comment}</p>
            </Box>
        </Box>
    )
}

export default Review