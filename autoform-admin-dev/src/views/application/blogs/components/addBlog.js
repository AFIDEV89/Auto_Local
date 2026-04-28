import React, { useEffect, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Dialog,
  MenuItem
} from "@mui/material";

import { s3 } from 'views/aws/aws-s3'
import API from "api/axios";
import CloseIcon from "@mui/icons-material/Close";
import RichTextEditor from "views/application/e-commerce/ProductDetails/RichTextEditor";
import uploadIcon from "assets/images/e-commerce/uploadIcon.svg";

// third-party
import LoadingButton from "@mui/lab/LoadingButton";

// project imports
import { gridSpacing } from "store/constant";

// assets
import DeleteIcon from "@mui/icons-material/Delete";
import { successAlert, apiErrorHandler, errorAlert } from "../../../helpers";

const AddBlogData = ({
  event,
  handleDelete,
  handleCloseModal,
  reloadApi,
  editBlog = {},
  open,
  blogsCategories = []
}) => {
  const [title, setTitle] = useState(null);
  const [creatorName, setCreatorName] = useState(null);
  const [description, setDescription] = useState(null);
  const [picUrl, setPicUrl] = useState(null);
  const [blogCat, setBlogCat] = useState(null);
  const [contentDescription, setContentDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const isCreating = !event;
  const isEdit = editBlog && editBlog?.id;

  useEffect(() => {
    if (editBlog && editBlog?.id) {
      setTitle(editBlog?.title || '');
      setDescription(editBlog?.description || '')
      setPicUrl(editBlog?.image || '');
      setContentDescription(editBlog?.content || '')
      setBlogCat(editBlog?.blog_category_id || null)
      setCreatorName(editBlog?.creator_name || '')
    }
  }, [
    editBlog,
    editBlog.id
  ]);

  const onFileChange = async (e) => {
    const file = e.target.files[0];

    if (file && file.size > 20000000) {
      alert("File exceeds 20mb.");
      return;
    }

    s3.uploadFile(file, file.name.trim())
      .then((data) => {
        if (data && data.location) {
          setPicUrl(data.location);
        }
      })
      .catch((err) => {
        apiErrorHandler(err, "Error while uploading images.");
      });
  };

  const handleClearState = () => {
    setCreatorName('')
    setDescription('')
    setPicUrl('');
    setTitle('');
    setContentDescription('');
    setBlogCat(null);
  }

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = {
        title: title,
        description: description,
        image: picUrl,
        content: contentDescription,
        blog_category_id: blogCat,
        creator_name: creatorName,
        blog_author_id: 1 // TODO temporary hack...remove it after necessary changes
      };

      const response = await API.post("/admin/blogs", payload);

      if (response && response.data && response.data.data) {
        handleCloseModal();
        reloadApi();

        setTimeout(() => {
          successAlert("Blog added successfully.");
        }, 200);

      } else {
        errorAlert(response.data.message);
      }
      setLoading(false);
      handleClearState();
    } catch (error) {
      setLoading(false);
      handleClearState();
      apiErrorHandler("Something went wrong while adding the Blog");
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);

    try {
      const payload = {
        title: title,
        description: description,
        image: picUrl,
        content: contentDescription,
        blog_category_id: blogCat,
        creator_name: creatorName,
        blog_author_id: 1 // TODO temporary hack...remove it after necessary changes
      };

      const response = await API.put(`/admin/blogs/${editBlog.id}`, payload);

      if (
        response &&
        response.data &&
        (response.data.statusCode === 200 || response.data.statusCode === 204)
      ) {
        handleCloseModal();
        reloadApi();
        handleClearState();

        setTimeout(() => {
          successAlert("Blog updated successfully.");
        }, 200);
      }
      else if (response.data) {
        errorAlert(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      apiErrorHandler(error, "Something went wrong while updating the Blog");
    }
  };

  return (
    <div>
      <Dialog
        maxWidth="sm"
        fullWidth
        onClose={handleCloseModal}
        open={open}
        sx={{ "& .MuiDialog-paper": { p: 0 } }}
        disableEnforceFocus
      >
        <DialogTitle>
          {isEdit ? "Edit Blog Data" : "Add Blog Data"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <div style={{ paddingBottom: "10px" }}>
                <label className="form-label">Blog Title*</label>
              </div>

              <TextField
                fullWidth
                label="Blog Title"
                value={title}
                inputProps={{ maxLength: 100 }}
                onChange={(e) => {

                  setTitle(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <div style={{ paddingBottom: "10px" }}>
                <label className="form-label">Creator Name*</label>
              </div>

              <TextField
                fullWidth
                label="Creator Name"
                value={creatorName}
                inputProps={{ maxLength: 100 }}
                onChange={(e) => {
                  setCreatorName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-select-currency"
                select
                value={blogCat}
                name="category_id"
                label="Select Blog Category*"
                fullWidth
                onChange={(event) => setBlogCat(event.target.value)}
              >
                {blogsCategories &&
                  blogsCategories.length > 0 &&
                  blogsCategories.map((option) => (
                    <MenuItem
                      key={option.id}
                      value={option.id}
                      selected={
                        blogCat && blogCat === option.id ? true : false
                      }
                    >
                      {option.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <div className="form-group">
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">Image</label>
                </div>
                <div className="upload-wrap">
                  {picUrl ? (
                    <div className="upload-image coverimg">
                      <div className="category-image">
                        <img
                          style={{ maxHeight: "200px", maxWidth: "100%" }}
                          src={picUrl}
                          alt="User Icon"
                        />
                      </div>
                      <div
                        className="close-icon"
                        onClick={() => {
                          setPicUrl("");
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
                        // value={coverInputFile}
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
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ paddingBottom: "10px" }}>
                <label className="form-label">Blog Description*</label>
              </div>

              <TextField
                fullWidth
                label="Blog Description*"
                multiline
                rows={5}
                value={description}
                onChange={(e) => {

                  setDescription(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <span className="richTitle">Content Description*</span>
              <RichTextEditor
                productInfo={contentDescription}
                name="description"
                onChangeEditor={(e, setData) => setContentDescription(setData)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {!isCreating && (
                <Tooltip title="Delete Event">
                  <IconButton
                    onClick={() => handleDelete(event?.id)}
                    size="large"
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>

            <Grid item>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>

                <LoadingButton
                  size="medium"
                  type="submit"
                  onClick={() => {
                    if (isEdit) {
                      handleEditSubmit();
                    } else {
                      handleSubmit();
                    }
                  }}
                  loading={loading}
                  loadingPosition="center"
                  variant="contained"
                  disabled={!title || !picUrl || !description || !contentDescription || !blogCat}
                >
                  {isEdit ? "Update Blog" : "Add Blog"}
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddBlogData;
