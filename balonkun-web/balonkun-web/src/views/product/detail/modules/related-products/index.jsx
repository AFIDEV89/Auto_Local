import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import * as actions from '@redux/actions';
import { ROUTES, MODULES } from '@shared/constants';
import { useHandleCalls } from '@views/components/custom-hooks';
import RelatedProductsComponent from './Component';

const RelatedProducts = ({
	product,
	productCategoryId
}) => {
	const [relatedProducts, setRelatedProducts] = useState(MODULES.PAGINATION.INITIAL_DATA);
	const isLogin = useSelector((state) => state.user.isLogin);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleNavigation = useCallback(() => {
		if (productCategoryId) {
			navigate(`${ROUTES.PRODUCT_LISTING}?pcid=${productCategoryId}`);
		} else {
			navigate(ROUTES.PRODUCT_LISTING);
		}
	}, [productCategoryId, navigate]);

	const handleAddToCart = useCallback((pid, cb = () => { }) => {
		if (isLogin) {
			dispatch(
				actions.cartProductCreate(pid, () => {
					cb();
				})
			);
		} else {
			navigate('/login');
		}
	},
		[dispatch, isLogin, navigate]
	);

	const handleProductOnClick = useCallback((product) => {
		const navSubPath = product.seo_canonical || product.id;

		navigate(`${ROUTES.PRODUCT}/${navSubPath}`);
	}, [navigate]);

	const handleFetchRelatedProducts = () => {
		const query = {
			filters: {
				vehicle_types: [product.vehicle_detail.vehicle_type_id],
				product_categories: [productCategoryId]
			},
			page: 1,
			limit: 12,
		};

		dispatch(actions.getProductListRequest(query, (res) => {
			if (res) {
				setRelatedProducts({ list: res.list, total_count: res.total_count });
			}
		}))
	};

	useHandleCalls(() => {
		setRelatedProducts(MODULES.PAGINATION.INITIAL_DATA);
		handleFetchRelatedProducts();
	},
		[productCategoryId],
		'fetchingRelatedProducts'
	);

	return (
		<RelatedProductsComponent
			related_products={relatedProducts}
			onProductClick={handleProductOnClick}
			onAddToCart={handleAddToCart}
			onNavigation={handleNavigation}
		/>
	);
}

export default RelatedProducts;
