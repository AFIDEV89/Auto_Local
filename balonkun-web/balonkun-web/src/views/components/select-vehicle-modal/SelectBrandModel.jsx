import React from 'react';
import { ReactSelect } from '@views/components';
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

	const customStyles = {
		control: (base, state) => ({
			...base,
			background: '#f8fafc',
			borderColor: state.isFocused ? '#ffb200' : '#f1f5f9',
			borderRadius: '12px',
			padding: '4px 8px',
			minHeight: '52px',
			boxShadow: 'none',
			'&:hover': {
				borderColor: state.isFocused ? '#ffb200' : '#cbd5e1',
			}
		}),
		placeholder: (base) => ({
			...base,
			color: '#94a3b8',
			fontSize: '0.9rem',
			fontWeight: '500'
		}),
		singleValue: (base) => ({
			...base,
			color: '#0f172a',
			fontSize: '0.9rem',
			fontWeight: '600'
		}),
		menu: (base) => ({
			...base,
			borderRadius: '12px',
			overflow: 'hidden',
			border: '1px solid #f1f5f9',
			boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
			zIndex: 9999
		}),
		option: (base, state) => ({
			...base,
			background: state.isSelected ? '#ffb200' : state.isFocused ? '#fff7ed' : 'white',
			color: state.isSelected ? '#0f172a' : '#475569',
			fontSize: '0.85rem',
			fontWeight: state.isSelected ? '700' : '500',
			'&:active': {
				background: '#ffb200'
			}
		})
	};

	return (
		<div className="select-car space-y-4">
			<div className="select-group">
				<label>Vehicle Brand</label>
				<ReactSelect
					options={brandList}
					style={customStyles}
					onSelect={(option) => {
						onSelect(option);
						onUpdateUserVehicle('vehicle_brand_id', option.id);
					}}
					placeholder="Choose Brand"
					value={selectedBrand}
					getOptionLabel={(option) => option.name}
					getOptionValue={(option) => option.id}
				/>
			</div>
			<div className="select-group">
				<label>Vehicle Model</label>
				<ReactSelect
					placeholder="Choose Model"
					style={customStyles}
					value={selectedBrandModel}
					options={modelList}
					onSelect={(option) =>
						onUpdateUserVehicle('vehicle_brand_model_id', option.id)
					}
					getOptionLabel={(option) => option.name}
					getOptionValue={(option) => option.id}
				/>
			</div>
		</div>
	);
}

export default SelectBrandModel;
