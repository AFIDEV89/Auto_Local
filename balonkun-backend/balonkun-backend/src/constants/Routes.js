"use strict";
import { MODULE_TYPE } from "./index.js";
import { getApiUrl } from "../utils/index.js";

export const API_POST_URLS = {
    LOGIN: "/login",
    SIGN_UP: "/sign-up",
    LOGOUT: "/logout",
    USER_UPDATE: "/update",
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    CHANGE_PASSWORD: '/change-password',
    CREATE: "/create",
    UPDATE: "/update/:id",
    GET_LIST: "/get-list",
    DELETE: "/delete/:id",
    GET: "/:id",
    GET_VEHICLE_TYPES: "/vehicle-types",
    GET_REVIEWS_BY_PRODUCT_ID: "/get-reviews-by-product-id/:id",
    GET_PRODUCT_GALLERY: "/product-gallery/:id",
    GET_DASHBOARD_PRODUCT_LIST: "/get-product-list",
    COUNT: "/count",
    CHANGE_STATUS: "/change-status",
    CHANGE_STATUS_ID: "/change-status/:id",
    VERIFY_EMAIL: "/verify-email/:token",
    GET_REFRESH_TOKEN: '/refresh-token/:id',
    RESEND_VERIFY_EMAIL: "/resend-verify-email",
    UPDATE_WITHOUT_ID: "/update",
    DETAIL: "/detail",
};

export const AdminPublicRoutes = [
    'user/refresh-token',
    'user/login',
    'lead/admin'
];

export const WebPrivateRoutes = [
    'user/update',
    'user/logout',
    'user/address',
    'user/change-password',
    'cart-product/create',
    'cart-product/update',
    'cart-product/delete',
    'cart-product/get-list',
    'cart-product/count',
    'order/create',
    'order/user',
    'user/wishlist'
];

export const Routes = [
    //** USER
    {
        path: getApiUrl(MODULE_TYPE.USER, "/sign-up"),
        fields: ["first_name", "last_name", "email", "password"],
        isPublic: true,
    },

    //** CATEGORY
    { path: getApiUrl(MODULE_TYPE.CATEGORY, "/create"), fields: ["name"] },
    { path: getApiUrl(MODULE_TYPE.MATERIAL, "/create"), fields: ["name"] },
    { path: getApiUrl(MODULE_TYPE.REVIEW, "/create"), fields: ["product_id", "name", "description", "rating"] },
    { path: getApiUrl(MODULE_TYPE.CART_PRODUCT, "/create"), fields: ["product_id"] },
    { path: getApiUrl(MODULE_TYPE.STORE, "/create"), fields: ["name", "email", "contact_no", "street_address", "city", "state", "postal_code", "country", "latitude", "longitude"] },
    { path: getApiUrl(MODULE_TYPE.STORE, "/update/:id"), fields: ["id", "name", "email", "contact_no", "street_address", "city", "state", "postal_code", "country", "latitude", "longitude"] },
    { path: getApiUrl(MODULE_TYPE.STORE, "/get-list"), fields: [] },
    { path: getApiUrl(MODULE_TYPE.STORE, "/delete/:id"), fields: ["id"] },
    { path: getApiUrl(MODULE_TYPE.STORE, "/:id"), fields: ["id"] },
    { path: getApiUrl(MODULE_TYPE.ORDER, "/create"), fields: ["store_id"] },
    { path: getApiUrl(MODULE_TYPE.ORDER, "/change-status/:id"), fields: ["id", "status"] },
];
