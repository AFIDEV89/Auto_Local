import React from 'react';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, FormGroup, Label, Input, Button } from 'reactstrap';
import { Link } from "react-router-dom";
import { mobileNumberValidator } from '@utils';
import { ErrorMessage } from '@views/components';

import { FIELD_LIST } from './Config';
import { validateDetail } from './Helpers';
import NewCustomer from '../components/new-customer';
import Support from '../../my-cart/components/support';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const SignUpComponent = ({ details, errors, onSignUpRequest, onChangeInput, setIsOtpModalOpen }) => {

  return (
    <>
      <div className='login-signup-card-wrapper'>
        <Container>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Sign up</BreadcrumbItem>
          </Breadcrumb>

          <h2 className='title'>Customer Sign up</h2>

          <Row>
            <Col lg={6}>
              <div className='login-signup-card'>
                <h4>Create an account</h4>
                <p>Please fill the below fileds to create a new account</p>
                <form>
                  <Row>
                    <Col lg={6} xl={6}>
                      <FormGroup>
                        <Label htmlFor={FIELD_LIST.FIRST_NAME}>First Name<span>*</span></Label>
                        <Input
                          value={details.first_name}
                          name={FIELD_LIST.FIRST_NAME}
                          placeholder="First Name"
                          type="text"
                          onChange={onChangeInput}
                        />
                        <ErrorMessage name={FIELD_LIST.FIRST_NAME} errors={errors} />
                      </FormGroup>
                    </Col>
                    <Col lg={6} xl={6}>
                      <FormGroup>
                        <Label htmlFor={FIELD_LIST.LAST_NAME}>Last Name<span>*</span></Label>
                        <Input
                          value={details.last_name}
                          name={FIELD_LIST.LAST_NAME}
                          placeholder="Last Name"
                          type="text"
                          onChange={onChangeInput}
                        />
                        <ErrorMessage name={FIELD_LIST.LAST_NAME} errors={errors} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label htmlFor={FIELD_LIST.EMAIL}>Email<span>*</span></Label>
                    <Input
                      value={details.email}
                      name={FIELD_LIST.EMAIL}
                      placeholder="Enter Email"
                      type="email"
                      onChange={onChangeInput}
                    />
                    <ErrorMessage name={FIELD_LIST.EMAIL} errors={errors} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor={FIELD_LIST.MOBILE_NUMBER} style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        Mobile Number<span>*</span>
                      </div>
                      <div>
                        {
                          details.mobile_no && mobileNumberValidator(details.mobile_no) && (
                            <>
                              {!details.is_phone_verified ? <span className="verifyBtn" onClick={() => setIsOtpModalOpen(true)}>Verify</span> :
                                <FontAwesomeIcon icon={faCircleCheck} className="mobileVerify" size='xl' title="Verified" />}
                            </>)
                        }
                      </div>

                    </Label>
                    <Input
                      value={details.mobile_no}
                      name={FIELD_LIST.MOBILE_NUMBER}
                      placeholder="Enter Mobile Number (Ex. 8989898989)"
                      type="tel"
                      maxLength={10}
                      minLength={10}
                      disabled={details.is_phone_verified}
                      onChange={onChangeInput}
                    />
                    <ErrorMessage name={FIELD_LIST.MOBILE_NUMBER} errors={errors} />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor={FIELD_LIST.PASSWORD}>Password<span>*</span></Label>
                    <Input
                      value={details.password}
                      name={FIELD_LIST.PASSWORD}
                      placeholder="Enter Password"
                      type="password"
                      onChange={onChangeInput}
                    />
                    <ErrorMessage name={FIELD_LIST.PASSWORD} errors={errors} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={FIELD_LIST.CONFIRM_PASSWORD}>Confirm Password<span>*</span></Label>
                    <Input
                      value={details.confirm_password}
                      name={FIELD_LIST.CONFIRM_PASSWORD}
                      placeholder="Enter Confirm Password"
                      type="password"
                      onChange={onChangeInput}
                    />
                    <ErrorMessage name={FIELD_LIST.CONFIRM_PASSWORD} errors={errors} />
                  </FormGroup>
                  <FormGroup>
                    <div className='login-btn-wrap'>
                      <Button
                        onClick={onSignUpRequest}
                        type='button'
                        className='login-btn'
                        disabled={!!Object.keys(validateDetail(details)).length || !details.is_phone_verified}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </FormGroup>
                </form>
              </div>
            </Col>
            <Col lg={6}>
              <NewCustomer signup={"signup"} />
            </Col>
          </Row>
        </Container>
      </div>
      <Support />
    </>
  );
};

export default SignUpComponent;