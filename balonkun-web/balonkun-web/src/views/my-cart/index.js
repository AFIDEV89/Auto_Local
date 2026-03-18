import * as actions from '@redux/actions';
import { errorAlert } from '@utils';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CartProductList } from './components';
import { getDataApi } from "@services/ApiCaller";

const MyCart = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [cartList, setCartList] = useState([]);
	const [storeAddresslist, setStoreAddressList] = useState([]);
	const [shippingAddress, setShippingAddress] = useState([]);

	useEffect(() => {
		dispatch(
			actions.getCartProductRequest((list) => {
				if (list) {
					setCartList(list);
					if (list.length > 0) {
						dispatch(
							actions.getStoreAddressRequest((list) => {
								setStoreAddressList(list);
							})
						);
					}
				}
			})
		);

		fetchShippingAddress();
	}, []);

	const fetchShippingAddress = async () => {
		try {
			const addressesData = await getDataApi({
				path: `/user/address`
			});

			if (addressesData?.data?.data) {
				setShippingAddress([...addressesData.data.data])
			} else {
				setShippingAddress([])
			}

		} catch (e) {
			errorAlert('Something went wrong. Please try again.');
		}
	}

	const handleSetCartList = (list) => {
		setCartList(list);
	};

	const onHandleOperationType = (pid, operationType) => {
		const data = { pid, operationType };
		dispatch(actions.cartProductUpdate(data, () => { }));
	};

	const onCartProductDelete = (pid) => {
		dispatch(actions.cartProductDelete(pid, () => { }));
	};

	const onHandleOrderPlaced = (storeId, billDetails, shippingAddressId) => {
		if (storeId === "" || storeId === 'choose_address') {
			errorAlert("Please select store");
		} else {
			dispatch(actions.placedOrderCreate({
				storeId,
				...(shippingAddressId && {
					user_address_id: shippingAddressId
				})
			}, (res) => {
				if (res) {
					navigate('/thank-you', {
						state: {
							...res,
							billDetails,
							...(shippingAddressId && {
								user_address_id: shippingAddressId
							})
						}
					});
					dispatch(actions.resetCartProductCount());
				}
			}));
		};
	};

	return (
		<CartProductList
			cartList={cartList}
			storeAddresslist={storeAddresslist}
			shippingAddressList={shippingAddress}
			onSetCartList={handleSetCartList}
			onHandleOperationType={onHandleOperationType}
			onCartProductDelete={onCartProductDelete}
			onHandleOrderPlaced={onHandleOrderPlaced}
		/>
	);
};

export default MyCart;
