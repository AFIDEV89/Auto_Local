import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as actions from '@redux/actions';

import LoginComponent from './Component';
import { validateDetail } from './Helpers';

const initialDetail = {
	email: '',
	password: ''
};

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [details, setDetails] = useState(Object.assign({}, initialDetail));
	const [errors, setErrors] = useState({});

	const handleLoginRequest = useCallback((e) => {
		e.preventDefault();
		dispatch(
			actions.getLoginRequest(details, (res) => {
				if (res.login_session_token) {
					navigate('/');
					setDetails(Object.assign({}, initialDetail));
				}
			})
		);
	}, [details, dispatch, navigate]);

	const handleChangeInput = useCallback((e) => {
		const { name, value } = e.target;
		const temp = Object.assign({}, details);
		temp[name] = value;
		const errors = validateDetail(temp);
		setErrors(errors);
		setDetails(temp);
	}, [details]);

	return <LoginComponent
		details={details}
		errors={errors}
		onLoginRequest={handleLoginRequest}
		onChangeInput={handleChangeInput}
	/>;
};

export default Login;
