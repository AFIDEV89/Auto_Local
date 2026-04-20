import React, { useEffect } from "react";
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
  Dialog
} from "@mui/material";

import API from "api/axios";
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
  editBlogCategory = {},
  open,
}) => {
  const isCreating = !event;

  const [title, setTitle] = React.useState(null);

  const [loading, setLoading] = React.useState(false);

  const handleClearState = () => {
    setTitle("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let payload = {
        name: title,
      };

      const response = await API.post("/admin/blog-categories", payload);
      if (response && response.data && response.data.data) {
        handleCloseModal();
        reloadApi();

        setTimeout(() => {
          successAlert("Blog Category added successfully.");
        }, 200);
      } else {
        errorAlert(response.data.message);
      }
      setLoading(false);
      handleClearState();
    } catch (error) {
      setLoading(false);
      handleClearState();
      apiErrorHandler("Something went wrong while adding the Blog Category");
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      let payload = {
        name: title,
        id: editBlogCategory.id
      };

      const response = await API.put(`/admin/blog-categories`, payload);
      if (
        response &&
        response.data &&
        (response.data.statusCode === 200 || response.data.statusCode === 204)
      ) {
        handleCloseModal();
        reloadApi();
        handleClearState();
        setTimeout(() => {
          successAlert("Blog Category updated successfully.");
        }, 200);
      } else if (response.data) {
        errorAlert(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      apiErrorHandler(error, "Something went wrong while updating the Blog Category");
    }
  };

  const isEdit = editBlogCategory && editBlogCategory?.id;

  useEffect(() => {
    if (editBlogCategory && editBlogCategory?.id) {
      setTitle(editBlogCategory?.name || "");
    }
  }, [editBlogCategory, editBlogCategory.id]);

  return (
    <div>
      <Dialog
        maxWidth="sm"
        fullWidth
        onClose={handleCloseModal}
        open={open}
        sx={{ "& .MuiDialog-paper": { p: 0 } }}
      >
        <DialogTitle>
          {isEdit ? "Edit Blog Category" : "Add Blog Category"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <div style={{ paddingBottom: "10px" }}>
                <label className="form-label">Blog Category Name*</label>
              </div>

              <TextField
                fullWidth
                label="Blog Category Name"
                value={title}
                inputProps={{ maxLength: 100 }}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
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
                  // startIcon={<SaveIcon />}
                  variant="contained"
                  disabled={
                    !title
                  }
                >
                  {isEdit ? "Update Blog Category" : "Add Blog Category"}
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
