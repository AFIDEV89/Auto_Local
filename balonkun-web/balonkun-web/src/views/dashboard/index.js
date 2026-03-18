import React, { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as actions from '@redux/actions';
import { ROUTES } from '@shared/constants';

import { SelectVehicleModal } from '../components';
import { Blogs, ProductSlider, TestimonialSlider, WhatWeOffer, SocialUpdates, SelectVehicle, ExploreCategories, DealerNetwork } from './components';
import Banner from './components/banner/Banner';
import SelectDesktopVehicle from "./components/select-desktop-vehicle";
import SocialUpdatesDesktop from "./components/social-updates/SocialUpdatesDesktop";

const vehicleTypeList = [
	{
		id: 2,
		name: "4W",
		display: "4 Wheelers"
	},
	{
		id: 1,
		name: "2W",
		display: "2 Wheelers"
	}
]

const Dashboard = ({ categoryList }) => {
	const isMobile = useMediaQuery('(max-width:767px)');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userDetails = useSelector((state) => state.user);

	const [bannerList, setbannerList] = useState([]);
	const [blogs, setBlogs] = useState([]);
	const [isOpenSelectVehicleModal, setToggleSelectVehicleModal] = useState(false);

	const handleSelectVehicleModal = useCallback((value) => {
		setToggleSelectVehicleModal(value);
	}, []);

	const handleProductOnClick = (product) => {
		const navSubPath = product.seo_canonical || product.id;

		navigate(`${ROUTES.PRODUCT}/${navSubPath}`);
	};

	const createCartProduct = (pid) => {
		if (userDetails.isLogin) {
			dispatch(actions.cartProductCreate(pid, () => { }));
		} else {
			navigate('/login');
		}
	};

	useEffect(() => {
		dispatch(
			actions.getBannerListRequest((list) => {
				if (list?.length > 0) {
					setbannerList(list);
				}
			})
		);
		dispatch(
			actions.getDashboardBlogListRequest({}, (blogs) => {
				setBlogs(blogs);
			})
		);
	}, [dispatch]);

	return (
		<div className="theme-premium">
			{/* Section 2: Cinematic Hero */}
			<Banner bannerList={bannerList} />

			{/* Section 3: Floating Vehicle Finder */}
			{isMobile ? <SelectVehicle /> : <SelectDesktopVehicle />}

			{/* Section 4: Explore Categories */}
			<ExploreCategories />

			{/* Section 5: Trending Products */}
			<ProductSlider
				onClickProduct={handleProductOnClick}
				onCreateCartProduct={createCartProduct}
				title="Trending This Season"
				categoryList={categoryList}
				vehicleTypeList={vehicleTypeList}
			/>

			{/* Section 6: Nationwide Dealer Network */}
			<DealerNetwork />

			{/* Section 7: Why Autoform - New Section */}
			<WhatWeOffer />

			{/* Section 6: Retail Network & Social - Integration point */}
			{isMobile ? <SocialUpdates title="Social Connect" /> : <SocialUpdatesDesktop title="Social Connect" />}

			{/* Section 8: Testimonials */}
			<TestimonialSlider />

			{/* Section: Blogs */}
			<Blogs blogs={blogs} />

			<SelectVehicleModal
				isOpen={isOpenSelectVehicleModal}
				userDetails={userDetails}
				onToggle={handleSelectVehicleModal}
			/>
		</div>
	);
}

export default Dashboard;
