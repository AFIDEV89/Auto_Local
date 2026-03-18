import * as actions from '@redux/actions';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDataApi } from '../../../services/ApiCaller';
import location from "../../../utils/location";

const useGetBrandModel = () => {
  const dispatch = useDispatch();
  const [brandList, setBrandList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const { isLogin, vehicleTypeId, vehicleBrandId, vehicleBrandModelId, vehicleLocationId } = useSelector(state => state.user);

  const fetchBrands = useCallback(async () => {
    const data = {};
    if (vehicleTypeId) {
      data.vehicle_type_id = vehicleTypeId;
    }
    const result = await getDataApi({ path: 'brand/get-list', data });
    if (result?.data?.data) {
      setBrandList(result.data.data);
    }
  }, [vehicleTypeId]);

  const fetchBrandModels = useCallback(async (brand) => {
    if (!(brand?.id)) {
      return;
    }
    const data = { brand_id: brand.id };
    const result = await getDataApi({ path: 'brand-model/get-list', data });
    if (result?.data?.data) {
      setModelList(result.data.data);
    }
  }, []);

  const fetchStoreLocation = useCallback(async (location) => {
    const result = await getDataApi({ path: 'store/get-list', location });

    if (result?.data?.data) {
      const filteredArray = result?.data?.data.filter(item => item?.address?.city !== null);
      
      setStoreList(filteredArray);
    }
  }, []);

  const handleUpdateUserVehicle = useCallback((key, id) => {
    let request = { [key]: id };
    if (key === 'vehicle_brand_id') {
      request.vehicle_brand_model_id = 0;
    } else if (key === 'vehicle_type_id') {
      request.vehicle_brand_id = 0;
      request.vehicle_brand_model_id = 0;
    }
    else if (key === 'vehicle_location_id')
      location.value = id;

    if (isLogin) {
      dispatch(actions.updateUserProfileRequest(request));
    } else {
      dispatch(actions.updateUserProfileSuccess(request));
    }
  }, [dispatch, isLogin]);

  const handleUpdatePincode = useCallback((pincode) => {
    dispatch(actions.setPincode({ locationPinCode: pincode }));
  }, [dispatch])

  const selectedBrand = useMemo(() => {
    return brandList.find(brand => brand.id === vehicleBrandId);
  }, [brandList, vehicleBrandId]);

  const selectedBrandModel = useMemo(() => {
    return modelList.find(model => model.id === vehicleBrandModelId);
  }, [modelList, vehicleBrandModelId]);

  const selectedLocation = useMemo(() => {
    return storeList.find(location => location.id === vehicleLocationId);
  }, [storeList, vehicleLocationId]);

  useEffect(() => {
    if (selectedBrand && !!(brandList.length)) {
      fetchBrandModels(selectedBrand);
    }
  }, [brandList, selectedBrand]);

  useEffect(() => {
    fetchBrands();
  }, [vehicleTypeId]);

  useEffect(() => {
    if (selectedBrandModel && !!(modelList.length)) {
      fetchStoreLocation();
    }
  }, [modelList, selectedBrandModel, fetchStoreLocation]);

  return {
    brandList,
    modelList,
    storeList,
    selectedBrand,
    selectedBrandModel,
    selectedLocation,
    handleUpdatePincode,
    onSelect: fetchBrandModels,
    onUpdateUserVehicle: handleUpdateUserVehicle 
  }
};


export default useGetBrandModel;