import React, { useEffect, useMemo, useState } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Container
} from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import * as actions from '@redux/actions';
import { ReactSelect } from '@views/components';
import { Box, Divider, Typography, Button } from '@mui/material';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OtpModal from './OtpModal';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const [userDetail, setUserDetail] = useState({
    first_name: '',
    last_name: '',
    vehicle_type_id: '',
    mobile_no: '',
    is_phone_verified: false
  });
  const [vehicleTypeList, setVehicleTypeList] = useState([]);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUserDetail(prev => ({...prev, [name]: value}));
  }

  const onHandleUpdate = (userDetail) => {
    dispatch(actions.updateUserProfileRequest(userDetail));
    dispatch(actions.updateUserProfilePayload(userDetail))
  };

  useEffect(() => {
    dispatch(actions.getVehicleTypeListRequest(list => {
      setVehicleTypeList(list);
    })
    );
  }, [dispatch]);

  useEffect(() => {
    setUserDetail({
      first_name: user.firstName,
      last_name: user.lastName,
      vehicle_type_id: user.vehicleTypeId,
      mobile_no: user.mobile_no,
      is_phone_verified: user.is_phone_verified
    });
  }, [user]);

  const isEditProfile = useMemo(() => location.pathname === '/edit-profile', [location.pathname]);

  const isPhoneValid = userDetail.mobile_no && userDetail.mobile_no.length === 10

  const isDisabled = (
    !userDetail.first_name?.trim() ||
    !userDetail.last_name?.trim() ||
    !isPhoneValid ||
    !userDetail.vehicle_type_id
  )

  return (
    <Container>
      <Box mt={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight={600}>User Profile</Typography>
            <Typography variant="body2">{isEditProfile ? "Edit your personal details" : "Your personal details"}</Typography>
          </Box>
        </Box>
        <Divider sx={{ bgcolor: '#aaa' }} />
      </Box>

      <Row className="login-signup-card-wrapper">
        <Col lg={5} xl={5}>
          <Box className="login-signup-card">
            <form>
              <FormGroup>
                <Label htmlFor="first_name">
                  First Name{isEditProfile && <span>*</span>}
                </Label>
                <Input
                  disabled={!isEditProfile}
                  value={userDetail.first_name}
                  name='first_name'
                  placeholder="Enter first name"
                  type="first_name"
                  onChange={onChangeInput}
                />
                {userDetail.first_name === '' && (
                  <Box style={{ color: 'red' }}>
                    Please enter first name
                  </Box>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="first_name">
                  Last Name{isEditProfile && <span>*</span>}
                </Label>
                <Input
                  disabled={!isEditProfile ? true : false}
                  value={userDetail.last_name}
                  name="last_name"
                  placeholder="Enter Last Name"
                  type="last_name"
                  onChange={onChangeInput}
                />
                {userDetail.last_name === '' && (
                  <Box style={{ color: 'red' }}>Please enter last name</Box>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  disabled
                  value={user.email}
                  name="email"
                  placeholder="Email"
                  type="email"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="mobile_no" style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    Mobile Number{isEditProfile && <span>*</span>}
                  </div>
                  <div>
                    {
                      isPhoneValid && (<>
                        {!userDetail.is_phone_verified || (userDetail.mobile_no !== user.mobile_no) ? (<span className="verifyBtn" onClick={() => setIsOtpModalOpen(true)}>Verify</span>) : (<FontAwesomeIcon icon={faCircleCheck} className="mobileVerify" size='xl' title="Verified" />)}
                      </>)
                    }
                  </div>

                </Label>
                <Input
                  disabled={!isEditProfile ? true : false}
                  value={userDetail.mobile_no}
                  name="mobile_no"
                  placeholder="Enter Mobile Number (Ex. 8989898989)"
                  maxLength={10}
                  minLength={10}
                  type="tel"
                  onChange={onChangeInput}
                />
                {userDetail.mobile_no === '' && (
                  <Box style={{ color: 'red' }}>Please enter mobile number</Box>
                )}
              </FormGroup>

              <Label htmlFor="vehicle-type">
                Vehicle Type{isEditProfile && <span>*</span>}
              </Label>
              {!isEditProfile && <Input
                disabled
                value={vehicleTypeList.find(type => type.id === user.vehicleTypeId)?.name || ''}
              />}
              {isEditProfile &&
                <ReactSelect
                  options={vehicleTypeList}
                  onSelect={(option) => {
                    onChangeInput({ target: { name: 'vehicle_type_id', value: option.id } });
                  }}
                  getOptionLabel={option => option.name}
                  getOptionValue={option => option.id}
                  placeholder='Select vehicle type'
                  value={vehicleTypeList.find(type => type.id === userDetail.vehicle_type_id)}
                />}
            </form>
            
            {isEditProfile && (
              <Button type='button' disabled={isDisabled} variant='contained' sx={{ marginTop: 4 }} onClick={() => onHandleUpdate(userDetail)}>
                Update
              </Button>
            )}
          </Box>
        </Col>
      </Row>

      {
        isOtpModalOpen && (<OtpModal
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          phone={userDetail.mobile_no}
          setUserDetail={setUserDetail}
          onHandleUpdate={onHandleUpdate}
        />)
      }

    </Container>
  );
};

export default ProfilePage;
