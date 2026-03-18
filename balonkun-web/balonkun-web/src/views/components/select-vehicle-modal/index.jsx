import React, { useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@shared/constants';
import { TwoWheeler, FourWheeler } from '@assets/images';
import { useGetBrandModel, useVehicleTypes } from '../custom-hooks';
import SelectBrandModel from './SelectBrandModel';
import "@assets/scss/select-vehicle-modal.scss";

function SelectVehicleModal({ isOpen, warning, userDetails, onToggle }) {
	const navigate = useNavigate();
	const vehicleTypeList = useVehicleTypes();
	const { onUpdateUserVehicle } = useGetBrandModel();

	const canGoToListing = useMemo(
		() =>
			userDetails.vehicleTypeId &&
			userDetails.vehicleBrandId &&
			userDetails.vehicleBrandModelId,
		[userDetails]
	);

	return (
		<Modal
			isOpen={isOpen}
			toggle={() => onToggle(false)}
			centered
			className="select-vehicle-modal"
			backdrop="static"
		>
			<ModalHeader toggle={() => onToggle(false)}>
				Select Vehicle
			</ModalHeader>
			<ModalBody>
				<div className="vehicle-type-grid">
					{vehicleTypeList.map((vehicle) => {
						const isActive = userDetails.vehicleTypeId === vehicle.id;
						const icon = vehicle.name.toUpperCase().includes('2W') ? TwoWheeler : FourWheeler;
						
						return (
							<div 
								key={vehicle.id}
								className={`vehicle-type-card ${isActive ? 'active' : ''}`}
								onClick={() => onUpdateUserVehicle('vehicle_type_id', vehicle.id)}
							>
								<img src={icon} alt={vehicle.name} />
								<span>{vehicle.name}</span>
							</div>
						);
					})}
				</div>

				<SelectBrandModel />

				{warning && (
					<div className="warning-text">
						{warning}
					</div>
				)}

				<div className="modal-actions">
					<Button 
						className="w-full h-[54px] !bg-[#ffb200] hover:!bg-[#e6a100] text-slate-900 font-extrabold uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-xl border-0 shadow-lg transition-all active:scale-[0.98]" 
						disabled={!canGoToListing}
						onClick={() => {
							if (canGoToListing) {
								navigate(
									`${ROUTES.PRODUCT_LISTING}?vid=${userDetails.vehicleTypeId || 0
									}&bid=${userDetails.vehicleBrandId || 0}&mid=${userDetails.vehicleBrandModelId || 0
									}`
								);
								onToggle(false);
							}
						}}
					>
						Explore Products
						<span className="material-symbols-outlined text-lg">arrow_forward</span>
					</Button>
				</div>
			</ModalBody>
		</Modal>
	);
}

export default SelectVehicleModal;
