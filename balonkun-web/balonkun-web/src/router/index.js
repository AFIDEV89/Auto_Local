import React, { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";

import { scrollToTop } from '@utils';

import PrivateRoute from "./PrivateRoute";
import { PAGE_ROUTES } from "./Routes";
import { Footer, NavBar } from "../views/dashboard/components";
import { useProductCategories } from "../views/components/custom-hooks";
import MaintenancePage from "../views/Maintenance";
import WhatsAppFabButton from '@components/WhatsAppFabButton';
import FooterSkeleton from "../components/FooterSkeleton";

function AppRouter() {
	const categoryList = useProductCategories();
	const { isLogin } = useSelector((state) => state.user);
	const { pathname } = useLocation();
	const [isLoading, setIsLoading] = useState(true);

	const isMaintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === "true";

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 500);

		return () => clearTimeout(timer);
	}, [pathname]);

	if (isMaintenanceMode) {
		return <MaintenancePage />
	}

	return (
		<>
			<NavBar />
			<div className="main-content">
				<Routes>
					<>
						{PAGE_ROUTES.map((route, index) => {
							const { path, component: Component, isPrivate } = route;

							const LoaderWrapper = (<Suspense fallback={<></>}>
								<Component categoryList={categoryList} />
							</Suspense>)

							const element = isPrivate ? (<PrivateRoute isLogin={isLogin}>
								{LoaderWrapper}
							</PrivateRoute>
							) : LoaderWrapper

							return (<Route
								key={index}
								path={path}
								element={element}
							/>)

						})}
					</>
				</Routes>
			</div>
			<WhatsAppFabButton />
			{isLoading ? <FooterSkeleton /> : <Footer />}
		</>
	);
}

export default AppRouter;

