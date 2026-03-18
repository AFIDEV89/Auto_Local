import React from "react"

const Materials = ({ product }) => {
	return (
		<div className="material">
			<div className="material-box">
				{product.product_variants?.map((pvt, index) => (
					<div className="box-wrap" key={`material_${index}`}>
						<p>{pvt?.material?.name}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default Materials;
