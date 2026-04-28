import React, { useEffect, useState } from "react";
import Input from "@mui/material/Input";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import DatePicker from "react-datepicker";
import { s3 } from "../../../aws/aws-s3";
import API from "../../../../api/axios";
import CloseIcon from "@mui/icons-material/Close";
import uploadIcon from "../../../../assets/images/e-commerce/uploadIcon.svg";

// third-party
import LoadingButton from "@mui/lab/LoadingButton";

// project imports
import { gridSpacing } from "store/constant";
import InputLabel from "@mui/material/InputLabel";

// assets
import DeleteIcon from "@mui/icons-material/Delete";
import { successAlert, apiErrorHandler, errorAlert } from "../../../helpers";

const AddVehicleData = ({
  event,
  handleDelete,
  handleCloseModal,
  reloadApi,
  editVehicleData,
  vehicleType,
  brandList,
}) => {
  const isCreating = !event;
  const monthArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [brand_id, setBrandId] = React.useState("");
  const [brandModelDetails, setBrandModelDetails] = React.useState([]);
  const [type_id, setType] = React.useState(null);
  const [month, setMonth] = React.useState(null);
  const [brandModel, setBrandModel] = React.useState(null);
  const [model, setModel] = React.useState(null);
  const [savedate, setSavedate] = useState(new Date());
  const [picUrl, setPicUrl] = React.useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState(null);
  const [vehicleCategory, setVehicleCategory] = React.useState([]);

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

  const handleVehicleCategory = () => {
    API.get("vehicle-category/get-list")
      .then((res) => {
        if (res && res?.data && res?.data?.data) {
          setVehicleCategory(res?.data?.data || []);
        }
      })
      .catch(() => {
        setVehicleCategory([]);
      });
  };

  useEffect(() => {
    handleVehicleCategory();
  }, []);


  const handleSubmit = async () => {
    setLoading(true);

    try {
      let payload = {
        vehicle_type_id: type_id,
        brand_id: brand_id,
        model_id: brandModel,
        month: month,
        year: savedate ? new Date(savedate).getFullYear().toString() : "",
        vehicle_category_id: categoryId,
        model_variant: model,
      };

      if (picUrl) {
        payload = {
          ...payload,
          image: picUrl,
        };
      }
      const response = await API.post("/vehicle-detail/create", payload);
      if (response && response.data && response.data.data) {
        handleCloseModal();
        reloadApi();
        setTimeout(() => {
          successAlert("Vehicle added successfully.");
        }, 200);
      } else {
        errorAlert(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      apiErrorHandler("Something went wrong while adding the Vehicle");
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      let payload = {
        vehicle_type_id: type_id,
        brand_id: brand_id,
        model_id: brandModel,
        month: month,
        year: savedate ? new Date(savedate).getFullYear().toString() : "",
        vehicle_category_id: categoryId,
        model_variant: model,
      };

      if (picUrl) {
        payload = {
          ...payload,
          image: picUrl,
        };
      }

      const response = await API.put(
        `/vehicle-detail/update/${editVehicleData.id}`,
        payload
      );
      if (
        response &&
        response.data &&
        (response.data.statusCode === 200 || response.data.statusCode === 204)
      ) {
        handleCloseModal();
        reloadApi();
        setTimeout(() => {
          successAlert("Vehicle updated successfully.");
        }, 200);
      } else if (response.data) {
        errorAlert(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      apiErrorHandler(error, "Something went wrong while updating the Vehicle");
    }
  };

  const isEdit = editVehicleData && editVehicleData.id;

  useEffect(() => {
    if (editVehicleData && editVehicleData.id) {
      setBrandId(editVehicleData?.brand_id ? editVehicleData.brand_id : "");

      setModel(
        editVehicleData?.model_variant ? editVehicleData?.model_variant : ""
      );
      setType(
        editVehicleData?.vehicle_type_id
          ? editVehicleData?.vehicle_type_id
          : null
      );

      setMonth(editVehicleData?.month || "");
      setPicUrl(editVehicleData?.image || "");
      setCategoryId(editVehicleData?.vehicle_category_id || "");
      setBrandModel(editVehicleData?.model_id || "");
      setSavedate(
        editVehicleData?.year ? new Date(editVehicleData.year) : new Date()
      );
    }
  }, [editVehicleData, editVehicleData.id]);

  useEffect(() => {
    if (brand_id) {
      API.get(`brand-model/get-list?brand_id=${brand_id}`)
        .then((res) => {
          if (res && res?.data && res?.data?.data) {
            setBrandModelDetails(res?.data?.data || []);
          }
        })
        .catch((err) => {
          apiErrorHandler(
            err,
            "Something went wrong while updating the Vehicle"
          );
        });
    }
  }, [brand_id]);

  return (
    <div>
      <DialogTitle>
        {isEdit ? "Edit Vehicle Data" : "Add Vehicle Data"}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <div style={{ paddingBottom: "10px" }}>
              <label className="form-label">Vehicle Brand*</label>
            </div>
            <Select
              style={{ width: "100%" }}
              labelImainCategoryListd="demo-simple-select-label"
              id="demo-simple-select"
              label="category"
              placeholder={"Select"}
              value={brand_id}
              input={<Input id="name-multiple" />}
              onChange={(event) => {
                if (!isUpdated) {
                  setIsUpdated(true);
                }
                setBrandId(event.target.value);
                setBrandModel(null);
                setBrandModelDetails([]);
              }}
            >
              {brandList &&
                brandList.length > 0 &&
                brandList.map((b, index) => {
                  return (
                    <MenuItem key={index} value={b.id}>
                      {b.name}
                    </MenuItem>
                  );
                })}
            </Select>
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
            <InputLabel htmlFor="name-multiple">Select Type *</InputLabel>

            <Select
              style={{ width: "100%" }}
              labelImainCategoryListd="demo-simple-select-label"
              id="demo-simple-select"
              label="category"
              placeholder={"Select"}
              value={type_id}
              input={<Input id="name-multiple" />}
              onChange={(event) => setType(event.target.value)}
            >
              {vehicleType &&
                vehicleType.length > 0 &&
                vehicleType.map((m, index) => {
                  return (
                    <MenuItem key={index} value={m.id}>
                      {m.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <div style={{ paddingBottom: "10px" }}>
              <label className="form-label">Vehicle Model*</label>
            </div>

            <Select
              style={{ width: "100%" }}
              labelImainCategoryListd="demo-simple-select-label"
              id="demo-simple-select"
              label="category"
              placeholder={"Select"}
              value={brandModel}
              input={<Input id="name-multiple" />}
              onChange={(event) => {
                if (!isUpdated) {
                  setIsUpdated(true);
                }
                setBrandModel(event.target.value);
              }}
            >
              {brandModelDetails &&
                brandModelDetails.length > 0 &&
                brandModelDetails.map((m, index) => {
                  return (
                    <MenuItem key={index} value={m.id}>
                      {m.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <div style={{ paddingBottom: "10px" }}>
              <label className="form-label">Model Variant*</label>
            </div>
            <TextField
              fullWidth
              label="Model Variant"
              value={model}
              onChange={(e) => {
                if (!isUpdated) {
                  setIsUpdated(true);
                }
                setModel(e.target.value);
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <InputLabel htmlFor="name-multiple">Vehicle Category *</InputLabel>

            <Select
              style={{ width: "100%" }}
              labelImainCategoryListd="demo-simple-select-label"
              id="demo-simple-select"
              label="category"
              placeholder={"Select"}
              value={categoryId}
              input={<Input id="name-multiple" />}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              {vehicleCategory &&
                vehicleCategory.length > 0 &&
                vehicleCategory.map((v, index) => {
                  return (
                    <MenuItem key={index} value={v.id}>
                      {v.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <InputLabel htmlFor="name-multiple">Month *</InputLabel>

            <Select
              style={{ width: "100%" }}
              labelImainCategoryListd="demo-simple-select-label"
              id="demo-simple-select"
              label="category"
              placeholder={"Select"}
              value={month}
              input={<Input id="name-multiple" />}
              onChange={(event) => setMonth(event.target.value)}
            >
              {monthArray.map((m, index) => {
                return (
                  <MenuItem key={index} value={m}>
                    {m}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <InputLabel htmlFor="name-multiple">Year *</InputLabel>

            <DatePicker
              id="DatePicker"
              type="string"
              className="text-primary text-center"
              selected={savedate}
              value={savedate}
              onChange={(date) => setSavedate(date)}
              showYearPicker
              dateFormat="yyyy"
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
                  !brand_id || !brandModel || !type_id || !month || !savedate
                }
              >
                {isEdit ? "Update Vehicle" : "Add Vehicle"}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </DialogActions>
    </div>
  );
};

export default AddVehicleData;
