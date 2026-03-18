import { titleCase } from '../../../../../utils';

function BasicDetails({ product }) {
	return (
		<div>
			<div className="material">
				<p className="txt">Vehicle Brand:</p>
				{titleCase(product.vehicle_detail?.brand?.name || '-')}
			</div>
			<div className="material">
				<p className="txt">Vehicle Model:</p>
				{titleCase(product.vehicle_detail?.brand_model?.name || '-')}
			</div>
			<div className="material">
				<p className="txt">Product Code: </p>
				{product.product_code || '-'}
			</div>
			<div className="material">
				<p className="txt">Availability:</p>
				{product.availability === 'yes' ? 'In Stock' : 'Out Of Stock'}
			</div>
		</div>
	);
}

export default BasicDetails;
