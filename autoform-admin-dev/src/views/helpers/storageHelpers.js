import API from "api/axios";

export const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

export const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const getRefreshToken = async (id) => {

  try {
    const response = await API.get(`/user/refresh-token/${id}`);
    if (response && response.data && response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    return error;

  }
};

export const removeToken = (c_name, value, exdays) => {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() - exdays);
  var c_value =
    escape(value) +
    (exdays == null ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value + "; path=/";
};