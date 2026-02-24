import React, { useState, useCallback } from 'react';
import {
	Container,
	Row,
	Col,
	FormGroup,
	Label,
	Input,
	Button,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import * as actions from '@redux/actions';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '@views/components';
import { FIELD_LIST } from './Config';
import { validateDetail } from './Helpers';
import { Box, Divider, Typography } from '@mui/material';

const ChangePassword = () => {
	const initialDetail = {
		current_password: '',
		new_password: '',
		confirm_password: '',
	};

	const [details, setDetails] = useState(Object.assign({}, initialDetail));
	const [errors, setErrors] = useState({});
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleChangeInput = useCallback((e) => {
		const { name, value } = e.target;
		const temp = Object.assign({}, details);
		temp[name] = value;
		const errors = validateDetail(temp);
		setErrors(errors);
		setDetails(temp);
	},
		[details]
	);

	const handleChangePassword = (e) => {
		e.preventDefault();
		const data = {
			current_password: details.current_password,
			new_password: details.new_password,
		};

		dispatch(
			actions.getChangePasswordRequest(data, (res) => {
				if (res) {
					setDetails(Object.assign({}, initialDetail));
					navigate('/login');
				}
			})
		);
	};

	return (
		<Container>
			<Box mt={2}>
				<Typography variant="h5" fontWeight={600} mb={2}>Change your password</Typography>
				<Divider sx={{ bgcolor: '#aaa' }} />
			</Box>

			<Row className="login-signup-card-wrapper">
				<Col lg={5} xl={5}>
					<Box className="login-signup-card">
						<form onSubmit={handleChangePassword}>
							<FormGroup>
								<Label htmlFor="current_password">
									Current Password<span>*</span>
								</Label>
								<Input
									value={details.current_password}
									name={FIELD_LIST.CURRENT_PASSWORD}
									placeholder="Enter Current Password"
									type="current_password"
									onChange={handleChangeInput}
								/>
								<ErrorMessage
									name={FIELD_LIST.CURRENT_PASSWORD}
									errors={errors}
								/>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="password">
									New Password<span>*</span>
								</Label>
								<Input
									value={details.new_password}
									name={FIELD_LIST.NEW_PASSWORD}
									placeholder="Enter New Password"
									type="new_password"
									onChange={handleChangeInput}
								/>
								<ErrorMessage
									name={FIELD_LIST.NEW_PASSWORD}
									errors={errors}
								/>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="confirm password">
									Confirm Password<span>*</span>
								</Label>
								<Input
									value={details.confirm_password}
									name={FIELD_LIST.CONFIRM_PASSWORD}
									placeholder="Ente Confirm Password"
									type="confirm_password"
									onChange={handleChangeInput}
								/>
								<ErrorMessage
									name={FIELD_LIST.CONFIRM_PASSWORD}
									errors={errors}
								/>
							</FormGroup>
							<FormGroup>
								<Box className="login-btn-wrap">
									<Button
										className="login-btn"
										disabled={!!Object.keys(validateDetail(details)).length}
									>
										Update
									</Button>
								</Box>
							</FormGroup>
						</form>
					</Box>
				</Col>
			</Row>
		</Container>
	);
};

export default ChangePassword;
