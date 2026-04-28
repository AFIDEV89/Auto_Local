import React, { useEffect } from "react";
import PropTypes from "prop-types";

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
} from "@mui/material";
import { s3 } from "../../../aws/aws-s3";
import API from "../../../../api/axios";
import uploadIcon from "../../../../assets/images/e-commerce/uploadIcon.svg";

// third-party
import merge from "lodash/merge";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";

// project imports
import { gridSpacing } from "store/constant";
import CloseIcon from "@mui/icons-material/Close";
import { successAlert, apiErrorHandler, errorAlert } from "../../../helpers";
// assets
import DeleteIcon from "@mui/icons-material/Delete";

// constant
const getInitialValues = (event, range) => {
  const newEvent = {
    title: "",
    brand: "",
    price: "",
    color: "#2196f3",
    productCode: "",
    availabilty: false,
    viewed: "",
  };

  if (event || range) {
    return merge({}, newEvent, event);
  }

  return newEvent;
};

// ==============================|| CALENDAR EVENT ADD / EDIT / DELETE ||============================== //

const AddCategory = ({
  event,
  range,
  handleDelete,
  onCancel,
  handleCloseModal,
  reloadApi,
  editCategoryData
}) => {
  // const theme = useTheme();
  const isCreating = !event;
  const [picUrl, setPicUrl] = React.useState(null);
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isNameChanges, setIsNameChanges] = React.useState(false);



  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required("Name is required"),
    brand: Yup.string().required("Brand is required"),
    price: Yup.number().typeError("you must specify a number"),
    viewed: Yup.number().typeError("you must specify a number"),
    color: Yup.string().max(255),
    productCode: Yup.string().required("Product Code is required"),
  });

  const formik = useFormik({
    initialValues: getInitialValues(event, range),
    validationSchema: EventSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        resetForm();
        onCancel();
        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const {
    errors,
    touched
  } = formik;

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let payload = {
        name: name.trim(),
      };
      if (picUrl) {
        payload = {
          ...payload,
          image: picUrl,
        };
      }
      const response = await API.post("/category/create", payload);

      if (response && response.data && response.data.data) {
        handleCloseModal();
        reloadApi();
        setTimeout(() => {
          successAlert("Category added successfully.");
        }, 200);
      } else {
        errorAlert(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      apiErrorHandler(error, "Something went wrong while adding the Category.");
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      let payload = {
        image: picUrl,
      };
      if (isNameChanges) {
        payload = {
          ...payload,
          name: name.trim(),
        };
      }
      const response = await API.put(`/category/update/${editCategoryData.id}`, payload);
      if (
        response &&
        response.data &&
        (response.data.statusCode === 200 || response.data.statusCode === 204)
      ) {
        handleCloseModal();
        reloadApi();
        setTimeout(() => {
          successAlert("Category updated successfully.");
        }, 200);
      } else {
        if (response.data) {
          errorAlert(response.data.message);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      apiErrorHandler(
        error,
        "Something went wrong while updating the category"
      );
    }
  };

  const isEdit = editCategoryData && editCategoryData.id;
  useEffect(() => {
    if (editCategoryData.id) {
      setName(editCategoryData.name);
      setPicUrl(editCategoryData.image);
    }
  }, [editCategoryData, editCategoryData.id]);

  return (
    <FormikProvider value={formik}>
      
        <Form autoComplete="off" noValidate>
          <DialogTitle>{isEdit ? "Edit Product Category" : "Add Product Category"}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">Name*</label>
                </div>

                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => {
                    if (isEdit && !isNameChanges) {
                      setIsNameChanges(true);
                    }
                    setName(e.target.value);
                  }}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
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
                          <img src={uploadIcon} alt="Upload Icon" />
                          <p>Upload Image</p>
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
                    disabled={!name}
                  >
                    {isEdit ? "Update" : "Add"}
                  </LoadingButton>

                  {/* <Button
                    type="submit"
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {event ? "Edit" : "Add"}
                  </Button> */}
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
     
    </FormikProvider>
  );
};

AddCategory.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  handleDelete: PropTypes.func,
  handleCreate: PropTypes.func,
  handleUpdate: PropTypes.func,
  onCancel: PropTypes.func,
};

export default AddCategory;
