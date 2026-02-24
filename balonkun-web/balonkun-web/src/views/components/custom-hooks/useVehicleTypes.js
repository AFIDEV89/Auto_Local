import * as actions from "@redux/actions";
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";

function useVehicleTypes() {
  const dispatch = useDispatch();
  const [vehicleTypeList, setVehicleTypeList] = useState([]);

  useEffect(() => {
    dispatch(
      actions.getVehicleTypeListRequest((res) => {
        setVehicleTypeList(res);
      })
    );
  }, []);

  return vehicleTypeList;
}

export default useVehicleTypes;
