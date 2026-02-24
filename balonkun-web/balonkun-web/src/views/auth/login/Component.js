import React from "react";
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
import { Link } from 'react-router-dom';

import { ErrorMessage } from '@views/components';

import { FIELD_LIST } from './Config';
import NewCustomer from '../components/new-customer';
import Support from '../../my-cart/components/support';
import { validateDetail } from './Helpers';

const LoginComponent = ({ details, errors, onLoginRequest, onChangeInput }) => {
  return (
    <>
      <div className="login-signup-card-wrapper">
        <Container>

          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Log in</BreadcrumbItem>
          </Breadcrumb>

          <h2 className="title">Customer Login</h2>

          <Row>
            <Col lg={6}>
              <div className="login-signup-card">
                <h4>Registered Customers</h4>
                <p>If you have an account, sign in with your email address.</p>
                <form onSubmit={onLoginRequest}>
                  <FormGroup>
                    <Label htmlFor={FIELD_LIST.EMAIL}>
                      Email<span>*</span>
                    </Label>
                    <Input
                      value={details.email}
                      name={FIELD_LIST.EMAIL}
                      placeholder="Enter Email"
                      type='email'
                      onChange={onChangeInput}
                    />
                    <ErrorMessage name={FIELD_LIST.EMAIL} errors={errors} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={FIELD_LIST.PASSWORD}>
                      Password<span>*</span>
                    </Label>
                    <Input
                      value={details.password}
                      name={FIELD_LIST.PASSWORD}
                      placeholder="Enter Password"
                      type='password'
                      onChange={onChangeInput}
                    />
                    <ErrorMessage name={FIELD_LIST.PASSWORD} errors={errors} />
                  </FormGroup>
                  <FormGroup>
                    <div className="login-btn-wrap">
                      <Button className="login-btn" disabled={!!Object.keys(validateDetail(details)).length}>Sign In</Button>
                      <Link to="/forgot-password" className="forgot-password">
                        Forgot Password
                      </Link>
                    </div>
                  </FormGroup>
                </form>
              </div>
            </Col>
            <Col lg={6}>
              <NewCustomer login={"login"} />
            </Col>
          </Row>
        </Container>
      </div>
      <Support />
    </>
  );
};

export default LoginComponent;
