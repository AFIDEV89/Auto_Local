import React, { useState } from 'react';
import {
	Container,
	Row,
	Col,
	Breadcrumb,
	BreadcrumbItem,
	FormGroup,
	Label,
	Input,
	Button,
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import * as actions from '@redux/actions';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const dispatch = useDispatch();

	const handleSendEmail = (e) => {
		e.preventDefault();
		if (email.length > 0) {
			dispatch(actions.getForgotPasswordRequest(email, (res) => {
				if (res) {
					setEmail('');
				}
			}));
		}
	};

	const onChangeInput = (e) => {
		const { value } = e.target;
		setEmail(value);
	};

	return (
		<div className="login-signup-card-wrapper">
			<Container>
				<Breadcrumb>
					<BreadcrumbItem>
						<Link to="/">Home</Link>
					</BreadcrumbItem>
					<BreadcrumbItem active>Forgot Password</BreadcrumbItem>
				</Breadcrumb>

				<h2 className="title">Forgot your password</h2>

				<Row>
					<Col lg={6}>
						<div className="login-signup-card">
							<p>
								Enter your registered email address for your account. We'll send
								an email with a link to reset your password
							</p>
							<form onSubmit={handleSendEmail}>
								<FormGroup>
									<Label htmlFor="email">
										Email<span>*</span>
									</Label>
									<Input
										value={email}
										name={'EMAIL'}
										placeholder="Enter Email"
										type="email"
										onChange={onChangeInput}
									/>
								</FormGroup>
								<FormGroup>
									<div className="login-btn-wrap">
										<Button disabled={!email} className="login-btn">
											Send
										</Button>
									</div>
								</FormGroup>
							</form>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default ForgotPassword;
