function ProductPrice({ product }) {
	return (
		<div className="price">
			{product.discounted_price ? (
				<>
					<p className="with-discount">₹ {product.discounted_price}</p>
					<p className="without-discount">₹ {product.original_price}</p>
				</>
			) : (
				<p className="with-discount">₹ {product.original_price}</p>
			)}
		</div>
	);
}

export default ProductPrice;
