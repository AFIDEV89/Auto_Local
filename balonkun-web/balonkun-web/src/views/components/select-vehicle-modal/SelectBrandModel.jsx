import React from 'react';
import { ReactSelect } from '@views/components';
import { FormGroup } from 'reactstrap';
import { useGetBrandModel } from '../custom-hooks';

function SelectBrandModel() {
	const {
		brandList,
		modelList,
		selectedBrand,
		selectedBrandModel,
		onSelect,
		onUpdateUserVehicle,
	} = useGetBrandModel();

	return (
		<div className="select-car">
			<FormGroup className="select">
				<ReactSelect
					options={brandList}
					onSelect={(option) => {
						onSelect(option);
						onUpdateUserVehicle('vehicle_brand_id', option.id);
					}}
					placeholder="Select Brand"
					value={selectedBrand}
					getOptionLabel={(option) => option.name}
					getOptionValue={(option) => option.id}
				/>
			</FormGroup>
			<FormGroup className="select">
				<ReactSelect
					placeholder="Select Model"
					value={selectedBrandModel}
					options={modelList}
					onSelect={(option) =>
						onUpdateUserVehicle('vehicle_brand_model_id', option.id)
					}
					getOptionLabel={(option) => option.name}
					getOptionValue={(option) => option.id}
				/>
			</FormGroup>
		</div>
	);
}

export default SelectBrandModel;
