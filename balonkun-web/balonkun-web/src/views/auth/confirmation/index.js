import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import * as actions from '@redux/actions';
import { message } from '@assets/images';
import { errorAlert, successAlert } from '@utils';
import { patchDataApi } from '../../../services/ApiCaller';

const Confirmation = () => {
  const [isButton, setIsButton] = useState(false);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const token = pathname.replace('/verify-email/', '');

  useEffect(() => {
    if (token) {
      dispatch(actions.getVerifyEmailRequest(token, (res) => {
        if (res) {
          setIsButton(true);
        }
      }));
    }
  }, [dispatch, token]);

  const resendVerifyToken = async () => {
    try {
      const response = await patchDataApi({
        path: `/user/resend-verify-email`,
        data: {
          token
        }
      });

      if (response && response.data.status === 200) {
        successAlert("Verify email send successfully. Please check your email and verify again. Don't forget to check spam folder.")
      } else {
        errorAlert(response.data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-6 text-center">
          <div className="confirm-box">
            <div className="confirm-header">
              <img src={message} className="img-fluid" alt="" />
            </div>
            <div className="confirm-content">
              <h1>Email Confirmation</h1>
              <p>
                {
                  isButton ?
                    "Your email is verified. Please login to access more features on AutoformIndia." :
                    "Sorry, verification is either failed or already done. Please request a new verification link!"
                }
              </p>
              {isButton ? (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </button>) : (
                <button
                  className="btn btn-primary"
                  onClick={resendVerifyToken}
                >
                  Resend Confirmation Email
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
