import { toast } from "react-toastify";

export const successAlert = (message, toastId) => {
    return toast(message, {
      type: "success",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      ...(toastId && { toastId })
    });
  };
  
  export const errorAlert = (message) => {
    return toast(message, {
      type: "error",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
  };

  export const apiErrorHandler = (err, alternativeMessage) => {
    if (
      err &&
      err.response &&
      err.response.data &&
      err.response.data.message &&
      err.response.data.message.msg
    ) {
      errorAlert(err.response.data.message.msg);
    } else if (
      err &&
      err.response &&
      err.response.data &&
      err.response.data.message
    ) {
      errorAlert(err.response.data.message);
    } else if (alternativeMessage) {
      errorAlert(alternativeMessage);
    }
  };