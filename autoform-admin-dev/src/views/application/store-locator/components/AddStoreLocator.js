import React, { useState, useEffect } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Geocode from "react-geocode";
import axios from "axios";

import API from "api/axios";
import { GoogleMap_API, gridSpacing } from "store/constant";
import { successAlert, apiErrorHandler, errorAlert } from "views/helpers";
import Map from "./GoogleMap";
import '../index.css';

const AddStoreLocator = ({
  editStoreData,
  reloadApi,
  onClose
}) => {
  const isEdit = Boolean(editStoreData && editStoreData.StoreID);
  const [loading, setLoading] = useState(false);
  
  // Store Data (PascalCase to match Hostinger DB)
  const [StoreName, setStoreName] = useState(editStoreData?.StoreName || "");
  const [StoreAdd, setStoreAdd] = useState(editStoreData?.StoreAdd || "");
  const [StateID, setStateID] = useState(editStoreData?.StateID || "");
  const [CityID, setCityID] = useState(editStoreData?.CityID || "");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  
  // Location Data for Dropdowns
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [timings, setTimings] = useState({
    Monday: "9 am - 9 pm", Tuesday: "9 am - 9 pm", Wednesday: "9 am - 9 pm",
    Thursday: "9 am - 9 pm", Friday: "9 am - 9 pm", Saturday: "9 am - 9 pm",
    Sunday: "9 am - 9 pm", Closed: ""
  });
  
  // Google Maps Helpers
  const [googleSearchAddr, setGoogleSearchAddr] = useState("");
  const [locationLatLang, setLocationLatLang] = useState({});

  useEffect(() => {
    fetchStates();
    if (isEdit && editStoreData?.StoreLoc) {
        const [lat, lng] = editStoreData.StoreLoc.split(',');
        setLatitude(lat);
        setLongitude(lng);
        setLocationLatLang({ lat: parseFloat(lat), lng: parseFloat(lng) });
        fetchStoreTimings(editStoreData.StoreID);
    }
  }, [isEdit, editStoreData]);

  const fetchStoreTimings = async (id) => {
    try {
      const res = await API.post("/store-locator-isolated/getStoreTimings", { storeid: id });
      if (res.data && res.data.raw) {
        setTimings(res.data.raw);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (StateID) fetchCities(StateID);
  }, [StateID]);

  const fetchStates = async () => {
    try {
      const res = await API.get("/store-locator-isolated/get-states");
      setStates(res.data.data);
    } catch (error) { console.error(error); }
  };

  const fetchCities = async (id) => {
    try {
      const res = await API.get(`/store-locator-isolated/get-cities?StateID=${id}`);
      setCities(res.data.data);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        StoreName,
        StoreAdd,
        StoreLoc: `${latitude},${longitude}`,
        CityID,
        StateID,
        timings: timings
      };

      let response;
      if (isEdit) {
        response = await API.put(`/store-locator-isolated/update/${editStoreData.StoreID}`, payload);
      } else {
        response = await API.post("/store-locator-isolated/create", payload);
      }

      if (response.status === 200 || response.status === 201) {
        successAlert(`Store ${isEdit ? "updated" : "added"} successfully.`);
        reloadApi();
        onClose();
      } else {
        errorAlert(response.data?.message || "Operation failed.");
      }
    } catch (error) {
      apiErrorHandler(error, `Failed to ${isEdit ? "update" : "save"} store.`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFind = () => {
    if (!googleSearchAddr) return;
    const config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${googleSearchAddr}&inputtype=textquery&fields=formatted_address%2Cgeometry&key=${GoogleMap_API}`
    };
    axios(config).then((res) => {
      const candidate = res.data?.candidates?.[0];
      if (candidate) {
        const { lat, lng } = candidate.geometry.location;
        setStoreAdd(candidate.formatted_address);
        setLatitude(lat);
        setLongitude(lng);
        setLocationLatLang({ lat, lng });
      }
    }).catch(console.error);
  };

  return (
    <>
      <DialogTitle>{isEdit ? "Edit Isolated Store" : "Add Isolated Store"}</DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search via Google Maps"
              value={googleSearchAddr}
              onChange={(e) => setGoogleSearchAddr(e.target.value)}
              placeholder="Enter store location..."
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Map 
              setLongitude={setLongitude} setLatitude={setLatitude} setAddress={setStoreAdd} 
              locationLatLang={locationLatLang} 
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider><span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Store Hours</span></Divider>
          </Grid>

          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <Grid item xs={12} sm={6} md={3} key={day}>
              <TextField 
                fullWidth 
                size="small"
                label={day} 
                value={timings[day] || "9 am - 9 pm"} 
                onChange={(e) => setTimings(prev => ({ ...prev, [day]: e.target.value }))} 
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={9}>
            <TextField 
              fullWidth 
              size="small"
              label="Closed Notice (e.g. Closed on Holidays)" 
              value={timings.Closed || ""} 
              onChange={(e) => setTimings(prev => ({ ...prev, Closed: e.target.value }))} 
            />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Store Name" value={StoreName} onChange={(e) => setStoreName(e.target.value)} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Street Address" value={StoreAdd} onChange={(e) => setStoreAdd(e.target.value)} required />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select value={StateID} label="State" onChange={(e) => setStateID(e.target.value)}>
                {states.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={!StateID}>
              <InputLabel>City</InputLabel>
              <Select value={CityID} label="City" onChange={(e) => setCityID(e.target.value)}>
                {cities.map((c) => <MenuItem key={c.CityID} value={c.CityID}>{c.CityName}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button variant="text" color="error" onClick={onClose}>Cancel</Button>
          <LoadingButton
            variant="contained"
            color="secondary"
            loading={loading}
            onClick={handleSubmit}
            disabled={!StoreName || !StoreAdd || !StateID || !CityID || !latitude}
          >
            {isEdit ? "Update Store" : "Save Store"}
          </LoadingButton>
        </Stack>
      </DialogActions>
    </>
  );
};

export default AddStoreLocator;
