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
  Dialog,
  MenuItem
} from "@mui/material";

import API from "../../../../api/axios";

// third-party
import LoadingButton from "@mui/lab/LoadingButton";

// project imports
import { gridSpacing } from "store/constant";

// assets
import DeleteIcon from "@mui/icons-material/Delete";
import { successAlert, apiErrorHandler, errorAlert } from "../../../helpers";


const AddBrandData = ({
  event,
  handleDelete,
  handleCloseModal,
  reloadApi,
  editBrand = {},
  open,
  vehicleType=[]
}) => {
  const isCreating = !event;

  const [title, setTitle] = React.useState(null);
  const [brandName , setBrandName]= React.useState(null);
  const [vehicle , setVehicle]= React.useState(null);
  const [brandList , setBrandList]= React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleClearState = () => {
    setTitle("");
    setBrandName(null);
  };


  const handleBrandList = async () => {
    try {
       const response = await API.get(`brand/get-list`);
     
       if (response && response?.data && response?.data?.data )  {
         setBrandList(response?.data?.data);
       }
     } catch (error) {
       setBrandList([]);
       alert("Something went wrong while getting the Brand List");
     }
   };
 
  
 
 
  useEffect(()=>{
   handleBrandList();
  },[])

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let payload = {
        name: title,
        brand_id: brandName,
        vehicle_type_id: vehicle
      };

      const response = await API.post("brand-model/create", payload);
      if (response && response.data && response.data.data) {
        handleCloseModal();
        reloadApi();

        setTimeout(() => {
          successAlert("Brand Model added successfully.");
        }, 200);
      } else {
        errorAlert(response.data.message);
      }
      setLoading(false);
      handleClearState();
    } catch (error) {
      setLoading(false);
      handleClearState();
      apiErrorHandler("Something went wrong while adding the Brand Model");
    }
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    try {
      let payload = {
        name: title,
        id:editBrand.id,
        brand_id:brandName, 
        vehicle_type_id: vehicle
      };

      const response = await API.put(`brand-model/update`, payload);
      if (
        response &&
        response.data &&
        (response.data.statusCode === 200 || response.data.statusCode === 204)
      ) {
        handleCloseModal();
        reloadApi();
        handleClearState();
        setTimeout(() => {
          successAlert("Brand Model updated successfully.");
        }, 200);
      } else if (response.data) {
        errorAlert(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      apiErrorHandler(error, "Something went wrong while updating the Brand Model");
    }
  };

  const isEdit = editBrand && editBrand?.id;

  useEffect(() => {
    if (editBrand && editBrand?.id) {
      setTitle(editBrand?.name || "");
      setBrandName(editBrand?.brand_id ||null);
      setVehicle(editBrand?.vehicle_type_id ||null)
    }
  }, [editBrand, editBrand.id]);

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
          {isEdit ? "Edit Brand Model Data" : "Add Brand Model Data"}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={gridSpacing}>
   

            <Grid item xs={12}>
              <div style={{ paddingBottom: "10px" }}>
                <label className="form-label">Brand Model Name*</label>
              </div>

              <TextField
                fullWidth
                label="Brand Model Name"
                value={title}
                inputProps={{ maxLength: 100 }}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </Grid>

            <Grid item xs={12}>
                <TextField
                  id="standard-select-currency"
                  select
                  value={brandName}
                  name="category_id"
                  label="Select Brand*"
                  fullWidth
                  onChange={(event) => setBrandName(event.target.value)}
                >
                  {brandList &&
                    brandList.length > 0 &&
                    brandList.map((option) => (
                      <MenuItem
                        key={option.id}
                        value={option.id}
                        selected={
                          brandName && brandName === option.id ? true : false
                        }
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-select-currency"
                  select
                  value={vehicle}
                  name="vehicle_id"
                  label="Select Vehicle Type*"
                  fullWidth
                  onChange={(event) => setVehicle(event.target.value)}
                >
                  {vehicleType &&
                    vehicleType.length > 0 &&
                    vehicleType.map((option) => (
                      <MenuItem
                        key={option.id}
                        value={option.id}
                        selected={
                          vehicle && vehicle === option.id ? true : false
                        }
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                </TextField>
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
                  disabled={!title ||!brandName ||!vehicle }
                >
                  {isEdit ? "Update Brand Model" : "Add Brand Model"}
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddBrandData;
