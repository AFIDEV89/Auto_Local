
import React, { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

import * as actions from '@redux/actions';

import SignUpComponent from './Component';
import { validateDetail } from './Helpers';
import OtpModal from '../profile/OtpModal';

const initialDetail = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  mobile_no: "",
  is_phone_verified: false
};

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [details, setDetails] = useState(Object.assign({}, initialDetail));
  const [errors, setErrors] = useState({});

  const handleChangeInput = useCallback((e) => {
    const { name, value } = e.target;
    const temp = Object.assign({}, details);
    temp[name] = value;
    const errors = validateDetail(temp);

    setErrors(errors);
    setDetails(temp);
  }, [details]);

  const handleSignUpRequest = useCallback((e) => {
    e.preventDefault();

    if (!Object.keys(errors).length > 0) {
      dispatch(
        actions.getSignUpRequest(details, (res) => {
          if (res) {
            setDetails(Object.assign({}, initialDetail));
            navigate('/login');
          }
        })
      );
    }

  }, [details, dispatch, navigate]);

  return (
    <>
      <SignUpComponent
        details={details}
        errors={errors}
        onSignUpRequest={handleSignUpRequest}
        setIsOtpModalOpen={setIsOtpModalOpen}
        onChangeInput={handleChangeInput} />
      {
        isOtpModalOpen && (<OtpModal
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          phone={details.mobile_no}
          setUserDetail={setDetails}
        />)
      }
    </>

  );
};

export default SignUp;
