import React, { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { TextField, Box } from "@mui/material";
import uploadIcon from "../../../../assets/images/e-commerce/uploadIcon.svg";
import CloseIcon from "@mui/icons-material/Close";
import { apiErrorHandler, errorAlert, successAlert } from "views/helpers";
import { s3 } from "views/aws/aws-s3";
import API from "api/axios";

const CommentDialog = ({
    open,
    handleClose,
    productId
}) => {
    const [commentData, setCommentData] = useState({
        comment: '',
        author: '',
        author_pic: ''
    });

    const onFileChange = async (e) => {
        const file = e.target.files[0];

        if (file && file.size > 20000000) {
            alert("File exceeds 20mb.");
            return;
        }

        s3.uploadFile(file, file.name.trim())
            .then((data) => {
                if (data && data.location) {
                    setCommentData(prev => ({ ...prev, author_pic: data.location }))
                }
            })
            .catch((err) => {
                apiErrorHandler(err, "Error while uploading images.");
            });
    };

    const saveComment = async () => {
        try {
            const response = await API.post(`/product/comments`, {
                ...commentData,
                product_id: productId
            });

            if (response?.data?.data) {
                handleClose();

                setTimeout(() => {
                    successAlert("Review added successfully.");
                }, 200);
            }
        } catch (error) {
            errorAlert("Something went wrong while getting the comments");
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                Add new review
            </DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Author Name"
                    value={commentData.author}
                    inputProps={{ maxLength: 100 }}
                    sx={{marginBottom: 2}}
                    onChange={(e) => setCommentData(prev => ({ ...prev, author: e.target.value }))}
                />

                <Box className="form-group" sx={{marginBottom: 2}}>
                    <div style={{ paddingBottom: "10px" }}>
                        <label className="form-label">Image</label>
                    </div>
                    <div className="upload-wrap">
                        {commentData.author_pic ? (
                            <div className="upload-image coverimg">
                                <div className="category-image">
                                    <img
                                        style={{ maxHeight: "200px", maxWidth: "100%" }}
                                        src={commentData.author_pic}
                                        alt="User Icon"
                                    />
                                </div>
                                <div
                                    className="close-icon"
                                    onClick={() => {
                                        setCommentData(prev => ({ ...prev, author_pic: "" }))
                                    }}
                                >
                                    <CloseIcon />
                                </div>
                            </div>
                        ) : (
                            <div
                                className="category-upload-file"
                                style={{ width: "100%" }}
                            >
                                <input
                                    type="file"
                                    accept="image/x-png, image/jpg, image/jpeg"
                                    onChange={onFileChange}
                                    name="sportImage"
                                />
                                <div className="upload-icon">
                                    <img src={uploadIcon} alt="Upload Icon" />
                                    <p>Upload Image</p>
                                </div>
                            </div>
                        )}
                        <p className="imgdesc">
                            Maximum size allowed: 20 MB, Format supported: JPEG,PNG, JPG
                            only
                        </p>
                    </div>
                </Box>

                <TextField
                    fullWidth
                    label="Comment"
                    value={commentData.comment}
                    inputProps={{ maxLength: 100 }}
                    multiline
                    minRows={6}
                    onChange={(e) => setCommentData(prev => ({ ...prev, comment: e.target.value }))}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button onClick={saveComment} autoFocus>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CommentDialog;