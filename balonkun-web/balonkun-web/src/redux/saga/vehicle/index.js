import { takeLatest } from 'redux-saga/effects';

import * as actions from '@redux/action-types';

import * as getVehicleSaga from './vehicle';

function* vehicleSaga() {
  yield takeLatest(actions.GET_VEHICLE_TYPE_LIST.REQUEST, getVehicleSaga.getVehicleTypeListRequest);
  yield takeLatest(actions.GET_VEHICLE_DETAIL_LIST_REQUEST, getVehicleSaga.getVehicleDetailListRequest);
}

export default vehicleSaga;


