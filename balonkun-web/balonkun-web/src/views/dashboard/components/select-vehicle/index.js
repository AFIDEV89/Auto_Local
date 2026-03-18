import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { ROUTES, VEHICLE_OPTIONS } from "@shared/constants";
import { ReactSelect } from "@views/components";
import { useGetBrandModel } from "@views/components/custom-hooks";

const dropDownStyles = {
  control: (baseStyles) => ({
    ...baseStyles,
    borderRadius: 0,
    borderTop: 0,
    borderBottom: 0,
    borderLeft: 0
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  menu: (base) => ({
    ...base,
    zIndex: 9999909,
    maxHeight: "9rem"
  }),
  menuList: (listCss) => ({
    ...listCss,
    zIndex: 99999999,
    maxHeight: "9rem",
  })
}


const SelectVehicle = () => {
  const [selectedVehicle, setSelectedVehicle] = useState()
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
    <section className="select-vehicle-wrapper">
      <div className="select-vehicle">
        <Container>
          <Row>
            <Col lg md={6} sm={6} xs={6} className="col-item">
              <ReactSelect
                style={dropDownStyles}
                placeholder="Vehicle"
                value={selectedVehicle}
                options={VEHICLE_OPTIONS}
                onSelect={(option) => {
                  onSelect(option);
                  setSelectedVehicle(option);
                  onUpdateUserVehicle("vehicle_type_id", option.value);
                }}
              />
            </Col>

            <Col lg md={6} sm={6} xs={6} className="col-item">
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
            </Col>

            <Col lg md={6} sm={6} xs={6} className="col-item">
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
            </Col>

            <Col lg md={6} sm={6} xs={6} className="col-item">
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
            </Col>

            <Col lg md={12} sm={12} xs={12} className="col-item">
              <button
                className="go-btn"
                disabled={!(vehicleTypeId && vehicleBrandId && vehicleBrandModelId)}
                onClick={handleGoOnClick}
              >
                Go
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default SelectVehicle;
