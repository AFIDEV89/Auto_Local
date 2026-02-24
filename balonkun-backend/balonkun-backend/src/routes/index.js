"use strict";
import ProductCategoryAdminRoutes from "../modules/product-categories/ProductCategoryAdminRoutes.js";
import ProductCategoryUserRoutes from "../modules/product-categories/ProductCategoryUserRoutes.js";
import ColorRoutes from "../modules/colors/ColorAdminRoutes.js";
import ProductAdminRoutes from "../modules/products/ProductAdminRoutes.js";
import ProductUserRoutes from '../modules/products/ProductUserRoutes.js';
import UserRoutes from "./User.js";
import VehicleDetailsRoutes from "../modules/vehicle-details/VehicleDetailRoutes.js";
import BannerAdminRoutes from "../modules/banners/BannerAdminRoutes.js";
import BannerUserRoutes from "../modules/banners/BannerUserRoutes.js";
import MaterialRoutes from "../modules/materials/MaterialAdminRoutes.js";
import ReviewRoutes from "../modules/reviews/ReviewRoutes.js";
import DashboardUserRoutes from "../modules/dashboard/DashboardUserRoutes.js";
import CartProductUserRoutes from "../modules/cart-products/CartProductUserRoutes.js";
import StoreRoutes from "../modules/stores/StoreRoutes.js";
import OrderRoutes from "../modules/orders/OrderRoutes.js";
import WebSettingRoutes from "../modules/web-settings/WebSettingRoutes.js";
import DesignRoutes from '../modules/designs/DesignAdminRoutes.js';
import VehicleCategoriesRoutes from '../modules/vehicle-categories/VehicleCategoryRoutes.js';
import BrandRoutes from '../modules/brands/BrandRoutes.js';
import BrandModelRoutes from '../modules/brand-models/BrandModelRoutes.js';
import BlogAdminRoutes from '../modules/blogs/BlogAdminRoutes.js';
import BlogUserRoutes from '../modules/blogs/BlogUserRoutes.js';
import BlogCategoryAdminRoutes from '../modules/blog-categories/BlogCategoryAdminRoutes.js';
import UploadDataRoutes from '../modules/upload-data/UploadDataRoutes.js';
import WishlistUserRoutes from '../modules/wishlist/WishlistUserRoutes.js';

import config from "../../config.js";
import SearchRouter from "../modules/search/SearchRouter.js";
import seo_data_router from "../api/seo/seo_data_index.js";
import contact_us_router from "../api/contact_us/contact_us_router.js";
import lead_data_router from "../api/leads_generation/lead_data_index.js";

/**
 * Define all module api's base urls
 */
const router = (app) => {
    app.use(`${config.API_BASE_URL}search`, SearchRouter);
    app.use(`${config.API_BASE_URL}user`, UserRoutes);
    app.use(`${config.API_BASE_URL}product`, ProductAdminRoutes);
    app.use(`${config.API_BASE_URL}user/product`, ProductUserRoutes);
    app.use(`${config.API_BASE_URL}category`, ProductCategoryAdminRoutes);
    app.use(`${config.API_BASE_URL}user/category`, ProductCategoryUserRoutes);
    app.use(`${config.API_BASE_URL}color`, ColorRoutes);
    app.use(`${config.API_BASE_URL}vehicle-detail`, VehicleDetailsRoutes);
    app.use(`${config.API_BASE_URL}banner`, BannerAdminRoutes);
    app.use(`${config.API_BASE_URL}user/banner`, BannerUserRoutes);
    app.use(`${config.API_BASE_URL}material`, MaterialRoutes);
    app.use(`${config.API_BASE_URL}review`, ReviewRoutes);
    app.use(`${config.API_BASE_URL}user/dashboard`, DashboardUserRoutes);
    app.use(`${config.API_BASE_URL}cart-product`, CartProductUserRoutes);
    app.use(`${config.API_BASE_URL}store`, StoreRoutes);
    app.use(`${config.API_BASE_URL}order`, OrderRoutes);
    app.use(`${config.API_BASE_URL}web-setting`, WebSettingRoutes);
    app.use(`${config.API_BASE_URL}design`, DesignRoutes);
    app.use(`${config.API_BASE_URL}vehicle-category`, VehicleCategoriesRoutes);
    app.use(`${config.API_BASE_URL}brand`, BrandRoutes);
    app.use(`${config.API_BASE_URL}brand-model`, BrandModelRoutes);
    app.use(`${config.API_BASE_URL}admin/blogs`, BlogAdminRoutes);
    app.use(`${config.API_BASE_URL}user/blogs`, BlogUserRoutes);
    app.use(`${config.API_BASE_URL}admin/blog-categories`, BlogCategoryAdminRoutes);

    app.use(`${config.API_BASE_URL}lead`,lead_data_router)
    app.use(`${config.API_BASE_URL}upload`, UploadDataRoutes);
    app.use(`${config.API_BASE_URL}user/wishlist`, WishlistUserRoutes);
    app.use(`${config.API_BASE_URL}seo`, seo_data_router);
    app.use(`${config.API_BASE_URL}contactus`, contact_us_router);


};

export default router;
