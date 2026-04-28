import API from "api/axios";
import { successAlert, errorAlert } from "views/helpers";

export const getLimit = async () => {
  try {
    const response = await API.get(`/web-setting/detail`
    );
    if (response && response.data && response.data.statusCode === 200) {
      return response?.data;
    } else {
      return false;
    }
  } catch (error) {
    alert("Something went wrong while getting the Store List");
  }

};

export const crateLimit = async (payload) => {
  try {
    const response = await API.post(`/web-setting/create`, payload);

    if (response && response.data && response.data.statusCode === 204 || response.data.statusCode === 201) {
      setTimeout(() => {
        successAlert(response.data.message);
      }, 200);

      return response?.data;
    } 
    else {
      if (response && response.data && response.data.statusCode !== 200) {
        errorAlert(response.data.message);
      }
      return false;
    }
  } catch (error) {
    alert("Something went wrong while getting the Store List");
  }

};

export const updateLimit = async (payload) => {
  try {
    const response = await API.put(`/web-setting/update`, payload);

    if (response && response.data && response.data.statusCode === 204) {
      setTimeout(() => {
        successAlert(response.data.message);
      }, 200);

      return response?.data;
    } 

    else {
      if (response && response.data && response.data.statusCode !== 200) {
        errorAlert(response.data.message);
      }
      return false;
    }
  } catch (error) {
    alert("Something went wrong while getting the Store List");
  }
};