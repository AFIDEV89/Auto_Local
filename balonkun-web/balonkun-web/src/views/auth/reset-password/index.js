import React, { useState, useCallback } from 'react';
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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ErrorMessage } from '@views/components';
import { FIELD_LIST } from './Config';
import { validateDetail } from './Helpers';

const ResetPassword = () => {
  const initialDetail = {
    password: '',
    confirm_password: '',
  };
  const [details, setDetails] = useState(Object.assign({}, initialDetail));
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  let token = pathname.replace('/reset-password/', '');

  const handleChangeInput = useCallback(
    (e) => {
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
      token: token,
      password: details.password,
    };

    dispatch(
      actions.getResetPasswordRequest(data, (res) => {
        if (res) {
          setDetails(Object.assign({}, initialDetail));
          navigate('/login');
        }
      })
    );
  };

  return (
    <div className="login-signup-card-wrapper">
      <Container>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Reset Password</BreadcrumbItem>
        </Breadcrumb>

        <h2 className="title">Reset your password</h2>

        <Row>
          <Col lg={6}>
            <div className="login-signup-card">
              <form onSubmit={handleChangePassword}>
                <FormGroup>
                  <Label htmlFor="password">
                    New Password<span>*</span>
                  </Label>
                  <Input
                    value={details.password}
                    name={FIELD_LIST.PASSWORD}
                    placeholder="Enter Password"
                    type="password"
                    onChange={handleChangeInput}
                  />
                  <ErrorMessage name={FIELD_LIST.PASSWORD} errors={errors} />
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
                  <div className="login-btn-wrap">
                    <Button
                      className="login-btn"
                      disabled={!!Object.keys(validateDetail(details)).length}
                    >
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

export default ResetPassword;
