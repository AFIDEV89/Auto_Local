import React, { useState, useCallback } from "react";
import { useEffect } from "react";

import API from "api/axios";
import CommentDialog from "./CommentDialog";
import { Box, Button, Divider } from "@mui/material";
import Comment from "../components/Comment";
import { errorAlert } from "views/helpers";
import usePermission from "hooks/usePermission";

const ProductComments = ({
   productId
}) => {
   const [comments, setComments] = useState([]);
   const [addDialogOpen, setAddDialogOpen] = useState(false);
   const { isUserModerator } = usePermission()

   const fetchComments = useCallback(async () => {
      try {
         const response = await API.get(`/product/comments/${productId}`);

         if (response?.data?.data) {
            setComments(response.data.data)
         }
      } catch (error) {
         errorAlert("Something went wrong while getting the comments");
      }

   }, [productId])

   useEffect(() => {
      fetchComments()
   }, [fetchComments])

   const closeDialog = () => {
      setAddDialogOpen(false);
   }

   const openDialog = () => {
      setAddDialogOpen(true)
   }

   return (
      <Box>
         <Box textAlign="right">
            <CommentDialog open={addDialogOpen} handleClose={closeDialog} productId={productId} />
            {!isUserModerator && <Button
               onClick={openDialog}
               color="secondary"
               variant="contained"
               size="large">
               Add Review
            </Button>}
         </Box>

         <Box>
            {
               comments.map((comment) => {
                  return <Box key={comment.id}>
                     <Comment
                        author={comment.author}
                        image={comment.author_pic}
                        comment={comment.comment}
                        postTime={comment.updatedAt}
                     />
                     <Divider variant="fullWidth" style={{ margin: "10px 0", borderColor: "#e0e0e0" }} light />

                  </Box>
               })
            }
         </Box>
      </Box>
   )
}

export default ProductComments