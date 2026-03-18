"use strict";
import Category from "./Category.js";
import Color from "./Color.js";
import Product from "./Product.js";
import User from "./User.js";
import VehicleDetail from "./VehicleDetails.js";
import Banner from "./Banner.js";
import Material from "./Material.js";
import Review from "./Review.js";
import CartProduct from "./CartProduct.js";
import Store from "./Store.js";
import Order from "./Order.js";
import WebSetting from "./WebSetting.js";
import Design from "./Design.js";
import VehicleCategory from "./VehicleCategory.js";
import Brand from "./Brand.js";
import BrandModel from "./BrandModel.js";
import { BlogPaths } from "../../modules/blogs/swagger/index.js";
import { BlogCategoryPaths } from "../../modules/blog-categories/swagger/index.js";

export default {
    ...Category,
    ...Color,
    ...Product,
    ...User,
    ...VehicleDetail,
    ...Banner,
    ...Material,
    ...Review,
    ...CartProduct,
    ...Store,
    ...Order,
    ...WebSetting,
    ...Design,
    ...VehicleCategory,
    ...Brand,
    ...BrandModel,
    ...BlogPaths,
    ...BlogCategoryPaths
};
