import React, { useMemo } from 'react';
import {
	Button,
	FormControl,
	FormControlLabel,
	FormGroup,
	Radio,
	RadioGroup,
	Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ConfirmationModal } from '@views/components';
import { ROUTES } from '@shared/constants';
import { useGetBrandModel, useVehicleTypes } from '../custom-hooks';
import SelectBrandModel from './SelectBrandModel';

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
		<ConfirmationModal
			title="Select Vehicle"
			isOpen={isOpen}
			onClose={() => onToggle(false)}
		>
			<>
				<div>
					<FormControl component="fieldset" style={{ width: '100%', marginBottom: 4 }}>
						<RadioGroup
							aria-label="my-radio-group"
							name="my-radio-group"
							style={{ flexDirection: 'row', justifyContent: 'space-around' }}
							value={userDetails.vehicleTypeId}
							onChange={(event) =>
								onUpdateUserVehicle(
									'vehicle_type_id',
									parseInt(event.target.value)
								)
							}
						>
							{vehicleTypeList.map((vehicle) => {
								return (
									<FormControlLabel
										value={vehicle.id}
										control={<Radio />}
										label={vehicle.name}
										key={vehicle.id}
									/>
								);
							})}
						</RadioGroup>
					</FormControl>
				</div>

				<SelectBrandModel />

				{warning && <Typography style={{ color: 'red' }} variant="subtitle2" sx={{ marginBottom: 2 }}>{warning}</Typography>}

				<FormGroup>
					<div
						className="login-btn-wrap select-vehicle-modal-go"
						onClick={() => {
							if (canGoToListing) {
								navigate(
									`${ROUTES.PRODUCT_LISTING}?vid=${userDetails.vehicleTypeId || 0
									}&bid=${userDetails.vehicleBrandId || 0}&mid=${userDetails.vehicleBrandModelId || 0
									}`
								);
							}
						}}
					>
						<Button variant="contained" className="login-btn" disabled={!canGoToListing}>
							Go
						</Button>
					</div>
				</FormGroup>
			</>
		</ConfirmationModal>
	);
}

export default SelectVehicleModal;
