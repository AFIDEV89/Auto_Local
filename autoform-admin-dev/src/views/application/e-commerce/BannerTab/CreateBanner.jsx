import React, { useEffect, useState } from "react";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";

import { s3 } from "views/aws/aws-s3";
import API from "api/axios";
import uploadIcon from "assets/images/e-commerce/uploadIcon.svg";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import { gridSpacing } from "store/constant";
import CloseIcon from "@mui/icons-material/Close";
import { successAlert, apiErrorHandler, errorAlert } from "views/helpers";
import RichTextEditor from "../ProductDetails/RichTextEditor";

const CreateBanner = ({
  handleCloseModal,
  reloadApi,
  editBannerData
}) => {
  const [name, setName] = React.useState("");
  const [picUrl, setPicUrl] = React.useState(null);
  const [btnUrl, setBtnUrl] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [imageLoader, setImageLoader] = useState(false);

  const isEdit = editBannerData && editBannerData.id;

  useEffect(() => {
    if (editBannerData.id) {
      setName(editBannerData.title);
      setPicUrl(editBannerData.image);
      setBtnUrl(editBannerData.url);
    }
  }, [editBannerData, editBannerData.id]);

  const onFileChange = async (e) => {
    const file = e.target.files[0];

    if (file && file.size > 20000000) {
      alert("File exceeds 20mb.");
      return;
    }

    setImageLoader(true);

    s3
      .uploadFile(file, file.name.trim())
      .then((data) => {
        if (data && data.location) {
          setPicUrl(data.location);
        }
        setImageLoader(false);
      })
      .catch((err) => {
        setImageLoader(false);
        apiErrorHandler(err, "Error while uploading images.");
      });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await API.post("/banner/create", {
        title: name.trim(),
        url: btnUrl.trim(),
        image: picUrl
      });

      if (response?.data?.data) {
        handleCloseModal();
        reloadApi();

        successAlert("Banner added successfully.");
      }
      else {
        errorAlert(response.data.message);
      }

      setLoading(false);
    }
    catch (error) {
      setLoading(false);

      apiErrorHandler(error, "Something went wrong while adding the Banner.");
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);

    try {
      const response = await API.put(`/banner/update`, {
        id: editBannerData?.id,
        title: name.trim(),
        url: btnUrl.trim(),
        image: picUrl
      });

      if (response && response.data && [200, 204].includes(response.data.statusCode)) {
        handleCloseModal();
        reloadApi();

        successAlert("Banner updated successfully.");
      }
      else {
        if (response.data) {
          errorAlert(response.data.message);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      apiErrorHandler(error, "Something went wrong while updating the Banner");
    }
  };

  return (
    <>
      <DialogTitle>
        {isEdit ? "Edit Banner" : "Add Banner"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <div style={{ paddingBottom: "10px" }}>
              <label className="form-label">Name*</label>
            </div>

            <RichTextEditor
              productInfo={name}
              name="name"
              onChangeEditor={(name, data) => setName(data)}
            />
          </Grid>
          <Grid item xs={12}>
            <div style={{ paddingBottom: "10px" }}>
              <label className="form-label">Shop Button URL*</label>
            </div>

            <TextField
              fullWidth
              label="Shop Button URL"
              name='btn_url'
              value={btnUrl}
              onChange={(e) => setBtnUrl(e.target.value)}
            />
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
                      {imageLoader ? (
                        <Box sx={{ display: "flex" }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <>
                          <img src={uploadIcon} alt="Upload Icon" />
                          <p>Upload Image</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <p className="imgdesc">
                  Maximum size allowed: 20 MB, Format supported: JPEG,PNG,
                  JPG only
                </p>
              </div>
            </div>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 1 }}>
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
          disabled={!name || !picUrl || !btnUrl}
        >
          {isEdit ? "Update" : "Add"}
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default CreateBanner;