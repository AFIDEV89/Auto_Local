import {
  USER_LOGIN, USER_SIGNUP_REQUEST,
  USER_VERIFY_EMAIL_REQUEST,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_REQUEST,
  USER_LOGOUT,
  UPDATE_USER_PROFILE,
  USER_CHANGE_PASSWORD_REQUEST,
  UPDATE_PROFILE_DATA
} from "@redux/action-types";

export const getLoginRequest = (payload, callback) => ({
  type: USER_LOGIN.REQUEST,
  payload,
  callback
});

export const getLoginSuccess = (payload) => ({
  type: USER_LOGIN.SUCCESS,
  payload,
});

export const getLogoutRequest = () => ({
  type: USER_LOGOUT.REQUEST
});

export const getLogoutSuccess = (callback) => ({
  type: USER_LOGOUT.SUCCESS,
  callback
});

export const getSignUpRequest = (payload, callback) => ({
  type: USER_SIGNUP_REQUEST,
  payload,
  callback
});

export const getVerifyEmailRequest = (payload, callback) => ({
  type: USER_VERIFY_EMAIL_REQUEST,
  payload,
  callback
});

export const getForgotPasswordRequest = (payload, callback) => ({
  type: USER_FORGOT_PASSWORD_REQUEST,
  payload,
  callback
});

export const getResetPasswordRequest = (payload, callback) => ({
  type: USER_RESET_PASSWORD_REQUEST,
  payload,
  callback
});

export const getChangePasswordRequest = (payload, callback) => ({
  type: USER_CHANGE_PASSWORD_REQUEST,
  payload,
  callback
});

export const updateUserProfileRequest = (payload) => ({
  type: UPDATE_USER_PROFILE.REQUEST,
  payload,
});

export const updateUserProfileSuccess = (payload) => ({
  type: UPDATE_USER_PROFILE.SUCCESS,
  payload,
});


export const updateUserProfilePayload = (payload) => ({
  type: UPDATE_PROFILE_DATA,
  payload
})