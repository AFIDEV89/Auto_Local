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
import { Navigation, Thumbs, Autoplay } from "swiper";
import { Helmet } from "react-helmet";

import ProductInfoTabs from './ProductInfoTabs';
import SideProductInfo from './modules/sideProductInfo';
import { RelatedProducts } from './modules';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { ShopNowModal } from "@views/components";
import { ROUTES } from "@shared/constants";

const ZoomPanel = ({ data }) => {
	if (!data.show) return null;

	return (
		<div 
			className="hidden lg:block absolute left-[102%] top-0 w-full h-full bg-white z-[999] border border-slate-200 shadow-2xl overflow-hidden rounded-sm"
			style={{ pointerEvents: 'none' }}
		>
			<div 
				className="w-full h-full"
				style={{
					backgroundImage: `url("${data.picture}")`,
					backgroundPosition: `${data.xPerc}% ${data.yPerc}%`,
					backgroundSize: '300% auto', // Deeper zoom for better visibility
					backgroundRepeat: 'no-repeat'
				}}
			/>
		</div>
	);
};

const ZoomImage = ({
	picture,
	setZoomData
}) => {
	const handleMouseMove = e => {
		const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
		
		// Calculate mouse position relative to image
		const x = e.clientX - left
		const y = e.clientY - top
		
		// Calculate percentage for background position with significant overshoot to ensure full coverage of high-aspect ratio images
		const xPerc = Math.max(0, Math.min(100, (x / width) * 140 - 20))
		const yPerc = Math.max(0, Math.min(100, (y / height) * 140 - 20))

		setZoomData({
			show: true,
			picture,
			xPerc,
			yPerc,
			mouseX: x,
			mouseY: y
		})
	}

	const handleMouseLeave = () => {
		setZoomData({ show: false, picture: null, xPerc: 0, yPerc: 0, mouseX: 0, mouseY: 0 })
	}

	return (
		<div 
			onMouseMove={handleMouseMove} 
			onMouseLeave={handleMouseLeave} 
			className="product-image-carousal relative cursor-crosshair overflow-hidden bg-white flex items-center justify-center w-full h-full"
		>
			<img itemProp="image" src={picture} alt="" className="w-full h-full object-cover" />
			{/* No ghost layer needed if pointerEvents work on container */}
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
	const [thumbsSwiper, setThumbsSwiper] = useState(null);
	const [zoomData, setZoomData] = useState({ 
		show: false, 
		picture: null, 
		xPerc: 0, 
		yPerc: 0, 
		mouseX: 0, 
		mouseY: 0 
	});

	const showShopNowModal = (product) => {
		setSelectedProduct(product);
		setModalVisible(true);
	};

	const toggleModal = () => {
		setModalVisible(false);
		setSelectedProduct(null); // Reset the product after closing the modal
	};
	return (
		<div itemScope="" itemType="https://schema.org/Product" className="bg-slate-50 min-h-screen pb-20">
			<Container className="pt-6 max-w-[1440px]">
				<div className="flex flex-col lg:flex-row gap-4 relative items-start bg-white p-4 sm:p-6 shadow-sm border border-slate-200 rounded-sm">
					{/* Left Column: Images & Primary Actions */}
					<div className={`w-full lg:w-[40%] flex flex-col gap-4 lg:sticky lg:top-32 ${zoomData.show ? 'z-[50]' : 'z-10'}`}>
						<div className="detail-view-wrapper border border-slate-200 p-2 bg-white relative aspect-square group rounded-lg">
							<Swiper
								spaceBetween={10}
								navigation={{
									nextEl: '.main-swiper-next',
									prevEl: '.main-swiper-prev',
								}}
								thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
								modules={[Navigation, Thumbs, Autoplay]}
								autoplay={{ delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: false }}
								loop={true}
								className="mySwiper h-full overflow-hidden rounded-lg"
							>
								{pictures.map((picture, index) => (
									<SwiperSlide key={index} className="h-full">
										<ZoomImage picture={picture} setZoomData={setZoomData} />
									</SwiperSlide>
								))}
							</Swiper>
							
							{/* Modern Navigation Buttons on Main Image */}
							<button className="main-swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50 border border-slate-100">
								<span className="material-symbols-outlined text-[20px] text-slate-700">arrow_back_ios_new</span>
							</button>
							<button className="main-swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50 border border-slate-100">
								<span className="material-symbols-outlined text-[20px] text-slate-700">arrow_forward_ios</span>
							</button>
							
							{/* Lens effect on main image */}
							{zoomData.show && (
								<div 
									className="absolute border border-white/40 bg-white/20 pointer-events-none z-30 shadow-[0_0_0_9999px_rgba(0,0,0,0.1)]"
									style={{
										width: '180px',
										height: '180px',
										left: `${zoomData.mouseX + 8 - 90}px`, 
										top: `${zoomData.mouseY + 8 - 90}px`,
										pointerEvents: 'none'
									}}
								/>
							)}

							{isLogin && <div className="wishlist-button !absolute !top-4 !right-4 z-10" onClick={addToWishList}>
								<FontAwesomeIcon icon={faHeart} />
							</div>}
						</div>

						<ZoomPanel data={zoomData} />

						{/* Thumbnail Navigation */}
						<div className="thumbnail-wrapper w-full overflow-hidden">
							<Swiper
								onSwiper={setThumbsSwiper}
								spaceBetween={10}
								slidesPerView={5}
								watchSlidesProgress={true}
								modules={[Navigation, Thumbs]}
								className="thumbSwiper"
							>
								{pictures.map((picture, index) => (
									<SwiperSlide key={index} className="cursor-pointer border border-slate-200 rounded-lg overflow-hidden aspect-square transition-all hover:border-[#ffb400]">
										<img src={picture} alt="" className="w-full h-full object-cover" />
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					</div>

					{/* Right Column: Title, Details & Highlights */}
					<div className="w-full lg:w-[60%] flex flex-col lg:pl-4">
						<Breadcrumb className="mb-1 text-[12px] opacity-70">
							<BreadcrumbItem>
								<Link to="/">Home</Link>
							</BreadcrumbItem>
							{product?.category?.name && <BreadcrumbItem active>
								{product?.category?.name}
							</BreadcrumbItem>}
						</Breadcrumb>

						<h1 className="text-[26px] sm:text-[30px] font-bold text-slate-900 leading-tight mb-2" itemProp="name">{product.name}</h1>
						
						{/* SideProductInfo holds the Price, Ratings, Vehicles, Models, etc. We render it here inline */}
						<SideProductInfo product={product} />

						{/* Massive Flipkart-style Buttons repositioned here */}
						<div className="flex flex-col gap-3 mt-8">
							<div className="flex flex-col sm:flex-row items-stretch gap-2 w-full sm:gap-3">
								{product.is_saleable ? (
									<>
										<button
											className="flex-1 min-w-0 py-3 sm:py-4 bg-[#ffb200] text-white font-bold text-[14px] sm:text-[18px] shadow-lg shadow-[#ffb200]/30 hover:bg-[#e6a100] uppercase flex items-center justify-center gap-2 rounded-lg transition-all"
											onClick={() => onAddToCart(product.id, true)}
										>
											<span className="material-symbols-outlined text-xl font-bold">payments</span>
											<span className="whitespace-nowrap">BUY NOW</span>
										</button>
										<button
											className="flex-1 min-w-0 py-3 sm:py-4 border-2 border-[#ffb200] text-[#ffb200] font-bold text-[14px] sm:text-[18px] hover:bg-[#ffb200] hover:text-white uppercase flex items-center justify-center gap-2 rounded-lg transition-all"
											onClick={() => onAddToCart(product.id)}
										>
											<span className="material-symbols-outlined text-xl font-bold">add_shopping_cart</span>
											<span className="whitespace-nowrap">ADD TO CART</span>
										</button>
									</>
								) : (
									<button
										className="flex-1 min-w-0 py-3 sm:py-4 bg-[#ffb200] text-white font-bold text-[14px] sm:text-[18px] shadow-lg shadow-[#ffb200]/30 hover:bg-[#e6a100] uppercase flex items-center justify-center gap-2 rounded-lg transition-all"
										onClick={() => showShopNowModal(product)}
									>
										<span className="material-symbols-outlined text-xl font-bold">contact_support</span>
										<span className="whitespace-nowrap">ENQUIRY NOW</span>
									</button>
								)}
								
								<button
									className="flex-1 min-w-0 py-3 sm:py-4 bg-[#25D366] text-white font-bold text-[14px] sm:text-[16px] shadow-lg shadow-[#25D366]/10 hover:bg-[#20ba5a] uppercase flex items-center justify-center gap-2 rounded-lg transition-all"
									onClick={() => {
										const productUrl = window.location.href;
										const message = `Check out this amazing product: ${product.name}\nPrice: ₹${product.price}\nLink: ${productUrl}`;
										const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
										window.open(whatsappUrl, '_blank');
									}}
								>
									<svg 
										className="w-5 h-5 fill-current" 
										viewBox="0 0 24 24" 
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.602 6.04L0 24l6.117-1.605a11.803 11.803 0 005.925 1.585h.005c6.635 0 12.03-5.396 12.033-12.03a11.811 11.811 0 00-3.417-8.243z"/>
									</svg>
									<span className="whitespace-nowrap uppercase">SHARE</span>
								</button>
							</div>
							<button
								className="w-full py-2.5 sm:py-3 bg-[#FFF9EA] text-[#B48A21] font-bold border border-[#FFE4A0] hover:bg-[#FFF2D1] transition-colors uppercase flex items-center justify-center gap-2 rounded-lg shadow-sm text-[14px] sm:text-[16px] whitespace-nowrap"
								onClick={() => navigate(ROUTES.STORE_LOCATOR)}
							>
								<span className="material-symbols-outlined text-xl font-bold">storefront</span>
								SELECT STORE
							</button>
						</div>
					</div>
				</div>

				{selectedProduct && <ShopNowModal isOpen={isModalVisible} toggleModal={toggleModal} product={selectedProduct} />}

				{/* Bottom Full-Width Section for Description/Reviews */}
				<div className="mt-8 flex flex-col gap-8">
					<ProductInfoTabs product={product} />
					
					{/* Dedicated Related Products Section */}
					<div className="w-full mt-4">
						<RelatedProducts
							product={product}
							productCategoryId={product.category_id}
						/>
					</div>
				</div>
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
