import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fourWheeler, twoWheeler } from "@assets/images";
import { ROUTES, VEHICLE_TYPE_ID } from "@shared/constants";
import { ReactSelect } from "@views/components";
import { useGetBrandModel } from "@views/components/custom-hooks";

const dropDownStyles = {
  control: (baseStyles) => ({
    ...baseStyles,
    width: "160px",
    border: 0
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  menu: (base) => ({
    ...base,
    maxHeight: "7rem"
  }),
  menuList: (listCss) => ({
    ...listCss,
    maxHeight: "7rem",
    fontSize: "14px"
  })
}

const SelectDesktopVehicle = () => {
  const navigate = useNavigate();

  const { vehicleTypeId, vehicleBrandId, vehicleBrandModelId } = useSelector((state) => state.user);

  const {
    brandList,
    modelList,
    storeList,
    selectedBrand,
    selectedBrandModel,
    selectedLocation,
    onSelect,
    onUpdateUserVehicle,
    handleUpdatePincode
  } = useGetBrandModel();

  const handleGoOnClick = useCallback(() => {
    navigate(`${ROUTES.PRODUCT_LISTING}?vid=${vehicleTypeId || 0}&bid=${vehicleBrandId || 0}&mid=${vehicleBrandModelId || 0}&lid=${vehicleBrandModelId || 0}`);
  }, [
    navigate,
    vehicleTypeId,
    vehicleBrandId,
    vehicleBrandModelId
  ]);

  const sortedStoreList = useMemo(() => storeList
    .filter(store => store.address.postal_code)
    .filter((store, index, self) => index === self.findIndex(t => t.address.postal_code === store.address.postal_code))
    .sort((a, b) => Number(a.address.postal_code) - Number(b.address.postal_code)), [storeList])


  return (
    <section className="select-vehicle-wrapper-desktop">

      <p className="txt">Select Vehicle</p>

      <div className="select-vehicle">
        <div
          className={
            VEHICLE_TYPE_ID.FOUR_WHEELER === vehicleTypeId
              ? "selected-vehicle-image-active"
              : "selected-vehicle-non-active-img"
          }
          title="Four Wheeler"
        >
          <img
            src={fourWheeler}
            className="car hand-icon"
            alt="car"
            onClick={() => onUpdateUserVehicle("vehicle_type_id", VEHICLE_TYPE_ID.FOUR_WHEELER)}
          />
        </div>
        <div
          className={
            VEHICLE_TYPE_ID.TWO_WHEELER === vehicleTypeId
              ? "selected-vehicle-image-active"
              : "selected-vehicle-non-active-img"
          }
          title="Two Wheeler"
        >
          <img
            src={twoWheeler}
            className="scooter hand-icon"
            alt="scooter"
            onClick={() => onUpdateUserVehicle("vehicle_type_id", VEHICLE_TYPE_ID.TWO_WHEELER)}
          />
        </div>

        <ReactSelect
          style={dropDownStyles}
          placeholder="Brand"
          value={selectedBrand}
          options={brandList}
          onSelect={(option) => {
            onSelect(option);
            onUpdateUserVehicle("vehicle_brand_id", option.id);
          }}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
        />

        <ReactSelect
          style={dropDownStyles}
          placeholder="Model"
          value={selectedBrandModel}
          options={modelList}
          onSelect={(option) => {
            onUpdateUserVehicle("vehicle_brand_model_id", option.id);
          }}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
        />

        <ReactSelect
          style={dropDownStyles}
          placeholder="Location"
          value={selectedLocation}
          options={sortedStoreList}
          onSelect={(option) => {
            handleUpdatePincode(option.address.postal_code)
            onUpdateUserVehicle("vehicle_location_id", option.id);
          }}
          getOptionLabel={(option) => option.address.postal_code}
          getOptionValue={(option) => option.id}
        />

        <button
          className="go-btn"
          disabled={!(vehicleTypeId && vehicleBrandId && vehicleBrandModelId)}
          onClick={handleGoOnClick}
        >
          Go
        </button>
      </div>
    </section>
  );
};

export default SelectDesktopVehicle;