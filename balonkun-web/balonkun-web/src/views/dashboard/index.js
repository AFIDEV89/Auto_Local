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
import { Blogs, ProductSlider, TestimonialSlider, WhatWeOffer, SocialUpdates, SelectVehicle } from './components';
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

function Dashboard({ categoryList }) {
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
		<>
			<Banner bannerList={bannerList} />
			{isMobile ? <SelectVehicle /> : <SelectDesktopVehicle />}
			<ProductSlider
				onClickProduct={handleProductOnClick}
				onCreateCartProduct={createCartProduct}
				title="Trending Products"
				categoryList={categoryList}
				vehicleTypeList={vehicleTypeList}
			/>
			<WhatWeOffer />
			{isMobile ? <SocialUpdates title="Social Connect" /> : <SocialUpdatesDesktop title="Social Connect" />}
			<TestimonialSlider />
			<Blogs blogs={blogs} />
			<SelectVehicleModal
				isOpen={isOpenSelectVehicleModal}
				userDetails={userDetails}
				onToggle={handleSelectVehicleModal}
			/>
		</>
	);
}

export default Dashboard;
