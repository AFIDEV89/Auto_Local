import React, { useState } from "react"
import { SelectVehicleModal } from '@views/components';
import { Link } from 'react-router-dom';
import {
	Breadcrumb,
	BreadcrumbItem,
	Button,
	Col,
	Container,
	Row,
} from 'reactstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Helmet } from "react-helmet";

import ProductInfoTabs from './ProductInfoTabs';
import SideProductInfo from './modules/sideProductInfo';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { ShopNowModal } from "@views/components";

const ZoomImage = ({
	picture
}) => {
	const [state, setState] = useState({
		backgroundPosition: '0% 0%'
	})

	const handleMouseMove = e => {
		const { left, top, width, height } = e.target.getBoundingClientRect()
		const x = (e.pageX - left) / width * 100
		const y = (e.pageY - top) / height * 100
		setState((prev) => ({ ...prev, backgroundImage: `url("${picture}")`, backgroundPosition: `${x}% ${y}%` }))
	}

	const handleMouseLeave = () => {
		setState((prev) => ({ backgroundPosition: '0% 0%' }))
	}

	return (
		<div onMouseMove={handleMouseMove} onTouchMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={state} className="product-image-carousal">
			<img itemprop="image" src={picture} alt="" />
		</div>
	)
}

const DetailComponent = ({
	navigate,
	product,
	isValidProductForUser,
	userDetails,
	isOpenSelectVehicleModal,
	pictures,
	onAddToCart,
	onSetUserVehicle,
	onToggleSelectVehicleModal,
	addToWishList
}) => {
	const { isLogin } = useSelector(state => state.user);
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const showShopNowModal = (product) => {
		setSelectedProduct(product);
		setModalVisible(true);
	};

	const toggleModal = () => {
		setModalVisible(false);
		setSelectedProduct(null); // Reset the product after closing the modal
	};
	return (
		<div itemscope="" itemtype="https://schema.org/Product">
			<div className="detail-view-wrapper">
				<Swiper
					slidesPerView={3}
					autoplay={{
						delay: 1500,
						pauseOnMouseEnter: true,
						disableOnInteraction: false
					}}
					loop={true}
					className="mySwiper"
					breakpoints={{
						0: {
							slidesPerView: 1
						},
						600: {
							slidesPerView: 2
						},
						1000: {
							slidesPerView: 3
						}
					}}
				>
					{pictures.map((picture, index) => (
						<SwiperSlide key={index}>
							<ZoomImage picture={picture} />
						</SwiperSlide>
					)
					)}
				</Swiper>
				{isLogin && <div className="wishlist-button" onClick={addToWishList}>
					<FontAwesomeIcon icon={faHeart} />
				</div>}
			</div>

			<Helmet>
				{product?.seo_title && <title>{product.seo_title}</title>}
				{product?.seo_description && <meta name='description' content={product.seo_description} data-react-helmet="true" />}
				{product?.seo_canonical && <link rel="canonical" href={"/product/" + product.seo_canonical} data-react-helmet="true" />}
				<script type="application/ld+json">{`
					{
						"@context": "http://schema.org",
						"@type": "BreadcrumbList",
						"itemListElement": [
							{
								"@type": "ListItem",
								"position": 1,
								"item": {
									"name": "Home",
									"@id": "https://www.autoformindia.com"
								}
							},
							{
								"@type": "ListItem",
								"position": 2,
								"item": {
									"name": "${product?.category?.name}"
								}
							}
						]
					}
					`}
				</script>
			</Helmet>

			<Container>
				<Breadcrumb>
					<BreadcrumbItem>
						<Link to="/">Home</Link>
					</BreadcrumbItem>
					{product?.category?.name && <BreadcrumbItem active>
						{product?.category?.name}
					</BreadcrumbItem>}
				</Breadcrumb>

				<div className="titleWrapper">
					<h1 className="pageTitle" itemProp="name">{product.name}</h1>
					<div className="vehicle-actions">
						<div className="btn-wrap">
							<Button
								className="add-to-cart-btn"
								onClick={() => showShopNowModal(product)}
							>
								Shop Now
							</Button>
							<Button
								className="add-to-cart-btn"
								onClick={() => onAddToCart(product.id)}
							>
								Add to Cart
							</Button>
							<Button
								className="buy-now"
								onClick={() => {
									onAddToCart(product.id, () => {
										if (userDetails.isLogin) {
											navigate('/my-cart');
										} else {
											navigate('/login');
										}
									});
								}}
							>
								Select Store
							</Button>
						</div>
					</div>
				</div>
				{selectedProduct &&
					<ShopNowModal isOpen={isModalVisible} toggleModal={toggleModal} product={selectedProduct} />}
				<Row>
					<Col lg={8} md={12} xs={12} >
						<ProductInfoTabs product={product} />
					</Col>
					<Col lg={4} md={12}>
						<SideProductInfo product={product} />
					</Col>
				</Row>
			</Container>

			<SelectVehicleModal
				isOpen={isOpenSelectVehicleModal}
				product={product}
				warning={
					isValidProductForUser
						? ''
						: 'This product is not for the selected vehicle.'
				}
				userDetails={userDetails}
				onSetUserVehicle={onSetUserVehicle}
				onToggle={onToggleSelectVehicleModal}
			/>
		</div>
	);
}

export default DetailComponent;
