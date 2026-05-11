import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fourWheeler, twoWheeler, FourWheeler, TwoWheeler } from "@assets/images";
import { ROUTES, VEHICLE_TYPE_ID } from "@shared/constants";
import { ReactSelect } from "@views/components";
import { useGetBrandModel } from "@views/components/custom-hooks";

const modernDropDownStyles = {
  control: (base, state) => ({
    ...base,
    height: '50px',
    backgroundColor: '#f7f7f5',
    border: state.isFocused ? '1px solid #ffb200' : '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: 'none',
    '&:hover': {
      border: '1px solid #ffb200',
    },
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: '#0f172a',
    fontFamily: '"Space Grotesk", sans-serif',
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 1rem',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#64748b',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#0f172a',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? '#ffb200' : '#6b7280',
    '&:hover': {
      color: '#ffb200',
    },
    transition: 'all 0.2s ease',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#ffffff',
    borderRadius: '1.25rem',
    marginTop: '8px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f1f5f9',
    overflow: 'hidden',
    padding: '8px',
    zIndex: 9999,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menuList: (base) => ({
    ...base,
    padding: '0',
    maxHeight: '250px',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#cbd5e1',
      borderRadius: '20px',
      border: '2px solid transparent',
      backgroundClip: 'content-box',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#94a3b8',
      borderRadius: '20px',
      border: '2px solid transparent',
      backgroundClip: 'content-box',
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#ffb200'
      : state.isFocused
        ? '#fffbeb'
        : 'transparent',
    color: state.isSelected ? '#0f172a' : '#334155',
    padding: '10px 16px',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    fontWeight: state.isSelected ? '600' : '500',
    transition: 'all 0.2s ease',
    '&:active': {
      backgroundColor: '#ffb200',
    },
  }),
};

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
    navigate(`${ROUTES.PRODUCT_LISTING}?vid=${vehicleTypeId || 0}&bid=${vehicleBrandId || 0}&mid=${vehicleBrandModelId || 0}&lid=${vehicleBrandModelId || 0}&pcid=10`);
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

  const brandOptions = useMemo(() => brandList.map(b => ({ value: b.id, label: b.name, data: b })), [brandList]);
  const modelOptions = useMemo(() => modelList.map(m => ({ value: m.id, label: m.name })), [modelList]);
  const locationOptions = useMemo(() => sortedStoreList.map(s => ({ value: s.id, label: s.address.postal_code, data: s })), [sortedStoreList]);

  const currentBrand = useMemo(() => brandOptions.find(o => o.value === vehicleBrandId) || null, [brandOptions, vehicleBrandId]);
  const currentModel = useMemo(() => modelOptions.find(o => o.value === vehicleBrandModelId) || null, [modelOptions, vehicleBrandModelId]);
  const currentLocation = useMemo(() => locationOptions.find(o => o.value === (sortedStoreList.find(s => s.address.postal_code === selectedLocation?.address?.postal_code)?.id)) || null, [locationOptions, sortedStoreList, selectedLocation]);

  return (
    <div className="relative z-40 -mt-16 px-6 lg:px-12 mb-20">
      <div className="finder-panel max-w-[1440px] mx-auto bg-white rounded-3xl shadow-2xl py-[35px] px-6 border border-gray-100 overflow-hidden js-reveal is-visible" style={{ "--reveal-delay": "0ms" }}>
        <div className="finder-grid flex flex-col md:flex-row items-center gap-5 w-full">
          <div className="finder-vehicle-wrap">
            <div className="finder-vehicle-bar inline-flex p-1 rounded-xl bg-[#f3f2ee] border border-gray-200" role="tablist" aria-label="Vehicle type selection">
              <button
                className={`finder-vehicle-btn inline-flex items-center justify-center w-14 h-[42px] rounded-lg transition-all ${VEHICLE_TYPE_ID.FOUR_WHEELER === vehicleTypeId ? "is-active bg-[#ffb200] text-slate-900 shadow-sm" : "text-gray-400 hover:bg-gray-200"}`}
                type="button"
                onClick={() => onUpdateUserVehicle("vehicle_type_id", VEHICLE_TYPE_ID.FOUR_WHEELER)}
                aria-pressed={VEHICLE_TYPE_ID.FOUR_WHEELER === vehicleTypeId}
                title="4 Wheeler"
              >
                <img
                  src={FourWheeler}
                  alt="4 Wheeler"
                  className={`w-8 h-8 object-contain transition-all ${VEHICLE_TYPE_ID.FOUR_WHEELER === vehicleTypeId ? "brightness-0 grayscale-0" : "opacity-40 grayscale"}`}
                />
                <span className="sr-only">4 Wheeler</span>
              </button>
              <button
                className={`finder-vehicle-btn inline-flex items-center justify-center w-14 h-[42px] rounded-lg transition-all ${VEHICLE_TYPE_ID.TWO_WHEELER === vehicleTypeId ? "is-active bg-[#ffb200] text-slate-900 shadow-sm" : "text-gray-400 hover:bg-gray-200"}`}
                type="button"
                onClick={() => onUpdateUserVehicle("vehicle_type_id", VEHICLE_TYPE_ID.TWO_WHEELER)}
                aria-pressed={VEHICLE_TYPE_ID.TWO_WHEELER === vehicleTypeId}
                title="2 Wheeler"
              >
                <img
                  src={TwoWheeler}
                  alt="2 Wheeler"
                  className={`w-8 h-8 object-contain transition-all ${VEHICLE_TYPE_ID.TWO_WHEELER === vehicleTypeId ? "brightness-0 grayscale-0" : "opacity-40 grayscale"}`}
                />
                <span className="sr-only">2 Wheeler</span>
              </button>
            </div>
          </div>

          <div className="finder-field flex-1 w-full">
            <ReactSelect
              placeholder="Select Make"
              options={brandOptions}
              value={currentBrand}
              onSelect={(option) => {
                if (option) {
                  onSelect(option.data);
                  onUpdateUserVehicle("vehicle_brand_id", option.value);
                }
              }}
              style={modernDropDownStyles}
              menuPortalTarget={document.body}
            />
          </div>

          <div className="finder-field flex-1 w-full">
            <ReactSelect
              placeholder="Select Model"
              options={modelOptions}
              value={currentModel}
              isDisabled={!vehicleBrandId}
              onSelect={(option) => {
                if (option) {
                  onUpdateUserVehicle("vehicle_brand_model_id", option.value);
                }
              }}
              style={modernDropDownStyles}
              menuPortalTarget={document.body}
            />
          </div>

          <div className="finder-field flex-1 w-full">
            <ReactSelect
              placeholder="Select Location"
              options={locationOptions}
              value={currentLocation}
              isDisabled={!vehicleBrandModelId}
              onSelect={(option) => {
                if (option) {
                  handleUpdatePincode(option.data.address.postal_code);
                  onUpdateUserVehicle("vehicle_location_id", option.value);
                }
              }}
              style={modernDropDownStyles}
              menuPortalTarget={document.body}
            />
          </div>

          <button
            className={`finder-cta h-[50px] min-w-[170px] rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-md bg-[#2D4739] text-white hover:bg-[#23382d] active:scale-95 ${!(vehicleTypeId && vehicleBrandId && vehicleBrandModelId)
              ? "cursor-not-allowed"
              : ""
              }`}
            type="button"
            disabled={!(vehicleTypeId && vehicleBrandId && vehicleBrandModelId)}
            onClick={handleGoOnClick}
          >
            <span className="text-[15px] tracking-tight">View Products</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectDesktopVehicle;