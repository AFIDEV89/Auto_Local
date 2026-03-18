import { takeLatest } from 'redux-saga/effects';

import * as actions from '@redux/action-types';

import * as authSaga from './auth';

function* userSaga() {
  yield takeLatest(actions.USER_LOGIN.REQUEST, authSaga.getLoginRequest);
  yield takeLatest(actions.USER_SIGNUP_REQUEST, authSaga.getSignUpRequest);
  yield takeLatest(actions.USER_LOGOUT.REQUEST, authSaga.getLogoutRequest);
  yield takeLatest(actions.USER_CHANGE_PASSWORD_REQUEST, authSaga.getChangePasswordRequest);
  yield takeLatest(actions.USER_FORGOT_PASSWORD_REQUEST, authSaga.getForgotPasswordRequest);
  yield takeLatest(actions.UPDATE_USER_PROFILE.REQUEST, authSaga.updateUserProfileRequest);
  yield takeLatest(actions.USER_RESET_PASSWORD_REQUEST, authSaga.getResetPasswordRequest);
  yield takeLatest(actions.USER_VERIFY_EMAIL_REQUEST, authSaga.getVerifyEmailRequest);
}

export default userSaga;
