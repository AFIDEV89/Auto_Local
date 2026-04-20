import React, { useEffect, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Dialog
} from "@mui/material";
import API from "api/axios";

// assets
import { successAlert, apiErrorHandler, errorAlert } from "views/helpers";
import { LoadingButton } from "@mui/lab";

import ImageUploader from "../../customer/Product/ImageInput"

const AddDesign = ({
  handleCloseModal,
  reloadApi,
  editDesign = {},
  open = false,
}) => {
  const [title, setTitle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState([])

  const isEdit = editDesign && editDesign?.id;

  useEffect(() => {
    if (editDesign && editDesign?.id) {
      setTitle(editDesign?.name || "");

      if (editDesign?.pictures?.length) {
        setPictures([...editDesign.pictures])
      }
    }
  }, [editDesign, editDesign.id]);

  const resetState = () => {
    setTitle("");
    setPictures([])
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await API.post("design/create", {
        name: title,
        pictures: pictures.length ? [...pictures] : null
      });

      if (response && response.data && response.data.data) {
        handleCloseModal();
        reloadApi();

        setTimeout(() => {
          successAlert("Design added successfully.");
        }, 200);
      }
      else {
        errorAlert(response.data.message);
      }

      setLoading(false);
      resetState();
    }
    catch (error) {
      setLoading(false);
      resetState();
      apiErrorHandler("Something went wrong while adding the design");
    }
  }

  const handleEditSubmit = async () => {
    setLoading(true);

    try {
      const response = await API.put(`design/update`, {
        id: editDesign.id,
        name: title,
        pictures: pictures.length ? [...pictures] : null
      });

      if (response && response.data && [200, 204].includes(response.data.statusCode)) {
        handleCloseModal();
        reloadApi();
        resetState();

        setTimeout(() => {
          successAlert("Design updated successfully.");
        }, 200)
      }
      else if (response.data) {
        errorAlert(response.data.message);
      }

      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      apiErrorHandler(error, "Something went wrong while updating the design");
    }
  };

  const handleImages = (data) => {
    setPictures(data);
  };


  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      onClose={handleCloseModal}
      open={open}
    >
      <DialogTitle>
        {isEdit ? "Edit Design Data" : "Add Design Data"}
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          label="Design Name"
          value={title}
          sx={{
            marginBottom: 2
          }}
          inputProps={{ maxLength: 100 }}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="form-group">
          <p className="form-label">Image</p>
          <ImageUploader handleImages={handleImages} img={pictures} />

          <p className="imgdesc">
            Maximum size allowed: 20 MB, Format supported: JPEG, PNG, JPG only
          </p>
        </div>
      </DialogContent>

      <DialogActions>
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
          {isEdit ? "Update Design" : "Add Design"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default AddDesign;
