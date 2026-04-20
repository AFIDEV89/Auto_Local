import React, { useState } from "react";

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
  Tooltip
} from "@mui/material";

import API from "../../../../api/axios";

// third-party
import merge from "lodash/merge";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";

// project imports
import { GoogleMap_API, gridSpacing } from "store/constant";
import { successAlert, apiErrorHandler, errorAlert } from "../../../helpers";
// assets
import DeleteIcon from "@mui/icons-material/Delete";
import Geocode from "react-geocode";

import axios from "axios";
import Map from "./GoogleMap";
import './index.css';
// // constant
const getInitialValues = (event, range) => {
  const newEvent = {
    name: '',
    street_address: '',
    city: '',
    country: '',
    postal_code: '',
    state: '',
    latitude: '',
    longitude: '',
  };

  if (event || range) {
    return merge({}, newEvent, event);
  }

  return newEvent;
};

// ==============================|| CALENDAR EVENT ADD / EDIT / DELETE ||============================== //

const AddStore = ({
  event,
  range,
  handleDelete,
  onCancel,
  handleCloseModal,
  reloadApi,
  editStoreData,
  personalData,
}) => {
  const isCreating = !event;
  const [loading, setLoading] = useState(false);
  const [isNameChanges, setIsNameChanges] = useState(false);
  const [storeName, setStoreName] = useState(personalData?.name || "");
  const [address, setAddress] = useState(
    editStoreData?.street_address || ""
  );
  const [city, setCity] = useState(editStoreData?.city || "");
  const [country, setCountry] = useState(editStoreData?.country || "");
  const [pincode, setPincode] = useState(
    editStoreData?.postal_code || ""
  );
  const [state, setState] = useState(editStoreData?.state || "");
  const [latitude, setLatitude] = useState(editStoreData?.latitude || "");
  const [longitude, setLongitude] = useState(editStoreData?.longitude || "");
  //google start
  const [locationLatLang, setLocationLatLang] = React.useState({});
  const [storeAddress, setStoreAddress] = React.useState('');
  const [storeEmail, setStoreEmail] = React.useState(personalData?.email || '');
  const [contactNo, setContactNo] = React.useState(personalData?.contact_no || '');
  const [checkMobileValid, setCheckMobileValid] = React.useState(false);

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
  });

  const {
    errors,
    touched,
  } = formik;


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: storeName,
        street_address: address,
        city: city,
        country: country,
        postal_code: pincode,
        state: state,
        latitude: latitude,
        longitude: longitude,
        email: storeEmail,
        contact_no: contactNo

      };
      const response = await API.post("/store/create", payload);

      if (response && response.data && response.data.data) {
        handleCloseModal();
        reloadApi();
        setTimeout(() => {
          successAlert("Store added successfully.");
        }, 200);
      } else {
        errorAlert(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      apiErrorHandler(error, "Something went wrong while adding the Store.");
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: storeName,
        street_address: address,
        city: city,
        country: country,
        postal_code: pincode,
        state: state,
        latitude: latitude,
        longitude: longitude,
        email: storeEmail,
        contact_no: contactNo
      };

      const response = await API.put(`/store/update/${editStoreData?.id}`, payload);
      if (
        response &&
        response.data &&
        (response.data.statusCode === 200 || response.data.statusCode === 204)
      ) {
        handleCloseModal();
        reloadApi();
        setTimeout(() => {
          successAlert("Store updated successfully.");
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
        "Something went wrong while updating the Store"
      );
    }
  };

  const isEdit = editStoreData && editStoreData?.id;
  const handleKeyPress = (event) => {
    if (event?.key === "-" || event?.key === "+") {
      event.preventDefault();
    }
  };

  const handleKeyPressPhone = (event) => {
    if (event?.key === "-") {
      event.preventDefault();
    }
  };

  const handleCheckPhone = (event) => {
    let phoneNo = event.target.value;

    if (phoneNo.toString().length < 10 || phoneNo.toString().length > 10) {
      setCheckMobileValid(true);
    } else {
      setCheckMobileValid(false);
    }
  };

  const openGoogleMap = () => {
    if (storeAddress) {
      getData(storeAddress);
    }
  };

  const getData = (val) => {
    var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${val}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&libraries=geometry,drawing,places&key=${GoogleMap_API}`
    };

    axios(config)
      .then(function (response) {
        let addressStore = response.data?.candidates[0]?.formatted_address;
        let latlang = response.data?.candidates[0]?.geometry?.location;
        setStoreAddress(addressStore);
        setAddress(addressStore);
        setLocationLatLang(latlang);
        setLatitude(latlang?.lat);
        setLongitude(latlang?.lng);
        getReverseGeocodingData(latlang?.lat, latlang?.lng);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const getReverseGeocodingData = (lat, lng) => {
    if (!!lat && !!lng) {
      Geocode.setApiKey(GoogleMap_API);
      Geocode.enableDebug();

      Geocode.fromLatLng(lat, lng).then(
        response => {
          getCompleteAddress(response.results[0]);
        },
        error => {
          console.error(error);
        }
      );

    }
  };

  const getCompleteAddress = (value) => {
    let countryCode = '';
    let state = '';
    let city = '';
    let postCode = '';
    let county = '';
    let streetAddress = '';
    if (value && value.address_components) {
      for (const addressComp of value?.address_components) {
        if (addressComp?.types.includes("street_number") || addressComp?.types.includes("route") || addressComp?.types.includes("neighborhood") || addressComp?.types.includes("sublocality_level_1")) {
          streetAddress = `${streetAddress} ${addressComp?.long_name}`;
          // setAddress(streetAddress);
        } else {
          // setAddress('');

        }
        if (addressComp?.types.includes('country')) {
          countryCode = addressComp?.short_name;
        }
        if (addressComp?.types.includes('administrative_area_level_1')) {
          state = addressComp?.long_name;
          setState(state);
        } else {
          // setState('');
        }
        if (addressComp?.types.includes('locality')) {
          city = addressComp?.short_name;
          setCity(city);
        } else {
          // setCity('');
        }
        if (addressComp?.types.includes('postal_code')) {
          postCode = addressComp?.short_name;
          setPincode(postCode);
        } else {
          // setPincode('');
        }
        if (addressComp?.types.includes('country')) {
          county = addressComp?.long_name;
          setCountry(county);
        } else {
          // setCountry('');
        }
      }

    } else {
      // if the user presses enter
      streetAddress = value?.updatedStreetAddress;
    }
    return { streetAddress, countryCode, state, city, postCode, county };
  };

  return (
    <>


      <FormikProvider value={formik}>


        <Form autoComplete="off" noValidate>
          <DialogTitle>{isEdit ? "Edit Store" : "Add Store"}</DialogTitle>
          <div className="serchStore">

            <div className="addDiv">
              <TextField
                fullWidth
                label="Search Store By google"
                value={storeAddress}
                onChange={(e) => {
                  setStoreAddress(e.target.value);
                }}
              />
            </div>
            <div className="addDiv btns">
              <Button
                type="button"
                variant="outlined"
                onClick={openGoogleMap}
              >
                Find Store
              </Button>
            </div>
          </div>



          {locationLatLang && Object.keys(locationLatLang).length > 0 && <Map
            setCity={setCity} setCountry={setCountry} setPincode={setPincode} setState={setState}
            setLongitude={setLongitude} setLatitude={setLatitude} setAddress={setAddress} setStoreAddress={setStoreAddress} locationLatLang={locationLatLang} />}
          
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
                  value={storeName}
                  onChange={(e) => {
                    if (isEdit && !isNameChanges) {
                      setIsNameChanges(true);
                    }
                    setStoreName(e.target.value);
                  }}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
              </Grid>
            </Grid>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">Email*</label>
                </div>

                <TextField
                  type="email"
                  fullWidth
                  label="Email"
                  value={storeEmail}
                  onChange={(e) => {
                    setStoreEmail(e.target.value);
                  }}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
              </Grid>
            </Grid>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">Phone Number*</label>
                </div>

                <TextField
                  onKeyPress={(event) => {
                    handleKeyPressPhone(event);
                  }}
                  onBlur={(event) => {
                    handleCheckPhone(event);
                  }}
                  type="number"
                  fullWidth
                  label="Phone Number"
                  value={contactNo}
                  onChange={(e) => {
                    if (e.target.value.toString().length === 10) {
                      setCheckMobileValid(false);
                    }
                    setContactNo(e.target.value);
                  }}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
                {checkMobileValid &&
                  <span className="mobileError">Use 10 digit valid phone number.</span>
                }
              </Grid>
            </Grid>

            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">Address*</label>
                </div>

                <TextField
                  fullWidth
                  label="Address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
              </Grid>
            </Grid>        
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">City*</label>
                </div>

                <TextField
                  fullWidth
                  label="City"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
              </Grid>
            </Grid>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">Country*</label>
                </div>

                <TextField
                  fullWidth
                  label="Country"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                  }}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
              </Grid>
            </Grid>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">Postal Code*</label>
                </div>

                <TextField
                  onKeyPress={(event) => {
                    handleKeyPress(event);
                  }}
                  type="number"
                  fullWidth
                  label="Postal Code"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                  }}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
              </Grid>
            </Grid>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">State*</label>
                </div>

                <TextField
                  fullWidth
                  label="State"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                  }}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
              </Grid>
            </Grid>

            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">latitude*</label>
                </div>

                <TextField
                  onKeyPress={(event) => {
                    handleKeyPress(event);
                  }}
                  fullWidth
                  label="Latitude"
                  value={latitude}
                  onChange={(e) => {
                    setLatitude(e.target.value);
                  }}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
              </Grid>
            </Grid>

            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <div style={{ paddingBottom: "10px" }}>
                  <label className="form-label">longitude*</label>
                </div>

                <TextField
                  fullWidth
                  label="Longitude"
                  value={longitude}
                  onKeyPress={(event) => {
                    handleKeyPress(event);
                  }}
                  onChange={(e) => {
                    setLongitude(e.target.value);
                  }}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
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
                    disabled={!storeName ||
                      !address ||
                      !city ||
                      !state ||
                      !country ||
                      !pincode ||
                      !longitude ||
                      !latitude ||
                      !storeEmail ||
                      !contactNo || checkMobileValid}
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
    </>
  );
};

export default AddStore;
