import React from 'react';
import { formatNumberToIndian, getProductPicture } from "@utils"

const OrderDetail = ({ orderData }) => {
	const billingDetails = orderData.billDetails || {};

	return (
		<div className="order-details">
			<p className="order-txt">Order details</p>

			{orderData.order_products?.map((product) => {
				const image = getProductPicture(product.product);

				return (
					<div className="order-flex" key={product.product.name}>
						<img src={image} alt={product.product.name} />
						<div className="details">
							<h5 className="order-title">{product.product.name}</h5>
							<div className="qty-price">
								<p className="mb-0">Qty: {product.quantity}</p>
								<p className="mb-0">₹ {formatNumberToIndian(product.amount_per_product)}</p>
							</div>
						</div>
					</div>
				);
			})}

			<div className="payment-details">
				<h5 className="heading">Payment details</h5>

				<div className="del-total">
					<p>Items</p>
					<p>₹ {formatNumberToIndian(billingDetails.subTotal)}</p>
				</div>

				<div className="del-total">
					<p>Shipping Charges</p>
					<p>₹ {formatNumberToIndian(billingDetails.shipping)}</p>
				</div>

				<div className="del-total">
					<p>Tax + GST</p>
					<p>₹ {formatNumberToIndian(billingDetails.tax + billingDetails.gst)}</p>
				</div>


				<div className="del-total">
					<p><b>Order Total</b></p>
					<p><b>₹ {formatNumberToIndian(billingDetails.total)}</b></p>
				</div>
			</div>
		</div>
	);
};

export default OrderDetail;
