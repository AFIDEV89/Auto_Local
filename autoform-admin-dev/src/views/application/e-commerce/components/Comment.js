import { Box, Avatar } from "@mui/material";
import React from "react";
import { format } from "date-fns";

const Comment = ({
    image,
    comment,
    author,
    postTime
}) => {
    return (
        <Box display="flex" className="commentWrapper">
            <Avatar
                alt={author}
                imgProps={{
                    loading: "lazy"
                }}
                src={image}
            />
            <Box className="details">
                <p className="author">{author} - <span>{format(new Date(postTime), "E, MMM d yyyy")}</span></p>
                <p className="comment">{comment}</p>
            </Box>
        </Box>
    )
}

export default Comment;