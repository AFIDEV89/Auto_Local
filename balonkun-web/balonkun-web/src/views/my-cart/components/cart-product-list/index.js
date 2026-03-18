import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert, Box, Button, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from 'reactstrap';

import { emptyCart } from '@assets/images';
import { OPERATION_TYPE } from '@shared/constants';
import { getProductPrice } from '@utils';
import Summary from '../summary';
import Support from '../support';
import ShippingProductCard from '../ShippingProductCard/ShippingProductCard';

const CartProductList = ({
	cartList = [],
	storeAddresslist,
	shippingAddressList,
	onHandleOperationType,
	onSetCartList,
	onCartProductDelete,
	onHandleOrderPlaced,
}) => {
	const [storeId, setStoreId] = useState('');
	const [pincodeValue, setPincodeValue] = useState(undefined);
	const [selectedShippingAddressId, setSelectedShippingAddressId] = useState(undefined);
	const pincode = useSelector(state => state.pincode.pincode);

	const isMobile = useMediaQuery('(max-width:576px)');
	const navigate = useNavigate()

	useEffect(() => {
		setPincodeValue(pincode)
	}, [pincode]);

	const filteredStoreAddress = useMemo(() => {
		if (pincodeValue && String(pincodeValue).length === 6) {
			return storeAddresslist.filter(store => Number(store.address.postal_code) === Number(pincodeValue))
		}

		return storeAddresslist
	}, [pincodeValue, storeAddresslist])

	const billDetails = useMemo(() => {
		const subTotal = cartList.reduce((a, item) => (a = a + (getProductPrice(item.product) * item.quantity)), 0);
		const shippingRate = 12;
		const taxRate = 5;
		const gstRate = 5;

		const tax = (subTotal * taxRate) / 100;
		const gst = (subTotal * gstRate) / 100;
		const shipping = (subTotal * shippingRate) / 100;
		const total = Math.round(subTotal + shipping + tax + gst);

		return { 
			subTotal, 
			shippingRate, 
			shipping, 
			taxRate, 
			tax, 
			gstRate, 
			gst, 
			total
		};
	}, [cartList]);

	const onHandleItemCount = (pid, opertaionType, index) => {
		const tempList = cartList.slice();
		onHandleOperationType(pid, opertaionType);
		
		if (opertaionType === OPERATION_TYPE.DECREMENT) {
			tempList[index].quantity = tempList[index].quantity - 1;

			const quantity = tempList[index].quantity;

			if (quantity === 0) {
				onHandleCartProductDelete(pid, index);
				tempList.splice(index, 1);
			}
		} else {
			tempList[index].quantity = tempList[index].quantity + 1;
		}

		onSetCartList(tempList);
	};

	const onHandleCartProductDelete = (pid, index) => {		
		const afterDeleteProductList = cartList.slice();

		onCartProductDelete(pid);

		if (pid) {
			onSetCartList(afterDeleteProductList.filter((o, i) => index !== i));
		}
	};

	const onHandleStoreOrderPlaced = (e) => {
		const store_Id = e.target.value || 'choose_address';
		setStoreId(store_Id);
	};

	const onHandleShippingAddress = (e) => {
		setSelectedShippingAddressId(e.target.value);
	}

	const isStoreSelected = storeId && storeId !== "choose_address"

	return (
		<>
			<div className="cart-items-wrapper">
				<Container>
					<Breadcrumb>
						<BreadcrumbItem>
							<Link to="/">Home</Link>
						</BreadcrumbItem>
						<BreadcrumbItem active>My Cart</BreadcrumbItem>
					</Breadcrumb>

					{!(cartList?.length) && (
						<Box textAlign="center">
							<img src={emptyCart} alt="Empty Cart" width="200" />
							<Typography variant='h6'>Your cart is empty!</Typography>
							<Typography variant='subtitle2' mb={2}>Add items to it now</Typography>

							<Button variant='outlined' onClick={() => navigate("/")}>Shop Now</Button>
						</Box>
					)}
				</Container>

				{cartList.length > 0 && (
					<Container className="cart-items-details">
						<Row>
							<Col md={8}>

								<Alert severity="warning" className='mb-2'>
									*Seat cover will be fitted in the nearest store available in your location.
								</Alert>

								{cartList?.map((item, index) => (
								    <ShippingProductCard
									    key={item.product_id}
									    itemIndex={index}
									    cartItem={item} 
										onHandleItemCount={onHandleItemCount} 
										onHandleCartProductDelete={onHandleCartProductDelete}
									/>)
								)}

								<div className='delivery-box'>
									<div className="selector">
										<div className="input-box">
											<p className="txt">
												Pincode
											</p>
											<TextField
												id="standard-basic"
												variant="standard"
												type='number'
												placeholder="Enter pincode"
												value={pincodeValue}
												InputProps={{
													inputProps: { 
														min: 0,
														max: 999999
													}
												}}
												onChange={(e) => setPincodeValue(e.target.value)}
												className="choose-select"
											/>
										</div>
									</div>

									<div className="selector">
										<div className="input-box">
											<p className="txt">
												<span>*</span>Store Address
											</p>

											<Select
												name="choose-store"
												className="choose-select"
												onChange={onHandleStoreOrderPlaced}
												maxRows={10}
												disabled={!(pincodeValue && filteredStoreAddress.length !== 0)}
												variant='standard'
												MenuProps={{
													PaperProps: {
														sx: {
															'& .MuiMenuItem-root': {
																maxWidth: isMobile ? "100%" : "280px",
																fontSize: "14px",
																whiteSpace: "unset"
															},
														},
													},
												}}
											>
												<MenuItem value="choose_address">Choose Address</MenuItem>
												{filteredStoreAddress.map((item) => {
													return (
													<MenuItem
														value={item.address.store_id}
														key={item.address.store_id}
														sx={{
															flexDirection: "column",
															alignItems: "flex-start"
														}}
													>
														<Typography variant='caption' sx={{
															textTransform: "capitalize",
															fontWeight: "500"
														}}>{item.name.toLowerCase()},</Typography>
														<Typography variant='caption' sx={{
															textTransform: "capitalize"
														}}>{item?.address?.street_address?.toLowerCase()}</Typography>
													</MenuItem>)
												})}
											</Select>
										</div>
									</div>

									<div className="selector">
										<div className="input-box">
											<p className="txt">
												Shipping Address
											</p>

											<Select
												name="choose-address"
												className="choose-select"
												onChange={onHandleShippingAddress}
												maxRows={10}
												disabled={shippingAddressList.length === 0}
												variant='standard'
												MenuProps={{
													PaperProps: {
														sx: {
															'& .MuiMenuItem-root': {
																maxWidth: isMobile ? "100%" : "280px",
																fontSize: "14px",
																whiteSpace: "unset"
															},
														},
													},
												}}
											>
												{shippingAddressList.map((shippingAddress) => {
													return (
													<MenuItem
														value={shippingAddress.id}
														key={shippingAddress.id}
														sx={{
															flexDirection: "column",
															alignItems: "flex-start"
														}}
													>
														<Typography variant='caption' sx={{
															fontWeight: "500"
														}}>{shippingAddress.street_address}, </Typography>
														<Typography variant='caption' sx={{
															textTransform: "capitalize"
														}}>{shippingAddress.city}, {shippingAddress.country} {shippingAddress.postal_code}</Typography>
													</MenuItem>)
												})}
											</Select>
										</div>
									</div>

								</div>
							</Col>

							<Col md={4}>
								<Summary
									billDetails={billDetails}
									onHandleOrderPlaced={() => onHandleOrderPlaced(storeId, billDetails, selectedShippingAddressId)}
									isPlaceOrderBtnDisabled={!(isStoreSelected && pincodeValue)}
								/>
							</Col>
						</Row>
					</Container>
				)}
			</div>
			<Support />
		</>
	);
};

export default CartProductList;
