import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { fourWheeler, twoWheeler, FourWheeler, TwoWheeler } from "@assets/images";
import { ROUTES, VEHICLE_OPTIONS, VEHICLE_TYPE_ID } from "@shared/constants";
import { ReactSelect } from "@views/components";
import { useGetBrandModel } from "@views/components/custom-hooks";

const dropDownStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderRadius: '16px',
    border: state.isFocused ? '1px solid #ffb200' : '1px solid rgba(255, 178, 0, 0.3)',
    boxShadow: state.isFocused ? '0 0 0 4px rgba(255, 178, 0, 0.1)' : 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(10px)',
    minHeight: '58px',
    padding: '0 12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      border: '1px solid rgba(255, 178, 0, 0.5)',
      backgroundColor: 'rgba(255, 255, 255, 0.55)',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: '15px',
    fontWeight: '600',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#000000',
    fontSize: '15px',
    fontWeight: '700'
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({
    ...base,
    color: 'rgba(0, 0, 0, 0.8)',
    '&:hover': { color: '#ffb200' }
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999999, // 💡 Maximized z-index
    marginTop: '12px',
    borderRadius: '18px',
    overflow: 'hidden',
    backdropFilter: 'blur(50px)', // 💡 Higher blur for floating effect
    backgroundColor: 'rgba(255, 252, 235, 0.98)', // 💡 More solid for legibility over content
    border: '1px solid rgba(255, 178, 0, 0.2)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.25)', // 💡 Combined shadow for depth
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(255, 178, 0, 0.25)' : 'transparent',
    color: '#000000',
    padding: '12px 20px',
    fontWeight: state.isFocused ? '700' : '500',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'rgba(255, 178, 0, 0.35)',
    }
  }),
  menuList: (listCss) => ({
    ...listCss,
    padding: '8px',
  })
}


const SelectVehicle = () => {
  const [selectedVehicle, setSelectedVehicle] = useState()
  const navigate = useNavigate();

  const { vehicleTypeId, vehicleBrandId, vehicleBrandModelId, vehicle_location_id } = useSelector((state) => state.user);

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

  const currentLocation = useMemo(() => {
    const store = sortedStoreList.find(s => s.id === vehicle_location_id);
    return store ? { value: store.id, label: store.address.postal_code, data: store } : null;
  }, [sortedStoreList, vehicle_location_id]);

  return (
    <section className="select-vehicle-wrapper">
      <div className="select-vehicle">
        <Container>
          <div className="finder-mobile-header mb-4">
            <h4 className="finder-title text-center mb-3">
              <span>THE</span> <span className="highlight">PERFECT</span> <span>FIT</span>
            </h4>
            <div className="finder-vehicle-bar-mobile mx-auto">
              <button
                className={`finder-vehicle-btn-mobile ${VEHICLE_TYPE_ID.FOUR_WHEELER === vehicleTypeId ? "is-active" : ""}`}
                type="button"
                onClick={() => onUpdateUserVehicle("vehicle_type_id", VEHICLE_TYPE_ID.FOUR_WHEELER)}
              >
                <img
                  src={FourWheeler}
                  alt="4 Wheeler"
                  className="vehicle-icon"
                />
              </button>
              <button
                className={`finder-vehicle-btn-mobile ${VEHICLE_TYPE_ID.TWO_WHEELER === vehicleTypeId ? "is-active" : ""}`}
                type="button"
                onClick={() => onUpdateUserVehicle("vehicle_type_id", VEHICLE_TYPE_ID.TWO_WHEELER)}
              >
                <img
                  src={TwoWheeler}
                  alt="2 Wheeler"
                  className="vehicle-icon"
                />
              </button>
            </div>
          </div>

          <div className="finder-form-stacked">
            <div className="col-item">
              <ReactSelect
                style={dropDownStyles}
                placeholder="Make"
                value={selectedBrand ? { value: selectedBrand.id, label: selectedBrand.name, data: selectedBrand } : null}
                options={brandList.map(b => ({ value: b.id, label: b.name, data: b }))}
                onSelect={(option) => {
                  if (option) {
                    onSelect(option.data);
                    onUpdateUserVehicle("vehicle_brand_id", option.value);
                  }
                }}
              />
            </div>

            <div className="col-item">
              <ReactSelect
                style={dropDownStyles}
                placeholder="Model"
                value={modelList.find(m => m.id === vehicleBrandModelId) ? { value: vehicleBrandModelId, label: modelList.find(m => m.id === vehicleBrandModelId).name } : null}
                options={modelList.map(m => ({ value: m.id, label: m.name }))}
                isDisabled={!vehicleBrandId}
                onSelect={(option) => {
                  if (option) {
                    onUpdateUserVehicle("vehicle_brand_model_id", option.value);
                  }
                }}
              />
            </div>

            <div className="col-item">
              <ReactSelect
                style={dropDownStyles}
                placeholder="Location"
                value={currentLocation}
                options={sortedStoreList.map(s => ({ value: s.id, label: s.address.postal_code, data: s }))}
                isDisabled={!vehicleBrandModelId}
                onSelect={(option) => {
                  if (option) {
                    handleUpdatePincode(option.data.address.postal_code);
                    onUpdateUserVehicle("vehicle_location_id", option.value);
                  }
                }}
              />
            </div>

            <div className="col-item go-btn-container">
              <button
                className="go-btn-centered"
                disabled={!(vehicleTypeId && vehicleBrandId && vehicleBrandModelId)}
                onClick={handleGoOnClick}
              >
                Go
              </button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default SelectVehicle;
