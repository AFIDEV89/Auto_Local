import React from "react";

const  Colors = ({
	product
}) => {

	if(product.product_variants?.length === 0) {
		return <></>
	}

	return (
		<div className="color-wrap">
			{product.product_variants?.map((pv, index) => {
				if (!pv.color) return null;
				return pv.color.hexadecimal_code ? (
					<div
						style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
						key={`${pv.color}_variant_${index}`}
					>
						<div
							className="product-color-box"
							style={{ backgroundColor: pv.color.hexadecimal_code }}
						/>
						{pv.product_variant_minor_colors?.map((pvmc, index) => {
							if (!pvmc.color) return null;
							return pvmc.color.hexadecimal_code ? (
								<div
									className="product-color-box-minor"
									key={`${pvmc.color.hexadecimal_code}_minor_${index}`}
									style={{ backgroundColor: pvmc.color.hexadecimal_code }}
								/>
							) : (
								<div key={`${pv.color.name}_name_${index}`}> {pvmc.color.name}</div>
							);
						})}
					</div>
				) : (
					<div key={pv.color.name}> {pv.color.name}</div>
				);
			})}
		</div>
	);
}

export default Colors;
