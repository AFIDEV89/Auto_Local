import config from './Config';
import { getDataApi, postDataApi, patchDataApi, putDataApi } from '../ApiCaller';

export const getLoginRequest = (loginUserDetail) => {
	const request = config.getLoginRequest;
	return getDataApi({
		path: request.path,
		data: {
			...loginUserDetail
		},
	});
};

export const getSignUpRequest = (signUpUserDetail) => {
	const request = config.getSignUpRequest;
	return postDataApi({
		path: request.path,
		data: {
			...signUpUserDetail
		},
	});
};

export const getVerifyEmailRequest = (token) => {
	const { path } = config.getVerifyEmailRequest;
	return getDataApi({ path: path(token) });
};

export const getForgotPasswordRequest = (userEmail) => {
	const request = config.getForgotPasswordRequest;
	return patchDataApi({
		path: request.path,
		data: {
			email: userEmail,
		},
	});
};

export const getResetPasswordRequest = (userDetail) => {
	const request = config.getResetPasswordRequest;
	return patchDataApi({
		path: request.path,
		data: {
			...userDetail
		},
	});
};

export const getChangePasswordRequest = (userDetail) => {
	const request = config.getChangePasswordRequest;
	return patchDataApi({
		path: request.path,
		data: {
			...userDetail
		},
	});
};

export const getLogoutRequest = () => {
	const request = config.getLogoutRequest;
	return putDataApi(request);
};

export const updateUserProfileRequest = (data) => {
	const { path } = config.updateUserProfile;
	return patchDataApi({ path, data });
};

