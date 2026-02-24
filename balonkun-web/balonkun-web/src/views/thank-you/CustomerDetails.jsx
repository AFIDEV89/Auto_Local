import React from 'react';

const CustomerDetail = ({ orderData }) => {
	const billingDetails = orderData.billDetails || {};

	return (
		<div className="customer-details">
			<div className="details-flex">
				<p className="heading">Order number</p>
				<div className="data-div">
					<p className="data">{orderData?.order_products?.[0]?.order_id}</p>
				</div>
			</div>
			<div className="details-flex">
				<p className="heading">Order total</p>
				<div className="data-div">
					<p className="data">₹ {billingDetails.total}</p>
				</div>
			</div>
			<div className="details-flex">
				<p className="heading">Delivery to</p>
				<div className="data-div">
					<p className="data">
						{orderData.user?.first_name} {orderData.user?.last_name}
					</p>
				</div>
			</div>
			<div className="details-flex">
				<p className="heading">Pickup Store Address</p>
				<div className="data-div">
					<p className="data">{orderData.store?.name}</p>
					<p className="sub-data">{orderData.store?.address?.street_address}</p>
				</div>
			</div>
		</div>
	);
};

export default CustomerDetail;
