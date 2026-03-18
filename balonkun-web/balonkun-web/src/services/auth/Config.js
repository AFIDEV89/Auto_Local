export default {
	getLoginRequest: {
		path: 'user/login',
	},
	getSignUpRequest: {
		path: 'user/sign-up',
	},
	getVerifyEmailRequest: {
		path: (token) => `user/verify-email/${token}`,
	},
	getForgotPasswordRequest: {
		path: 'user/forgot-password',
	},
	getResetPasswordRequest: {
		path: 'user/reset-password',
	},
	getChangePasswordRequest: {
		path: 'user/change-password',
	},
	getLogoutRequest: {
		path: 'user/logout',
	},
	updateUserProfile: {
		path: 'user/update'
	}
};
