import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import API from "../../../../api/axios";

// third-party
import LoadingButton from "@mui/lab/LoadingButton";

// project imports
import { gridSpacing } from "store/constant";

// assets
import DeleteIcon from "@mui/icons-material/Delete";
import { apiErrorHandler, errorAlert, successAlert } from "../../../helpers";


const AddDesign = ({
  event,
  handleDelete,
  handleCloseModal,
  reloadApi,
  editVehicleCategory = {},
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
      const response = await API.post("vehicle-category/create", {
        name: title,
      });

      if (response && response.data && response.data.data) {
        handleCloseModal();
        reloadApi();

        setTimeout(() => {
          successAlert("Vehicle Category added successfully.");
        }, 200);
      }
      else {
        errorAlert(response.data.message);
      }

      setLoading(false);
      handleClearState();
    }
    catch (error) {
      setLoading(false);
      handleClearState();
      apiErrorHandler("Something went wrong while adding the Vehicle Category");
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);

    try {
      const response = await API.put(`vehicle-category/update`, {
        name: title,
        id: editVehicleCategory.id,
      });

      if (
        response &&
        response.data &&
        (response.data.statusCode === 200 || response.data.statusCode === 204)
      ) {
        handleCloseModal();
        reloadApi();
        handleClearState();

        setTimeout(() => {
          successAlert("Vehicle Category updated successfully.");
        }, 200);

      }
      else if (response.data) {
        errorAlert(response.data.message);
      }
      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      apiErrorHandler(error, "Something went wrong while updating the Vehicle Category");
    }
  };

  const isEdit = editVehicleCategory && editVehicleCategory?.id;

  useEffect(() => {
    if (editVehicleCategory && editVehicleCategory?.id) {
      setTitle(editVehicleCategory?.name || "");
    }
  }, [editVehicleCategory, editVehicleCategory.id]);

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      onClose={handleCloseModal}
      open={open}
      sx={{ "& .MuiDialog-paper": { p: 0 } }}
    >
      <DialogTitle>
        {isEdit ? "Edit Vehicle Category" : "Add Vehicle Category"}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <div style={{ paddingBottom: "10px" }}>
              <label className="form-label">Vehicle Category Name*</label>
            </div>

            <TextField
              fullWidth
              label="Vehicle Category Name"
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
                variant="contained"
                disabled={!title}
              >
                {isEdit ? "Update Vehicle Category" : "Add Vehicle Category"}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default AddDesign;
