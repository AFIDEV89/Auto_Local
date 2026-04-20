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

const AddSubCategory = ({
  event,
  range,
  handleDelete,
  onCancel,
  handleCloseModal,
  reloadApi,
  editSubCategoryData
}) => {
  // const theme = useTheme();
  const isCreating = !event;
  const [picUrl, setPicUrl] = React.useState(null);
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isNameChanges, setIsNameChanges] = React.useState(false);
  const [canonical, setCanonical] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [categoryList, setCategoryList] = React.useState([]);

  const EventSchema = Yup.object().shape({
    name: Yup.string().max(255).required("Name is required"),
    categoryId: Yup.number().required("Category is required"),
    canonical: Yup.string().required("Canonical is required"),
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
        canonical: canonical,
      };
      if (picUrl) {
        payload = {
          ...payload,
          category_id: categoryId,
          image: picUrl,
        };
      }
      const response = await API.post("/subcategory/create", payload);

      if (response && response.data && response.data.data) {
        handleCloseModal();
        reloadApi();
        setTimeout(() => {
          successAlert("SubCategory added successfully.");
        }, 200);
      } else {
        errorAlert(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      apiErrorHandler(error, "Something went wrong while adding the SubCategory.");
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      let payload = {
        image: picUrl,
        category_id: categoryId,
        canonical: canonical,
        name: isNameChanges ? name.trim() : editSubCategoryData.name.trim(), // Always include the name
      };
      const response = await API.put(`/subcategory/update/${editSubCategoryData.id}`, payload);
      if (
        response &&
        response.data &&
        (response.data.statusCode === 200 || response.data.statusCode === 204)
      ) {
        handleCloseModal();
        reloadApi();
        setTimeout(() => {
          successAlert("SubCategory updated successfully.");
        }, 200);
      } else {
        if (response.data) {
          errorAlert(response.data?.errors[0]);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      apiErrorHandler(
        error,
        "Something went wrong while updating the Subcategory"
      );
    }
  };

  const isEdit = editSubCategoryData && editSubCategoryData.id;

  useEffect(() => {
    console.log("editSubCategoryData", editSubCategoryData);
    if (editSubCategoryData.id) {
      setName(editSubCategoryData.name);
      setCategoryId(editSubCategoryData.category_id || "");
      setPicUrl(editSubCategoryData.image);
      setCanonical(editSubCategoryData.canonical);
    }
  }, [editSubCategoryData, editSubCategoryData.id]);

  useEffect(() => {
    getCategoryList();
  }
  , []);

  const getCategoryList = async () => {
    try {
      const response = await API.get("/category/get-list");
      if (response && response.data && response.data.data) {
        setCategoryList(response.data.data);
      } else {
        errorAlert(response.data.message);
      }
    } catch (error) {
      apiErrorHandler(error, "Something went wrong while fetching categories.");
    }
  }

  return (
    <FormikProvider value={formik}>
      
        <Form autoComplete="off" noValidate>
          <DialogTitle>{isEdit ? "Edit Product SubCategory" : "Add Product SubCategory"}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">Category*</label>
                </div>
                <TextField
                  fullWidth
                  select
                  // label="Category"
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                  }}
                  SelectProps={{
                    native: true,
                  }}
                  error={Boolean(touched.categoryId && errors.categoryId)}
                  helperText={touched.categoryId && errors.categoryId}
                >
                  <option value="">Select Category</option>
                  {categoryList && categoryList.length > 0 && categoryList.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">SubCategory Name*</label>
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
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">Canonical*</label>
                </div>
                <TextField
                  fullWidth
                  label="Canonical"
                  value={canonical}
                  onChange={(e) => {
                    setCanonical(e.target.value);
                  }}
                  error={Boolean(touched.canonical && errors.canonical)}
                  helperText={touched.canonical && errors.canonical}
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

AddSubCategory.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  handleDelete: PropTypes.func,
  handleCreate: PropTypes.func,
  handleUpdate: PropTypes.func,
  onCancel: PropTypes.func,
};

export default AddSubCategory;
