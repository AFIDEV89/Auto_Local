import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import { ProductCard, ShopNowModal } from '@views/components';
import { Box, Button } from "@mui/material";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const RelatedProducts = ({
	related_products,
	onProductClick,
	onAddToCart,
	onNavigation,
}) => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const showShopNowModal = (product) => {
		setSelectedProduct(product);
		setModalVisible(true);
	};

	const toggleModal = () => {
		setModalVisible(false);
		setSelectedProduct(null);
	};

	if (!related_products?.list?.length) {
		return <div className="text-slate-400 italic py-10 text-center">No related products found.</div>;
	}

	return (
		<Box className="related-products-slider relative mt-4">
			{/* Header with Custom Navigation (Knowledge Base Style) */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
				<div className="flex flex-col gap-1">
					<span className="text-[#ffb200] text-[10px] font-black uppercase tracking-[0.25em]">Recommendations</span>
					<h2 className="text-4xl font-bold text-slate-900 leading-tight">Related Products.</h2>
					<div className="h-[4px] w-[120px] bg-[#ffb200] mt-2" />
				</div>
				
				{/* Custom Navigation Buttons (Right Aligned) */}
				<div className="flex items-center gap-6 pb-1">
					<button className="rp-prev flex items-center gap-3 group transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed text-slate-300 hover:text-slate-900">
						<span className="text-2xl font-light">←</span>
						<span className="text-[10px] font-black uppercase tracking-[0.1em]">Previous</span>
					</button>
					<div className="h-4 w-[1px] bg-slate-200" />
					<button className="rp-next flex items-center gap-3 group transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed text-slate-300 hover:text-slate-900">
						<span className="text-[10px] font-black uppercase tracking-[0.1em]">Next</span>
						<span className="text-2xl font-light">→</span>
					</button>
				</div>
			</div>

			<Swiper
				modules={[Navigation, Pagination, Autoplay]}
				spaceBetween={30}
				slidesPerView={1}
				navigation={{
					prevEl: '.rp-prev',
					nextEl: '.rp-next',
				}}
				loop={true}
				pagination={{ clickable: true }}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
					pauseOnMouseEnter: true
				}}
				breakpoints={{
					640: { slidesPerView: 2 },
					1024: { slidesPerView: 3 },
				}}
				className="related-products-swiper !pb-14"
			>
				{related_products.list.map((item, i) => (
					<SwiperSlide key={i} className="h-auto">
						<ProductCard
							product={item}
							onClickProduct={onProductClick}
							showShopNowModal={showShopNowModal}
						/>
					</SwiperSlide>
				))}
			</Swiper>

			{selectedProduct && (
				<ShopNowModal
					isOpen={isModalVisible}
					toggleModal={toggleModal}
					product={selectedProduct}
				/>
			)}

			<div className="flex justify-center mt-6">
				<Button 
					className="!text-slate-500 !font-bold !text-[12px] !uppercase !tracking-[0.1em] hover:!text-slate-900 transition-colors"
					onClick={() => onNavigation()}
				>
					View All Products
				</Button>
			</div>
		</Box>
	);
}

export default RelatedProducts;
